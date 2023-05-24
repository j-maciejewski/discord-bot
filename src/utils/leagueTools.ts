import { join } from "path";

import sharp from "sharp";
import { EmbedBuilder } from "discord.js";

import { LEAGUE_CDN_URL, LeaguePUUID, LeagueSummonerID } from "../config";
import {
  LeagueStatus,
  LowEloTiers,
  type FormattedLeagueMatch,
  type LeagueMatch,
  type LeagueRank,
  type LeagueSpell,
  type PlayerData,
  HighEloTiers,
  LowEloRanks,
} from "../types";

import { fetcher } from "./fetcher";
import { convertMsToMinutesSeconds } from "./timeTools";
import { highEloTiers, lowEloRanks, lowEloTiers } from "../consts";

const allDivisions = [
  ...lowEloTiers.map((tier) => [...lowEloRanks].reverse().map((rank) => `${tier} ${rank}`)),
  ...highEloTiers,
].flat() as unknown as `${LowEloTiers} ${LowEloRanks}` | HighEloTiers;

const sumLeaguePoints = ({
  tier,
  rank,
  points,
}: {
  tier: LowEloTiers | HighEloTiers;
  rank: LowEloRanks;
  points: number;
}) => {
  const division = ["MASTER", "GRANDMASTER", "CHALLENGER"].includes(tier)
    ? allDivisions.indexOf("MASTER") + 1
    : allDivisions.indexOf(`${tier} ${rank}`) + 1;

  return division * 100 + points;
};

const fixPromo = (progress: string) =>
  progress.replace(/W/i, "✔️").replace(/L/i, "✖️").replace(/N/i, "➖").split("").join(" ");

const getRankMessage = (leagueStatus: LeagueStatus) =>
  `${leagueStatus.tier} ${leagueStatus.rank} ${leagueStatus.miniSeries || `${leagueStatus.currentLP} LP`}`;

const getStatus = async (): Promise<LeagueStatus> => {
  const { data: ranks, error: statusError } = await fetcher<LeagueRank[]>(
    `https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${LeagueSummonerID.KEELINGUR}?api_key=${process.env.LEAGUE_API_KEY}`,
  );

  if (statusError) {
    console.log(statusError);
    return null;
  }

  const soloQ = ranks.find((rank) => rank.queueType === "RANKED_SOLO_5x5");

  if (!soloQ) return null;

  return {
    tier: soloQ.tier,
    rank: soloQ.rank,
    currentLP: soloQ.leaguePoints,
    miniSeries: soloQ.miniSeries ? fixPromo(soloQ.miniSeries.progress) : null,
    totalLP: sumLeaguePoints({ tier: soloQ.tier, rank: soloQ.rank, points: soloQ.leaguePoints }),
    wins: soloQ.wins,
    losses: soloQ.losses,
  };
};

const getLastMatch = async (puuid: LeaguePUUID) => {
  const { data: matches, error: matchesError } = await fetcher<string[]>(
    `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=420&start=0&count=1&api_key=${process.env.LEAGUE_API_KEY}`,
  );

  if (matchesError) {
    console.log(matchesError);
    return null;
  }

  if (matches.length === 0) return null;

  const { data: matchData, error: matchDataError } = await fetcher<LeagueMatch>(
    `https://europe.api.riotgames.com/lol/match/v5/matches/${matches[0]}?api_key=${process.env.LEAGUE_API_KEY}`,
  );

  if (matchDataError) {
    console.log(matchDataError);
    return null;
  }

  const playerData = matchData.info.participants.find((participant) => participant.puuid === puuid);

  const premadesPUUIDs: string[] = Object.values(LeaguePUUID).filter((_puuid) => _puuid !== puuid);

  const premades: PlayerData[] = matchData.info.participants
    .filter((player) => premadesPUUIDs.includes(player.puuid))
    .map((player) => ({
      summonerName: player.summonerName,
      championName: player.championName,
      kills: player.kills,
      deaths: player.deaths,
      assists: player.assists,
    }));

  const formatterData: FormattedLeagueMatch = {
    gameId: matchData.info.gameId,
    matchId: matchData.metadata.matchId,
    gameStartTimestamp: matchData.info.gameStartTimestamp,
    gameEndTimestamp: matchData.info.gameEndTimestamp,
    gameLength: convertMsToMinutesSeconds(matchData.info.gameEndTimestamp - matchData.info.gameStartTimestamp),
    win: playerData.win,
    player: {
      summonerName: playerData.summonerName,
      championName: playerData.championName,
      kills: playerData.kills,
      deaths: playerData.deaths,
      assists: playerData.assists,
      items: [
        playerData.item0,
        playerData.item1,
        playerData.item2,
        playerData.item3,
        playerData.item4,
        playerData.item5,
      ].filter((item) => item !== 0),
      summoners: [playerData.summoner1Id, playerData.summoner2Id],
    },
    premades,
  };

  return formatterData;
};

