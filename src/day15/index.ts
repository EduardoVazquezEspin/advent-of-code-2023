import {getDIO} from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day15'))

const calcHash = (str: string): number => {
  let total = 0
  for (let i = 0; i < str.length; i++) {
    total += str.charCodeAt(i)
    total *= 17
    total %= 256
  }
  return total
}

dio.part1 = input => {
  const sentences = input[0].split(',')
  return sentences.reduce((acc, curr) => acc + calcHash(curr), 0)
}

interface Lens {
  label: string
  'focal-length': number
}

type Box = Lens[]

type Boxes = Map<number, Box>

dio.part2 = input => {
  const boxes: Boxes = new Map()
  const sentences = input[0].split(',')
  sentences.forEach(sentence => {
    if (sentence.includes('=')) {
      const equalIndex = sentence.indexOf('=')
      const label = sentence.slice(0, equalIndex)
      const focalLength = parseInt(sentence.slice(equalIndex + 1))
      const boxNum = calcHash(label)
      let box = boxes.get(boxNum)
      if (box === undefined) {
        box = []
        boxes.set(boxNum, box)
      }
      const lensIndex: number = box.findIndex(it => it.label === label)
      if (lensIndex === -1) {
        box.push({label, 'focal-length': focalLength})
      } else {
        box[lensIndex]['focal-length'] = focalLength
      }
    } else {
      const label = sentence.slice(0, sentence.length - 1)
      const boxNum = calcHash(label)
      const box = boxes.get(boxNum)
      const lensIndex = box?.findIndex(it => it.label === label)
      if (box !== undefined && lensIndex !== -1) {
        boxes.set(boxNum, box.filter((_, index) => index !== lensIndex))
      }
    }
  })

  const iter = boxes.entries()
  let currBox: [number, Box] | undefined
  let total = 0
  while ((currBox = iter.next().value) !== undefined) {
    const boxNum = currBox[0]
    total += currBox[1].reduce((acc, curr, index) =>
      acc + (boxNum + 1) * (index + 1) * curr['focal-length']
    , 0)
  }
  return total
}

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
