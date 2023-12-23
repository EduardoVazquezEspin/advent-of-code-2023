import { getDIO } from '../helpers/index.ts'

import path from 'path'

export const dio = getDIO(path.resolve('./src/day24'))

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
