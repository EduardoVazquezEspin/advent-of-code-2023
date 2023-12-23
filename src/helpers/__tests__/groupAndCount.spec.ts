import { groupAndCount } from '../groupAndCount.ts'

test('groupAndCount functioning', () => {
  const input = ['A', 'B', 'A', 'A', 'X', 'X']
  const result = groupAndCount(input)
  expect(result).toEqual([
    { value: 'A', count: 3 },
    { value: 'X', count: 2 },
    { value: 'B', count: 1 }
  ])
})
