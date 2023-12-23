import { getDIO, setCharAt, reduceToInterval } from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day14'))

const calculateLoad = (input: string[]): number => input.reduce((acc, curr, index) =>
  acc + (input.length - index) * curr.split('').reduce((acc, curr) =>
    acc + (curr === 'O' ? 1 : 0),
  0),
0)

const tiltUp = (input: string[]): string[] => {
  const height = input.length
  const width = input[0].length
  for (let i = 0; i < width; i++) {
    let pivot = 0
    for (let j = 0; j < height; j++) {
      if (input[j][i] === '#') {
        pivot = j + 1
      } else if (input[j][i] === 'O') {
        input[j] = setCharAt(input[j], i, '.')
        input[pivot] = setCharAt(input[pivot], i, 'O')
        pivot++
      }
    }
  }
  return input
}

const tiltDown = (input: string[]): string[] => {
  const height = input.length
  const width = input[0].length
  for (let i = 0; i < width; i++) {
    let pivot = height - 1
    for (let j = height - 1; j >= 0; j--) {
      if (input[j][i] === '#') {
        pivot = j - 1
      } else if (input[j][i] === 'O') {
        input[j] = setCharAt(input[j], i, '.')
        input[pivot] = setCharAt(input[pivot], i, 'O')
        pivot--
      }
    }
  }
  return input
}

const tiltLeft = (input: string[]): string[] => {
  const height = input.length
  const width = input[0].length
  for (let j = 0; j < height; j++) {
    let pivot = 0
    for (let i = 0; i < width; i++) {
      if (input[j][i] === '#') {
        pivot = i + 1
      } else if (input[j][i] === 'O') {
        input[j] = setCharAt(input[j], i, '.')
        input[j] = setCharAt(input[j], pivot, 'O')
        pivot++
      }
    }
  }
  return input
}

const tiltRight = (input: string[]): string[] => {
  const height = input.length
  const width = input[0].length
  for (let j = 0; j < height; j++) {
    let pivot = width - 1
    for (let i = width - 1; i >= 0; i--) {
      if (input[j][i] === '#') {
        pivot = i - 1
      } else if (input[j][i] === 'O') {
        input[j] = setCharAt(input[j], i, '.')
        input[j] = setCharAt(input[j], pivot, 'O')
        pivot--
      }
    }
  }
  return input
}

const cycle = (input: string[]): string[] => {
  const copy = [...input]
  tiltUp(copy)
  tiltLeft(copy)
  tiltDown(copy)
  tiltRight(copy)
  return copy
}

const areEqual = (input1: string[], input2: string[]): boolean => {
  if (input1.length !== input2.length) {
    return false
  }
  for (let i = 0; i < input1.length; i++) {
    if (input1[i] !== input2[i]) {
      return false
    }
  }
  return true
}

dio.part1 = (input) => {
  const tilted = tiltUp(input)
  return calculateLoad(tilted)
}

dio.part2 = (input) => {
  const history = []
  let current = input
  do {
    history.push(current)
    current = cycle(current)
  } while (!history.some(it => areEqual(it, current)))
  const index = history.findIndex(it => areEqual(it, current))
  const length = history.length
  const state = history[reduceToInterval(index, length, 1000000000)]
  return calculateLoad(state)
}

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
