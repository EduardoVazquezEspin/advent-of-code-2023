import { Node, getDIO, simplifyGraph } from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day23'), 'test1b', 'test2b', 'test2c', 'test2d')

export interface Position{
    x: number
    y: number
}

interface TravellingNode<T>{
    type: 'eval' | 'calc'
    history: T[]
}

export const historyToString = (history: Position[]): string => {
  let result: string = ''
  for(let i = 0; i < history.length; i++){
    if(i !== 0){
      result += ';'
    }
    result += `${history[i].x},${history[i].y}`
  }
  return result
}

export const stringToHistory = (str: string): Position[] => {
  const split = str.split(';')
  const result : Position[] = []
  for(let i = 0; i < split.length; i++){
    const split2: number[] = split[i].split(',').map(it => parseInt(it))
    result.push({x: split2[0], y: split2[1] })
  }
  return result
}

const findStartingIndex = (input: string[]) => {
  for(let i = 0; i < input[0].length; i++){
    if(input[0][i] === '.'){
      return i
    }
  }
  throw new Error('Starting Point Not Found')
}

const getNeighbours = (position: Position, input: string[]): Position[] => {
  const { x, y } = position

  const startingChar = input[x][y]
  const result: Position[] = []
  if(x > 0 && ['.', '^'].includes(startingChar) && input[x - 1][y] !== '#'){
    result.push({x: x - 1, y})
  }

  if(x < input.length - 1 && ['.', 'v'].includes(startingChar) && input[x + 1][y] !== '#'){
    result.push({x: x + 1, y})
  }
  if(y > 0 && ['.', '<'].includes(startingChar) && input[x][y - 1] !== '#'){
    result.push({x, y: y - 1})
  }

  if(y < input[x].length - 1 && ['.', '>'].includes(startingChar) && input[x][y + 1] !== '#'){
    result.push({x, y: y + 1})
  }

  return result
}

dio.part1 = input => {
  const start = findStartingIndex(input)
    
  const stack: TravellingNode<Position>[] = [{ history: [{ x: 0, y: start}], type: 'eval'}]
  let top: TravellingNode<Position> | undefined
  const cache: Record<string, number> = {}
  while((top = stack.pop())){
    if(top.type === 'calc'){
      const { history } = top
      const last = history[history.length - 1]
      if(last.x === input.length - 1){
        cache[historyToString(history)] = 0
      } else{
        let neighbours = getNeighbours(last, input)
        neighbours = neighbours.filter(it => history.find(other => other.x === it.x && other.y === it.y) === undefined)
    
        const max = neighbours.reduce((acc: number | undefined, curr): number | undefined => {
          const newHistory = [...history, curr]
          const str = historyToString(newHistory)
          const cached = cache[str]
          if(cached === undefined){
            return acc
          }
          return (acc === undefined || acc < cached) ? cached : acc
        }, undefined)
    
        const str = historyToString(history)
    
        if(max !== undefined && (cache[str] === undefined || cache[str] < max + 1)){
          cache[str] = max + 1
        }
      }
    } else {
      const { history } = top
      const last = history[history.length - 1]
    
      stack.push({...top, type: 'calc'})
      let neighbours = getNeighbours(last, input)
      neighbours = neighbours.filter(it => history.find(other => other.x === it.x && other.y === it.y) === undefined)
    
      neighbours.forEach(neighbour => stack.push({history: [...history, neighbour], type: 'eval'}))
    }
  }
  return cache[historyToString([{ x: 0, y: start}])]
}

dio.part2 = input => {
  const nodes: Position[] = []
  for(let i = 0; i < input.length; i++){
    for(let j = 0; j < input[i].length; j++){
      if(input[i][j] !== '#'){
        nodes.push({x: i, y: j})
      }
    }
  }

  const goesTo = (position: Position): Position[] => {
    const { x, y } = position
    
    const result: Position[] = []
    let node: Position | undefined
    if(x > 0 && (node = nodes.find(it => it.x === x - 1 && it.y === y)) !== undefined){
      result.push(node)
    }
    
    if(x < input.length - 1 && (node = nodes.find(it => it.x === x + 1 && it.y === y)) !== undefined){
      result.push(node)
    }
    if(y > 0 && (node = nodes.find(it => it.x === x && it.y === y - 1)) !== undefined){
      result.push(node)
    }
    
    if(y < input[x].length - 1 && (node = nodes.find(it => it.x === x && it.y === y + 1)) !== undefined){
      result.push(node)
    }
    
    return result
  }

  const simplified: Node<Position>[] = simplifyGraph(nodes, goesTo)

  const startIndex = findStartingIndex(input)
  const nodeStart: Node<Position> | undefined = simplified.find(it => it.node.x === 0 && it.node.y === startIndex)

  if(nodeStart === undefined){
    throw new Error('Unable to Find Starting Node')
  }
  
  const stack: TravellingNode<Node<Position>>[] = [{ history: [nodeStart], type: 'eval'}]
  let top: TravellingNode<Node<Position>> | undefined
  const cache: Record<string, number> = {}
  while((top = stack.pop())){
    if(top.type === 'calc'){
      const { history } = top
      const last = history[history.length - 1]
      if(last.node.x === input.length - 1){
        cache[historyToString(history.map(it => it.node))] = 0
      } else{
        let neighbours = last.goesTo.map(it => it.to)
        neighbours = neighbours.filter(it => !history.includes(it))
  
        const max = neighbours.reduce((acc: number | undefined, curr: Node<Position>): number | undefined => {
          const newHistory = [...history, curr]
          const str = historyToString(newHistory.map(it => it.node))
          const cached = cache[str]
          if(cached === undefined){
            return acc
          }
          const edgeWeight = curr.goesTo.filter(it => it.to === last).reduce((acc: number | undefined, curr) => (acc === undefined || acc < curr.weight) ? curr.weight : acc, undefined)
          if(edgeWeight === undefined){
            return acc
          }
          const total = cached + edgeWeight
          return (acc === undefined || acc < total) ? total : acc
        }, undefined)
  
        const str = historyToString(history.map(it => it.node))
  
        if(max !== undefined && (cache[str] === undefined || cache[str] < max)){
          cache[str] = max
        }
      }
    } else {
      const { history } = top
      const last = history[history.length - 1]
  
      stack.push({...top, type: 'calc'})
      let neighbours = last.goesTo.map(it => it.to)
      neighbours = neighbours.filter(it => !history.includes(it))

      neighbours.forEach(neighbour => stack.push({history: [...history, neighbour], type: 'eval'}))
    }
  }
  return cache[historyToString([{ x: 0, y: startIndex}])]
}

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}

