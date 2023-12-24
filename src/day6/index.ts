import {getAllMatches, getDIO} from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day6'), 'test-impossible')

interface Race {
  time: number
  distance: number
}

type Input = Race[]

const getInput1 = (input: string[]): Input => {
  const times = getAllMatches(input[0], /\d+/g, 0)
  const distances = getAllMatches(input[1], /\d+/g, 0)
  const races: Race[] = []
  for (let i = 0; i < times.length; i++) {
    races.push({time: parseInt(times[i]), distance: parseInt(distances[i])})
  }
  return races
}

const getInput2 = (input: string[]): Race => {
  const time = getAllMatches(input[0], /\d+/g, 0).reduce((acc, curr) => acc + curr, '')
  const distance = getAllMatches(input[1], /\d+/g, 0).reduce((acc, curr) => acc + curr, '')
  return {time: parseInt(time), distance: parseInt(distance)}
}

dio.part1 = input => {
  const races = getInput1(input)
  const solutions = races.map(race => {
    const lower = Math.floor((race.time - Math.sqrt(race.time * race.time - 4 * race.distance)) / 2) + 1
    const higher = race.time - lower
    return higher >= lower ? higher - lower + 1 : 0
  })
  return solutions.reduce((acc, curr) => acc * curr, 1).toString()
}

dio.part2 = input => {
  const race = getInput2(input)
  const lower = Math.floor((race.time - Math.sqrt(race.time * race.time - 4 * race.distance)) / 2) + 1
  const higher = race.time - lower
  const total = higher >= lower ? higher - lower + 1 : 0
  return total.toString()
}

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
