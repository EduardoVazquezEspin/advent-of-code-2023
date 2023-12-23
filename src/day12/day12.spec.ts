import { dio } from './index.ts'
import { inputToString, solveAsync, solveLeft, solveRight, stringToInput } from './solvers'

if (dio.test.test1 !== undefined) {
  test('Part 1', () => {
    expect(dio.part1(dio.test.test1 as string[]).toString()).toBe(dio.test.res1)
  })
}

if (dio.test.test2 !== undefined) {
  test('Part 2', () => {
    expect(dio.part2(dio.test.test2 as string[]).toString()).toBe(dio.test.res2)
  })
}

test.each(dio.input)('string to input to string %s', (input) => {
  expect(inputToString(stringToInput(input))).toBe(input)
})

test.each`
input | result
${'???.### 1,1,3'} | ${1}
${'.??..??...?##. 1,1,3'} | ${4}
${'?#?#?#?#?#?#?#? 1,3,1,6'} | ${1}
${'????.#...#... 4,1,1'} | ${1}
${'????.######..#####. 1,6,5'} | ${4}
${'?###???????? 3,2,1'} | ${10}
`('solveLeft $input -> $result', ({ input, result }) => {
  const cache = {}
  expect(solveLeft(input, cache)).toBe(result)
})

test.each`
input | result
${'???.### 1,1,3'} | ${1}
${'.??..??...?##. 1,1,3'} | ${4}
${'?#?#?#?#?#?#?#? 1,3,1,6'} | ${1}
${'????.#...#... 4,1,1'} | ${1}
${'????.######..#####. 1,6,5'} | ${4}
${'?###???????? 3,2,1'} | ${10}
`('solveRight $input -> $result', ({ input, result }) => {
  const cache = {}
  expect(solveRight(input, cache)).toBe(result)
})

test.each`
input | result
${'???.### 1,1,3'} | ${1}
${'.??..??...?##. 1,1,3'} | ${4}
${'?#?#?#?#?#?#?#? 1,3,1,6'} | ${1}
${'????.#...#... 4,1,1'} | ${1}
${'????.######..#####. 1,6,5'} | ${4}
${'?###???????? 3,2,1'} | ${10}
`('solveAsync $input -> $result', async ({ input, result }) => {
  const cache = {}
  expect(await solveAsync(input, cache)).toBe(result)
})