const createEmbed = async (matchData: FormattedLeagueMatch, prevRank: LeagueStatus, newRank: LeagueStatus) => {
  const { data: spellsData, error: spellsDataError } = await fetcher<{ data: Record<string, LeagueSpell> }>(`${LEAGUE_CDN_URL}/data/en_US/summoner.json`);

  if (spellsDataError) {
    console.log(spellsDataError);
    return null;
  }

  const spellsImages = await Promise.all(
    matchData.player.summoners.map(
      async (summonerId) =>
        await new Promise<Buffer>((resolve, reject) => {
          const spellId = Object.values(spellsData.data).find((spell) => spell.key === String(summonerId))?.id;

          fetch(`${LEAGUE_CDN_URL}/img/spell/${spellId}.png`)
            .then(async (res) => await res.arrayBuffer())
            .then(async (image) => await sharp(image).resize(100, 100).toBuffer({ resolveWithObject: true }))
            .then((sharpItem) => {
              resolve(sharpItem.data);
            });
        }),
    ),
  );

  const itemsImages = await Promise.all(
    matchData.player.items.map(
      async (item) =>
        await new Promise<Buffer>((resolve, reject) => {
          fetch(`${LEAGUE_CDN_URL}/img/item/${item}.png`)
            .then(async (res) => await res.arrayBuffer())
            .then(async (image) => await sharp(image).resize(100, 100).toBuffer({ resolveWithObject: true }))
            .then((sharpItem) => {
              resolve(sharpItem.data);
            });
        }),
    ),
  );

  await sharp(join(__dirname, "..", "..", "assets", "images", "last_match_background.png"))
    .resize(350, 375)
    .composite([
      {
        input: spellsImages[0],
        top: 25,
        left: 75,
      },
      {
        input: spellsImages[1],
        top: 25,
        left: 175,
      },
      ...itemsImages.map((item, idx) => ({
        input: item,
        top: Math.floor(idx / 3) * 100 + 150,
        left: (idx % 3) * 100 + 25,
      })),
    ])
    .jpeg({ mozjpeg: true })
    .toFile(join(__dirname, "..", "..", "tmp", `${matchData.matchId}.png`));

  const hasRankChanged = prevRank.tier !== newRank.tier || prevRank.rank !== newRank.rank;
  const leaguePointsDiff = newRank.totalLP - prevRank.totalLP;
  const rankMessage = hasRankChanged
    ? `${prevRank.tier} ${prevRank.rank} ➤ ${prevRank.tier} ${newRank.rank} ${newRank.currentLP} LP`
    : `${newRank.tier} ${newRank.rank} ${newRank.currentLP} LP ${
        newRank.miniSeries
          ? `[${newRank.miniSeries}]`
          : `${leaguePointsDiff > 0 ? `(▲ ${leaguePointsDiff} LP)` : `(▼ ${leaguePointsDiff} LP)`}`
      }`;

  const embed = new EmbedBuilder()
    .setColor(matchData.win ? 0x0099ff : 0xff0000)
    .setTitle(`${matchData.player.summonerName}`)
    .setURL(`https://www.leagueofgraphs.com/match/eune/${matchData.gameId}`)
    .setThumbnail(`${LEAGUE_CDN_URL}/img/champion/${matchData.player.championName}.png`)
    .addFields(
      { name: "KDA", value: `${matchData.player.kills}/${matchData.player.deaths}/${matchData.player.assists}` },
      { name: "Rank", value: rankMessage },
      ...(matchData.premades.length > 0
        ? [
            {
              name: "Duo",
              value: matchData.premades
                .map(
                  (player) =>
                    `${player.summonerName}\n${player.championName}: ${player.kills}/${player.deaths}/${player.assists}`,
                )
                .join("\n"),
            },
          ]
        : []),
      { name: "Game length", value: matchData.gameLength },
    )
    .setImage(`attachment://${matchData.matchId}.png`)
    .setTimestamp();

  return { embeds: [embed], files: [join(__dirname, "..", "..", "tmp", `${matchData.matchId}.png`)] };
};

export { getRankMessage, getStatus, getLastMatch, createEmbed };
