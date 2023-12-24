import {getDIO, getSumOfAllDifferences} from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day11'))

const expandCoordinates = (coord: number[], expansion: number): number[] => {
  const copy = coord
  let acc = 0
  let prev = 0
  for (let i = 0; i < copy.length; i++) {
    acc += Math.max(copy[i] - prev - 1, 0) * (expansion - 1)
    prev = copy[i]
    copy[i] += acc
  }
  return copy
}

dio.part1 = input => {
  const coordinates = input.flatMap((row, x) => row.split('').reduce((acc: number[][], curr: string, y: number) => {
    if (curr === '#') {
      return [
        ...acc,
        [x, y]
      ]
    }
    return acc
  }, []))
  let exes = coordinates.map(it => it[0]).sort((a, b) => a - b)
  let eyes = coordinates.map(it => it[1]).sort((a, b) => a - b)
  exes = expandCoordinates(exes, dio.params.expansion)
  eyes = expandCoordinates(eyes, dio.params.expansion)
  return getSumOfAllDifferences(exes) + getSumOfAllDifferences(eyes)
}

dio.part2 = dio.part1

if(process.env.TESTING !== 'TRUE'){
  dio.params.expansion = 2
  console.log('Part 1:', dio.part1(dio.input))

  dio.params.expansion = 1000000
  console.log('Part 2:', dio.part2(dio.input))
}

