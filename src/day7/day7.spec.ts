import { dio } from './index.ts'

if (dio.test.test1 !== undefined) {
  test('Part 1', () => {
    expect(dio.part1(dio.test.test1 as string[])).toBe(dio.test.res1)
  })
}

if (dio.test.test1b !== undefined) {
  test('Part 1b', () => {
    expect(dio.part1(dio.test.test1b as string[])).toBe(dio.test.res1b)
  })
}

if (dio.test.test2 !== undefined) {
  test('Part 2', () => {
    expect(dio.part2(dio.test.test2 as string[])).toBe(dio.test.res2)
  })
}

if (dio.test.test2b !== undefined) {
  test('Part 2b', () => {
    expect(dio.part2(dio.test.test2b as string[])).toBe(dio.test.res2b)
  })
}
