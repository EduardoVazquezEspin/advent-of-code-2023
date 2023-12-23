import { PriorityQueue, type IComparable } from '../PriorityQueue.ts'

class ComparableNumber implements IComparable {
  public number: number

  constructor (number: number) {
    this.number = number
  }

  compareTo (other: IComparable): number {
    if (!(other instanceof ComparableNumber)) {
      return 1
    }
    return this.number - other.number
  }
}

test.each`
case | array | top 
${1} | ${[1, 2, 3]} | ${3}
${2} | ${[1, 3, 2]} | ${3}
${3} | ${[2, 1, 3]} | ${3}
${4} | ${[2, 3, 1]} | ${3}
${5} | ${[3, 2, 1]} | ${3}
${6} | ${[3, 1, 2]} | ${3}
${7} | ${[19, 57, 12, 56, 11, 20, 70, 21, 50, 84, 67, 97, 82, 69, 41, 53, 37, 58, 59, 90]} | ${97}
`('When adding elements and dequeueing one we obtain the max $case', ({ array, top }) => {
  const pq = new PriorityQueue<ComparableNumber>()
  array.forEach((it: number) => {
    pq.enqueue(new ComparableNumber(it))
  })
  expect(pq.dequeue()?.number).toBe(top)
})

test('Heap sort works', () => {
  const sequence = [19, 57, 12, 56, 11, 20, 70, 21, 50, 84, 67, 97, 82, 69, 41, 53, 37, 58, 59, 90]
  const pq = new PriorityQueue<ComparableNumber>()
  sequence.forEach((it: number) => {
    pq.enqueue(new ComparableNumber(it))
  })
  const result = []
  while (pq.size() !== 0) {
    result.push(pq.dequeue())
  }
  expect(result.map(it => it?.number)).toEqual([97, 90, 84, 82, 70, 69, 67, 59, 58, 57, 56, 53, 50, 41, 37, 21, 20, 19, 12, 11])
})
