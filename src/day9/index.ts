import {getDIO} from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day9'))

type History = number[]

type NewtonDiff = History[]

export const getInput = (input: string[]): History[] => {
  return input.map(it => it.split(' ').map(num => parseInt(num)))
}

const getNewtonDiff = (history: History): NewtonDiff => {
  const result: NewtonDiff = [history]
  let curr = history
  while (curr.some(it => it !== 0)) {
    const newDiff = []
    for (let i = 0; i < curr.length - 1; i++) {
      newDiff.push(curr[i + 1] - curr[i])
    }
    curr = newDiff
    result.push(newDiff)
  }
  return result
}

const extrapolate = (newtonDiff: NewtonDiff): void => {
  for (let j = newtonDiff.length - 1; j >= 0; j--) {
    const len = newtonDiff[j].length
    newtonDiff[j].push(newtonDiff[j][len - 1] + (j === newtonDiff.length - 1 ? 0 : newtonDiff[j + 1][len - 1]))
  }
}

const extrapolateBack = (newtonDiff: NewtonDiff): void => {
  for (let j = newtonDiff.length - 1; j >= 0; j--) {
    newtonDiff[j][-1] = newtonDiff[j][0] - (j === newtonDiff.length - 1 ? 0 : newtonDiff[j + 1][-1])
  }
}

dio.part1 = input => {
  const histories = getInput(input)
  const newtonDiffs: NewtonDiff[] = histories.map(history => getNewtonDiff(history))
  newtonDiffs.forEach(it => { extrapolate(it) })
  return newtonDiffs.reduce((acc, curr) => acc + curr[0][curr[0].length - 1], 0)
}

dio.part2 = input => {
  const histories = getInput(input)
  const newtonDiffs: NewtonDiff[] = histories.map(history => getNewtonDiff(history))
  newtonDiffs.forEach(it => { extrapolateBack(it) })
  return newtonDiffs.reduce((acc, curr) => acc + curr[0][-1], 0)
}

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
