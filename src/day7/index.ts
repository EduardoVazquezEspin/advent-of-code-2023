import {getDIO, groupAndCount} from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day7'), 'test1b', 'test2b')

type Card = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2'

const cardsOrder: Card[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']

const cardsOrder2: Card[] = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']

type Comparison = 1 | 0 | -1

type HandType = '5oak' | '4oak' | 'fh' | '3oak' | '2p' | '1p' | 'hc'

const handTypesOrder: HandType[] = ['5oak', '4oak', 'fh', '3oak', '2p', '1p', 'hc']

class Hand {
  public type: HandType
  public cards: Card[]

  constructor (cards: string[]) {
    if (cards.length !== 5) {
      throw new Error('Invalid number of Cards')
    }
    if (cards.some(it => !cardsOrder.includes(it as Card))) {
      throw new Error('Invalid Hand Character')
    }
    this.cards = cards as Card[]

    const group = groupAndCount(cards)
    if (group.length === 1) {
      this.type = '5oak'
      return
    }
    if (group.length === 2) {
      if (group[0].count === 4) {
        this.type = '4oak'
        return
      }
      this.type = 'fh'
      return
    }
    if (group.length === 3) {
      if (group[0].count === 3) {
        this.type = '3oak'
        return
      }
      this.type = '2p'
      return
    }
    if (group.length === 4) {
      this.type = '1p'
      return
    }
    this.type = 'hc'
  }
}

class Hand2 {
  public type: HandType
  public cards: Card[]

  constructor (cards: string[]) {
    if (cards.length !== 5) {
      throw new Error('Invalid number of Cards')
    }
    if (cards.some(it => !cardsOrder.includes(it as Card))) {
      throw new Error('Invalid Hand Character')
    }
    this.cards = cards as Card[]

    let group = groupAndCount(cards)
    const jokersIndex = group.findIndex(it => it.value === 'J')
    if (jokersIndex !== -1 && group.length > 1) {
      group[jokersIndex === 0 ? 1 : 0].count += group[jokersIndex].count
      group = group.filter(it => it.value !== 'J')
    }
    if (group.length === 1) {
      this.type = '5oak'
      return
    }
    if (group.length === 2) {
      if (group[0].count === 4) {
        this.type = '4oak'
        return
      }
      this.type = 'fh'
      return
    }
    if (group.length === 3) {
      if (group[0].count === 3) {
        this.type = '3oak'
        return
      }
      this.type = '2p'
      return
    }
    if (group.length === 4) {
      this.type = '1p'
      return
    }
    this.type = 'hc'
  }
}

const compare = <T>(input1: T, input2: T, order: T[], onErrorMessage: string): Comparison => {
  for (let i = 0; i < order.length; i++) {
    if (input1 === order[i] && input2 === order[i]) {
      return 0
    }
    if (input1 === order[i]) {
      return 1
    }
    if (input2 === order[i]) {
      return -1
    }
  }

  throw new Error(onErrorMessage)
}

const compareCards = (card1: Card, card2: Card, order: Card[]): Comparison => compare<Card>(card1, card2, order, 'Invalid Cards Received')

const compareHands = (hand1: Hand, hand2: Hand, cardsOrder: Card[]): Comparison => {
  const typeComparison = compare(hand1.type, hand2.type, handTypesOrder, 'Invalid Hands Received')
  if (typeComparison !== 0) {
    return typeComparison
  }
  for (let i = 0; i < 5; i++) {
    const cardComparison = compareCards(hand1.cards[i], hand2.cards[i], cardsOrder)
    if (cardComparison !== 0) {
      return cardComparison
    }
  }

  return 0
}

dio.part1 = input => {
  const values = input.map(it => it.split(' '))
  values.sort((a, b) => compareHands(new Hand(a[0].split('')), new Hand(b[0].split('')), cardsOrder))
  let total = 0
  for (let i = 0; i < values.length; i++) {
    total += parseInt(values[i][1]) * (i + 1)
  }
  return total.toString()
}

dio.part2 = input => {
  const values = input.map(it => it.split(' '))
  values.sort((a, b) => compareHands(new Hand2(a[0].split('')), new Hand2(b[0].split('')), cardsOrder2))
  let total = 0
  for (let i = 0; i < values.length; i++) {
    total += parseInt(values[i][1]) * (i + 1)
  }
  return total.toString()
}

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
