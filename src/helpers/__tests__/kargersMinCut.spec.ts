import {Edge, kargersMinCut} from '../kargersMinCut'

test('kargers min cut', () => {
  const edges: Edge<number>[] = []
  for(let i = 1; i < 100; i++){
    for(let j = i + 1; j <= 100; j++){
      edges.push({connects: [i, j]})
      edges.push({connects: [-j, -i]})
    }
  }

  const connector: Edge<number> = {connects: [-1, 1]}
  edges.push(connector)

  expect(kargersMinCut(edges)).toEqual([connector])
})