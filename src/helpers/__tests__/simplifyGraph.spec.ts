import {simplifyGraph} from '../simplifyGraph'

test('simplifyGraph does nothing with no nodes of adjacency 2', () => {
    type Value = 'A' | 'B' | 'C' | 'D'

    const nodes: Value[] = ['A', 'B', 'C', 'D']
    const goesTo = (node: Value): Value[] =>{
      switch(node){
        case 'A':
          return ['B', 'C']
        case 'B':
          return ['C', 'D']
        case 'C':
          return ['B', 'D']
        case 'D':
          return[]
      }
    }

    const simplification = simplifyGraph(nodes, goesTo)
    expect(simplification).toHaveLength(4)
    const nodeB = simplification.find(it => it.node === 'B')
    expect(nodeB).not.toBeUndefined()
    expect(nodeB?.comesFrom).toHaveLength(2)
    expect(nodeB?.goesTo).toHaveLength(2)
    expect(nodeB?.comesFrom.map(it => it.weight)).toEqual([1, 1])
})

test('simplifyGraph will remove all adjacency 2 nodes', () => {
    type Value = 'A' | 'B1' | 'C1' | 'D1' | 'B2' | 'C2' | 'D2' | 'E'

    const nodes: Value[] = ['A', 'B1', 'C1', 'D1', 'B2', 'C2', 'D2', 'E']
    const goesTo = (node: Value): Value[] =>{
      if(node === 'A'){
        return ['B1', 'B2']
      }
      if(node[0] === 'B'){
        return ['C' + node[1] as Value]
      }
      if(node[0] === 'C'){
        return ['D' + node[1] as Value]
      }
      if(node[0] === 'D'){
        return ['E']
      }
      return []
    }

    const simplification = simplifyGraph(nodes, goesTo)
    expect(simplification).toHaveLength(2)
    const nodeA = simplification.find(it => it.node === 'A')
    expect(nodeA).not.toBeUndefined()
    expect(nodeA?.comesFrom).toHaveLength(0)
    expect(nodeA?.goesTo).toHaveLength(2)
    expect(nodeA?.goesTo.map(it => it.weight)).toEqual([4, 4])
    expect(nodeA?.goesTo.map(it => it.to.node)).toEqual(['E', 'E'])
})

const map = `#.#####################
#.......#########...###
#######.#########.#.###
###.....#.....###.#.###
###.#####.#.#.###.#.###
###.....#.#.#.....#...#
###.###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########.#
#.#...#...#...###.....#
#.#.#.#######.###.###.#
#...#...#.......#.###.#
#####.#.#.###.#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###.#####.###
#...#...#.#.....#...###
#.###.###.#.###.#.#.###
#.....###...###...#...#
#####################.#`.split('\n')

export interface Position{
    x: number
    y: number
}

const nodes: Position[] = []
for(let i = 0; i < map.length; i++){
  for(let j = 0; j < map[i].length; j++){
    if(map[i][j] === '.'){
      nodes.push({x: i, y: j})
    }
  }
}

const getNeighbours = (position: Position): Position[] => {
  const {x, y} = position

  const result: Position[] = []
  let node: Position | undefined
  if(x > 0 && (node = nodes.find(it => it.x === x - 1 && it.y === y)) !== undefined){
    result.push(node)
  }

  if(x < map.length - 1 && (node = nodes.find(it => it.x === x + 1 && it.y === y)) !== undefined){
    result.push(node)
  }
  if(y > 0 && (node = nodes.find(it => it.x === x && it.y === y - 1)) !== undefined){
    result.push(node)
  }

  if(y < map[x].length - 1 && (node = nodes.find(it => it.x === x && it.y === y + 1)) !== undefined){
    result.push(node)
  }

  return result
}

test('Complex example', () => {
  const simplification = simplifyGraph(nodes, getNeighbours)
  expect(simplification).toHaveLength(9)
  const initialNode = simplification.find(it => it.node === nodes[0])
  expect(initialNode).not.toBeUndefined()
  expect(initialNode?.goesTo).toHaveLength(1)
  expect(initialNode?.goesTo[0].to.node).toEqual({x: 5, y: 3})
  expect(initialNode?.goesTo[0].weight).toBe(15)
})