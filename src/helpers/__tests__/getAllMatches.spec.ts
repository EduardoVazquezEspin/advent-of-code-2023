import {getAllMatches} from '../getAllMatches.ts'

describe('getAllMatches tests', () => {
  test('1 match', () => {
    const str = 'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green'
    const regexp = /Game (\d+):/g
    const matches = getAllMatches(str, regexp)

    expect(matches).toEqual(['1'])
  })

  test('Multiple matches', () => {
    const str = 'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green'
    const regexp = /(\d+) red/g
    const matches = getAllMatches(str, regexp)

    expect(matches).toEqual(['4', '1'])
  })
})
