import {splitInput} from '../splitInput.ts'

describe('splitInput tests', () => {
  test('for multiple matches', () => {
    const input = [
      'Hello',
      'And',
      'How are you',
      '',
      'Goodbye',
      'See you',
      '',
      'PS',
      ''
    ]

    const result = splitInput(input, '')
    expect(result).toEqual([
      ['Hello',
        'And',
        'How are you'],
      ['Goodbye',
        'See you'],
      ['PS'],
      []
    ])
  })
})
