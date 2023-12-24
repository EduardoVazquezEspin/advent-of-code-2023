import {getDIO, matchStringTemplate} from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day24'))

interface Position2D{
  x: number
  y: number
}

interface Position extends Position2D{
  z: number
}

type Velocity = Position

type Hailstone = [Position, Velocity]

const readInput = (input: string[]): Array<Hailstone> =>
  input.map(line => {
    const matching: string[] = matchStringTemplate(line, /^(-?\d+),\s+(-?\d+),\s+(-?\d+)\s+@\s+(-?\d+),\s+(-?\d+),\s+(-?\d+)$/g)
    const numbers: number[] = matching.map(it => parseInt(it))
    const position: Position = {
      x: numbers[0],
      y: numbers[1],
      z: numbers[2]
    }
    const velocity: Velocity = {
      x: numbers[3],
      y: numbers[4],
      z: numbers[5]
    }
    return [position, velocity]
  })

interface Intersection2DParallel{
  parallel: true
}

interface Intersection2DIntersect{
  parallel: false
  position: Position2D
  time1: number
  time2: number
}

type Intersection2D = Intersection2DParallel | Intersection2DIntersect

const getIntersection2D = (stone1: Hailstone, stone2: Hailstone): Intersection2D => {
  const [point1, vector1] = stone1
  const [point2, vector2] = stone2
  const det = vector1.y * vector2.x - vector1.x * vector2.y
  if (det === 0) {
    return {parallel: true}
  }

  const diff = [point2.x - point1.x, point2.y - point1.y]
  const time1 = (vector2.x * diff[1] - vector2.y * diff[0]) / det
  const time2 = (vector1.x * diff[1] - vector1.y * diff[0]) / det
  const position: Position2D = {x: point1.x + vector1.x * time1, y: point1.y + vector1.y * time1}

  return {
    parallel: false,
    position,
    time1,
    time2
  }
}

dio.part1 = input => {
  const hailstones: Hailstone[] = readInput(input)
  let total: number = 0
  for(let i = 0; i < hailstones.length - 1; i++){
    for(let j = i + 1; j < hailstones.length; j++){
      const intersection = getIntersection2D(hailstones[i], hailstones[j])
      if(
        !intersection.parallel &&
        intersection.time1 >= 0 &&
        intersection.time2 >= 0 &&
        intersection.position.x >= dio.params.ranges.x.min &&
        intersection.position.x <= dio.params.ranges.x.max &&
        intersection.position.y >= dio.params.ranges.y.min &&
        intersection.position.y <= dio.params.ranges.y.max
      ){
        total++
      }
    }
  }
  return total
}

const printEquations = (stone: Hailstone, index: number): void => {
  const [position, velocity] = stone
  console.log(`  F(${index}) = (${position.x}-x(1))*(${velocity.y}-x(5))-(${position.y}-x(2))*(${velocity.x}-x(4));`)
  console.log(`  F(${index + 1}) = (${position.x}-x(1))*(${velocity.z}-x(6))-(${position.z}-x(3))*(${velocity.x}-x(4));`)
}

if(process.env.TESTING !== 'TRUE'){
  dio.params.ranges = {
    x: {min: 200000000000000, max: 400000000000000},
    y: {min: 200000000000000, max: 400000000000000}
  }
  console.log('Part 1:', dio.part1(dio.input))

  {
    // const hailstones = readInput(dio.test.test1 as string[])
    const hailstones = readInput(dio.input)
    console.log('Part 2:')
    console.log('*********************************************************')
    console.log('******** Throw this in https://octave-online.net ********')
    console.log('*********************************************************')
    console.log('******** If it doesn\'t work, try changing x0 or  ********')
    console.log('********       the index of the hailstones       ********')
    console.log('*********************************************************')
    console.log('output_precision(15);')
    console.log('function F = equation (x)')
    printEquations(hailstones[3], 1)
    printEquations(hailstones[4], 3)
    printEquations(hailstones[5], 5)
    console.log('endfunction')
    const midPoint : Hailstone = [
      {
        x: Math.round((hailstones[0][0].x + hailstones[1][0].x + hailstones[2][0].x) / 3),
        y: Math.round((hailstones[0][0].y + hailstones[1][0].y + hailstones[2][0].y) / 3),
        z: Math.round((hailstones[0][0].z + hailstones[1][0].z + hailstones[2][0].z) / 3)
      },
      {
        x: Math.round((hailstones[0][1].x + hailstones[1][1].x + hailstones[2][1].x) / 3),
        y: Math.round((hailstones[0][1].y + hailstones[1][1].y + hailstones[2][1].y) / 3),
        z: Math.round((hailstones[0][1].z + hailstones[1][1].z + hailstones[2][1].z) / 3)
      },
    ]
    console.log(`x0 = [${midPoint[0].x + midPoint[1].x};${midPoint[0].y + midPoint[1].y};${midPoint[0].z + midPoint[1].z};0;0;0];`)
    console.log('options = optimset ("fsolve");')
    console.log('options.TolFun = 1e-20;')
    console.log('options.TolX = 1e-20;')
    console.log('x = fsolve("equation",x0,options)')
    console.log('*********************************************************')
  }
}
