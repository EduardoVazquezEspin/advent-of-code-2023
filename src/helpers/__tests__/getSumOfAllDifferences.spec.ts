import {getSumOfAllDifferences} from '../getSumOfAllDifferences.ts'

test.each`
    array | result
    ${[3, 1, 2]} | ${4}
    ${[1, 2, 3, 4, 5, 6]} | ${35}
    ${[4, 2, 3, 1, 6, 5]} | ${35}
`('sum of all differences of $array is $result', ({array, result}) => {
  expect(getSumOfAllDifferences(array)).toBe(result)
})
