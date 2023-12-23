import { matchStringTemplate } from '../matchStringTemplate.ts'

describe('matchStringTemplate tests', () => {
  test('List of numbers', () => {
    const str = 'Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53'
    const template = /Card\s+(\d+):\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+\|\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/g
    const numbers = matchStringTemplate(str, template)

    expect(numbers).toEqual(['1', '41', '48', '83', '86', '17', '83', '86', '6', '31', '17', '9', '48', '53'])
  })
})
