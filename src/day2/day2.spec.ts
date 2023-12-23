import { dio } from './index.ts'

if (dio.test.test1 !== undefined) {
  test('Part 1', () => {
    expect(dio.part1(dio.test.test1 as string[])).toBe(dio.test.res1)
  })
}

if (dio.test.test2 !== undefined) {
  test('Part 2', () => {
    expect(dio.part2(dio.test.test2 as string[])).toBe(dio.test.res2)
  })
}
