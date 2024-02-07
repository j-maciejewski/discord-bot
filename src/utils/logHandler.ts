import { appendFile } from 'fs'
import { join } from 'path'

export const logError = (errorMessage: string, data: any = {}) => {
  const currentDate = new Date()

  const time = currentDate.toLocaleTimeString()
  const date = currentDate.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const content = `[${time} ${date}] ${errorMessage} ${JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value,
  )}`

  const logPath = join(__dirname, '..', '..', 'logs', 'errors.log')

  appendFile(logPath, content, (err) => {
    if (err) {
      console.log('Error ocured while saving error')
      return
    }

    console.log(`Error saved, [${time} ${date}]`)
  })
}
