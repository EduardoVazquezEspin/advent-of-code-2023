import {getDIO, splitInput} from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day5'))

export interface Input {
  seeds: number[]
  maps: number[][][]
}

export interface Range {
  start: number
  end: number
}

const getInput = (input: string[]): Input => {
  const split: string[][] = splitInput(input, '')

  const seeds = split[0][0].split(' ').slice(1).map(it => parseInt(it))
  const maps: number[][][] = []
  for (let i = 1; i < split.length; i++) {
    maps.push(split[i].filter((_, index) => index > 0).map(it => it.split(' ').map(thing => parseInt(thing))))
  }
  return {seeds, maps}
}

const mapSeed = (seed: number, map: number[][]): number => {
  for (let i = 0; i < map.length; i++) {
    const entry = map[i]
    if (seed >= entry[1] && seed - entry[1] < entry[2]) {
      return seed + entry[0] - entry[1]
    }
  }
  return seed
}

const mapRangeEntry = (range: Range, entry: number[]): { pending: Range[], finished: Range[] } => {
  if (range.start >= entry[1] + entry[2] || range.end <= entry[1]) {
    return {
      pending: [range],
      finished: []
    }
  }
  const intersection: Range = {
    start: Math.max(range.start, entry[1]),
    end: Math.min(range.end, entry[1] + entry[2])
  }
  const pending: Range[] = []
  if (range.start < entry[1]) {
    pending.push({start: range.start, end: entry[1]})
  }
  if (range.end > entry[1] + entry[2]) {
    pending.push({start: entry[1] + entry[2], end: range.end})
  }
  return {
    finished: [
      {
        start: intersection.start - entry[1] + entry[0],
        end: intersection.end - entry[1] + entry[0]
      }
    ],
    pending
  }
}

const mapRanges = (ranges: Range[], map: number[][]): Range[] => {
  let pending: Range[] = ranges
  let finished: Range[] = []
  map.forEach(entry => {
    let newPending: Range[] = []
    pending.forEach(range => {
      const res = mapRangeEntry(range, entry)
      newPending = newPending.concat(res.pending)
      finished = finished.concat(res.finished)
    })
    pending = newPending
  })
  finished = finished.concat(pending)
  return finished
}

dio.part1 = input => {
  const {seeds, maps} = getInput(input)

  return Math.min(...seeds.map((seed: number): number => {
    maps.forEach(map => {
      seed = mapSeed(seed, map)
    })
    return seed
  })).toString()
}

dio.part2 = input => {
  const {seeds, maps} = getInput(input)

  let min: number | undefined

  for (let i = 0; i < seeds.length / 2; i++) {
    const start = seeds[2 * i]
    let ranges: Range[] = [{start, end: start + seeds[2 * i + 1]}]

    maps.forEach(map => {
      ranges = mapRanges(ranges, map)
    })

    const currentMin = Math.min(...ranges.map(it => it.start))
    if (min === undefined || currentMin < min) {
      min = currentMin
    }
  }

  return min?.toString() ?? ''
}

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
