import {dio} from './index.ts'

test('Part 1', () => {
  dio.params.ranges = {
    x: {min: 7, max: 27},
    y: {min: 7, max: 27}
  }
  expect(dio.part1(dio.test.test1 as string[]).toString()).toBe(dio.test.res1)
})
