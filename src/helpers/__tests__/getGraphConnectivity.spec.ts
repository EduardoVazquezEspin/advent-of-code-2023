import {getGraphConnectivity} from '../getGraphConnectivity';
import {groupAndCount} from '../groupAndCount';

interface TestProps{
    connectivity: number
    groupCount: number[]
    graph: number[]
    goesTo: Record<number, number[]>
}

test.each`
case | connectivity | groupCount  | graph | goesTo 
${1} | ${1} | ${[5]} | ${[1, 2, 3, 4, 5]} | ${{1: [2], 2: [3], 3: [4], 4: [5], 5: [1]}}
${2} | ${2} | ${[3, 2]} | ${[1, 2, 3, 4, 5]} | ${{1: [2, 3], 2: [1, 3], 3: [1, 2], 4: [5], 5: [4]}}
${3} | ${2} | ${[3, 2]} | ${[1, 2, 3, 4, 5]} | ${{1: [2], 2: [], 3: [1], 4: [5], 5: [4]}}
`('getGraphConnectivity $case', ({connectivity, groupCount, graph, goesTo}: TestProps) => {
  const [connexionNumber, connexionMap] = getGraphConnectivity(graph, (it) => goesTo[it])
  const values = []
  for(const value of connexionMap.values()){
    values.push(value)
  }
  const count = groupAndCount(values)

  expect(connexionNumber).toBe(connectivity)
  expect(count.map(it => it.count)).toEqual(groupCount)
})