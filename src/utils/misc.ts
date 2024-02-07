import { Item, Video } from 'ytsr'

export const isVideo = (i: Item): i is Video => {
  return i.type === 'video'
}
