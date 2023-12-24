import {getDIO} from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day3'))

const isNumber = (char: string): boolean => /\d{1}/.test(char)
const isSymbol = (char: string): boolean => /[^\d|^.]{1}/.test(char)
const isGear = (char: string): boolean => /\*{1}/.test(char)
const getInt = (word: WordCordinates, input: string[]): number => parseInt(input[word.line].slice(word.start, word.end))

dio.part1 = input => {
  const width = input[0].length
  const height = input.length
  let total: number = 0
  for (let j = 0; j < height; j += 1) {
    for (let i = 0; i < width; i += 1) {
      const start = i
      while (i < width && isNumber(input[j][i])) {
        i += 1
      }
      const end = i
      if (start < end) {
        let hasSymbol: boolean = false
        for (let x = Math.max(0, start - 1); !hasSymbol && x < Math.min(width, end + 1); x += 1) {
          for (let y = Math.max(0, j - 1); !hasSymbol && y < Math.min(height, j + 2); y += 1) {
            hasSymbol = isSymbol(input[y][x])
          }
        }
        if (hasSymbol) {
          total += parseInt(input[j].slice(start, end))
        }
      }
    }
  }
  return total.toString()
}

interface WordCordinates {
  line: number
  start: number
  end: number
}

dio.part2 = input => {
  const width = input[0].length
  const height = input.length
  let total: number = 0
  const numbers: WordCordinates[] = []
  for (let j = 0; j < height; j += 1) {
    for (let i = 0; i < width; i += 1) {
      const start = i
      while (i < width && isNumber(input[j][i])) {
        i += 1
      }
      const end = i
      if (start < end) {
        numbers.push({line: j, start, end})
      }
    }
  }
  for (let j = 0; j < height; j += 1) {
    for (let i = 0; i < width; i += 1) {
      if (isGear(input[j][i])) {
        const matches = numbers.filter(it =>
          it.end >= i && it.start - 1 <= i && Math.abs(j - it.line) <= 1
        )
        if (matches.length === 2) {
          total += getInt(matches[0], input) * getInt(matches[1], input)
        }
      }
    }
  }
  return total.toString()
}

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
