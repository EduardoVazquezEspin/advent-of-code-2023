import { dio } from './index.ts'

if (dio.test.test1 !== undefined) {
  test('Part 1', () => {
    dio.params.starting = { position: { x: 0, y: 0 }, direction: 'E' }
    expect(dio.part1(dio.test.test1 as string[]).toString()).toBe(dio.test.res1)
  })
}

if (dio.test.test2 !== undefined) {
  test('Part 2', () => {
    expect(dio.part2(dio.test.test2 as string[]).toString()).toBe(dio.test.res2)
  })
}
