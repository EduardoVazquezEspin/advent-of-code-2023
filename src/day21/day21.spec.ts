import {dio, getNewtonDiff} from './index.ts'

if (dio.test.test1 !== undefined) {
  test('Part 1', () => {
    dio.params.steps = 6
    expect(dio.part1(dio.test.test1 as string[]).toString()).toBe(dio.test.res1)
  })
}

test.each`
  steps | result
  ${6} | ${16}
  ${10} | ${50}
  ${50} | ${1594}
  ${100} | ${6536}
  ${500} | ${167004}
  ${1000} | ${668697}
  ${5000} | ${16733044}
  `('Part 2, steps: $steps', ({steps, result}) => {
  dio.params.steps = steps
  expect(dio.part2(dio.test.test2 as string[])).toBe(result)
})

test.each`
steps | result
${0} | ${1}
${1} | ${4}
${2} | ${9}
${3} | ${16}
${4} | ${25}
`('Simple example case for Part 2 $steps', ({steps, result}) => {
  dio.params.steps = steps
  const input = ['S']
  expect(dio.part2(input)).toBe(result)
})

test.each`
sequence | order
${[1, 2, 3, 4, 5, 6, 7]} | ${1}
${[1, 4, 9, 16, 25, 36, 49]} | ${2}
${[1, 8, 27, 64, 125, 216, 343]} | ${3}
`('getNewtonDiff will detect order $order', ({sequence, order}) => {
  const result = getNewtonDiff(sequence)
  expect(result.finished).toBe(true)
  expect(result.order).toBe(order)
  const result2 = getNewtonDiff(sequence, order)
  expect(result2.finished).toBe(true)
  expect(result2.order).toBe(order)
  const result3 = getNewtonDiff(sequence, order - 1)
  expect(result3.finished).toBe(false)
})
