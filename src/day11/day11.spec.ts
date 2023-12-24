import {dio} from './index.ts'

if (dio.test.test1 !== undefined) {
  test('Part 1', () => {
    dio.params.expansion = 2
    expect(dio.part1(dio.test.test1 as string[]).toString()).toBe(dio.test.res1)
  })
}

if (dio.test.test2 !== undefined) {
  test('Part 2', () => {
    dio.params.expansion = 100
    expect(dio.part2(dio.test.test2 as string[]).toString()).toBe(dio.test.res2)
  })
}

if (dio.test.test2 !== undefined) {
  test('Part 2 b', () => {
    dio.params.expansion = 10
    expect(dio.part2(dio.test.test2 as string[]).toString()).toBe('1030')
  })
}
