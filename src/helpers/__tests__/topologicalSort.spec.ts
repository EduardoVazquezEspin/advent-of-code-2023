import {topologicalSort} from '../topologicalSort.ts'

test.each`
case | set
${1} | ${[2, 3, 6, 12, 8, 4, 24, 10, 7]}
`('Topological Sort of Integers over Divisibility $case', ({set}: { set: number[] }) => {
  const sort = topologicalSort<number>(set, (num: number) => set.filter(it => Math.floor(num / it) === num / it))
  for (let i = 0; i < sort.length - 1; i++) {
    for (let j = i + 1; j < sort.length; j++) {
      expect(Math.floor(sort[i] / sort[j])).not.toBe(sort[i] / sort[j])
    }
  }
})
