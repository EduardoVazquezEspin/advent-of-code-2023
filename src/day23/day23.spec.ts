import { dio, historyToString, stringToHistory } from './index.ts'

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
})

test.each`
case | history
${1} | ${[{x:1, y:3}, {x:3, y:5}, {x:-3, y:0}]}
${2} | ${[{x:1314, y:-3032}, {x:-8953, y:-240}, {x:-9418, y:3790}]}
${3} | ${[{x:0, y:0}, {x:0, y:0}]}
`('history to string to history $case', ({history}) => {
  expect(stringToHistory(historyToString(history))).toEqual(history)
})

test.each`
case | str
${1} | ${'1,3;3,5;-3,0'}
${2} | ${'1314,-3032;-8953,-240;-9418,3790'}
${3} | ${'0,0;0,0'}
`('string to history to string $case', ({str}) => {
  expect(historyToString(stringToHistory(str))).toEqual(str)
})

test('Part 1', () => {
  expect(dio.part1(dio.test.test1 as string[]).toString()).toBe(dio.test.res1)
})

test('Part 1b', () => {
  expect(dio.part1(dio.test.test1b as string[]).toString()).toBe(dio.test.res1b)
})

test('Part 2', () => {
  expect(dio.part2(dio.test.test2 as string[]).toString()).toBe(dio.test.res2)
})

test('Part 2b', () => {
  expect(dio.part2(dio.test.test2b as string[]).toString()).toBe(dio.test.res2b)
})

test('Part 2c', () => {
  expect(dio.part2(dio.test.test2c as string[]).toString()).toBe(dio.test.res2c)
})

test('Part 2d', () => {
  expect(dio.part2(dio.test.test2d as string[]).toString()).toBe(dio.test.res2d)
})