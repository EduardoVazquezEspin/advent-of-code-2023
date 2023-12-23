import { type Polygonal, b64ToB10, getDIO, matchStringTemplate, calcPolygonalData } from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day18'))

type Direction = 'R' | 'L' | 'U' | 'D'

const directionToVector = (direction: Direction): [number, number] => {
  switch (direction) {
    case 'R':
      return [0, 1]
    case 'L':
      return [0, -1]
    case 'U':
      return [-1, 0]
    case 'D':
      return [1, 0]
  }
}

dio.part1 = input => {
  const polygonal: Polygonal = input.map(line => {
    const data = matchStringTemplate(line, /([R|L|U|D]) (\d+) \(#([a-z|0-9]+)\)/g)
    const direction: Direction = data[0] as Direction
    const steps: number = parseInt(data[1])
    const vectorStep = directionToVector(direction)

    return [steps * vectorStep[0], steps * vectorStep[1]]
  })

  const { biarea, perimeter } = calcPolygonalData(polygonal)

  const area = Math.abs(biarea) / 2
  const interior = area - perimeter / 2 + 1

  return perimeter + interior
}

dio.part2 = input => {
  const polygonal: Polygonal = input.map(line => {
    const data = matchStringTemplate(line, /([R|L|U|D]) (\d+) \(#([a-z|0-9]+)\)/g)
    const color = data[2]

    const steps: number = b64ToB10(color.slice(0, 5))
    const directionCode: string = color.slice(5)
    let direction: Direction
    switch (directionCode) {
      case '0':
        direction = 'R'
        break
      case '1':
        direction = 'D'
        break
      case '2':
        direction = 'L'
        break
      case '3':
        direction = 'U'
        break
      default: throw new Error('Invalid Direction Code')
    }
    const vectorStep = directionToVector(direction)

    return [steps * vectorStep[0], steps * vectorStep[1]]
  })

  const { biarea, perimeter } = calcPolygonalData(polygonal)

  const area = Math.abs(biarea) / 2
  const interior = area - perimeter / 2 + 1

  return perimeter + interior
}

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
