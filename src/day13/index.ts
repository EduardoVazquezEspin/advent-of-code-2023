import {getDIO, splitInput} from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day13'))

interface Reflection {
  type: 'vertical' | 'horizontal'
  index: number
}

const isPartialSumEven = (get: (input: number) => boolean, size: number): boolean[] => {
  let start = 0
  let end = 0
  let sum = false
  const result = []
  for (let i = 1; i < size; i++) {
    if (end < size) {
      sum = sum !== get(end)
      end++
    } else {
      sum = sum !== get(start)
      start++
    }
    if (end < size) {
      sum = sum !== get(end)
      end++
    } else {
      sum = sum !== get(start)
      start++
    }
    result.push(!sum)
  }
  return result
}

const isReflection = (input: string[], reflection: Reflection): boolean => {
  const height = input.length
  const width = input[0].length

  if (reflection.type === 'vertical') {
    const size = Math.min(reflection.index, width - reflection.index)
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < size; i++) {
        if (input[j][reflection.index + i] !== input[j][reflection.index - 1 - i]) {
          return false
        }
      }
    }
  } else {
    const size = Math.min(reflection.index, height - reflection.index)
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < size; j++) {
        if (input[reflection.index + j][i] !== input[reflection.index - 1 - j][i]) {
          return false
        }
      }
    }
  }
  return true
}

const isOneReflection = (input: string[], reflection: Reflection): boolean => {
  const height = input.length
  const width = input[0].length
  let hasErrors = false

  if (reflection.type === 'vertical') {
    const size = Math.min(reflection.index, width - reflection.index)
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < size; i++) {
        if (input[j][reflection.index + i] !== input[j][reflection.index - 1 - i]) {
          if (!hasErrors) {
            hasErrors = true
          } else {
            return false
          }
        }
      }
    }
  } else {
    const size = Math.min(reflection.index, height - reflection.index)
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < size; j++) {
        if (input[reflection.index + j][i] !== input[reflection.index - 1 - j][i]) {
          if (!hasErrors) {
            hasErrors = true
          } else {
            return false
          }
        }
      }
    }
  }

  return hasErrors
}

const findReflections = (input: string[]): Reflection[] => {
  const height = input.length
  const width = input[0].length

  const verticalPartialSums = []
  for (let j = 0; j < height; j++) {
    verticalPartialSums.push(isPartialSumEven(it => input[j][it] === '#', width))
  }
  const horizontalPartialSums = []
  for (let i = 0; i < width; i++) {
    horizontalPartialSums.push(isPartialSumEven(it => input[it][i] === '#', height))
  }

  let verticalSolutions = []
  for (let i = 0; i < width - 1; i++) {
    let isSolution = true
    for (let j = 0; isSolution && j < height; j++) {
      isSolution = verticalPartialSums[j][i]
    }
    if (isSolution) {
      verticalSolutions.push(i + 1)
    }
  }
  verticalSolutions = verticalSolutions.filter(it => isReflection(input, {type: 'vertical', index: it}))

  let horizontalSolutions = []
  for (let j = 0; j < height - 1; j++) {
    let isSolution = true
    for (let i = 0; isSolution && i < width; i++) {
      isSolution = horizontalPartialSums[i][j]
    }
    if (isSolution) {
      horizontalSolutions.push(j + 1)
    }
  }
  horizontalSolutions = horizontalSolutions.filter(it => isReflection(input, {type: 'horizontal', index: it}))

  return [
    ...verticalSolutions.map((it: number): Reflection => ({type: 'vertical', index: it})),
    ...horizontalSolutions.map((it: number): Reflection => ({type: 'horizontal', index: it}))
  ]
}

const findOneReflections = (input: string[]): Reflection[] => {
  const height = input.length
  const width = input[0].length

  const verticalPartialSums = []
  for (let j = 0; j < height; j++) {
    verticalPartialSums.push(isPartialSumEven(it => input[j][it] === '#', width))
  }
  const horizontalPartialSums = []
  for (let i = 0; i < width; i++) {
    horizontalPartialSums.push(isPartialSumEven(it => input[it][i] === '#', height))
  }

  let verticalSolutions = []
  for (let i = 0; i < width - 1; i++) {
    let isSolution = true
    let hasErrors = false
    for (let j = 0; isSolution && j < height; j++) {
      if (!verticalPartialSums[j][i]) {
        if (!hasErrors) {
          hasErrors = true
        } else {
          isSolution = false
        }
      }
    }
    if (isSolution && hasErrors) {
      verticalSolutions.push(i + 1)
    }
  }
  verticalSolutions = verticalSolutions.filter(it => isOneReflection(input, {type: 'vertical', index: it}))

  let horizontalSolutions = []
  for (let j = 0; j < height - 1; j++) {
    let isSolution = true
    let hasErrors = false
    for (let i = 0; isSolution && i < width; i++) {
      if (!horizontalPartialSums[i][j]) {
        if (!hasErrors) {
          hasErrors = true
        } else {
          isSolution = false
        }
      }
    }
    if (isSolution && hasErrors) {
      horizontalSolutions.push(j + 1)
    }
  }
  horizontalSolutions = horizontalSolutions.filter(it => isOneReflection(input, {type: 'horizontal', index: it}))

  return [
    ...verticalSolutions.map((it: number): Reflection => ({type: 'vertical', index: it})),
    ...horizontalSolutions.map((it: number): Reflection => ({type: 'horizontal', index: it}))
  ]
}

dio.part1 = (input) => {
  const split = splitInput(input, '')
  const reflections = split.map(it => findReflections(it)[0])
  return reflections.reduce((acc, curr) => curr.type === 'vertical' ? acc + curr.index : acc + 100 * curr.index, 0)
}

dio.part2 = (input) => {
  const split = splitInput(input, '')
  const reflections = split.map(it => findOneReflections(it)[0])
  return reflections.reduce((acc, curr) => curr.type === 'vertical' ? acc + curr.index : acc + 100 * curr.index, 0)
}

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
