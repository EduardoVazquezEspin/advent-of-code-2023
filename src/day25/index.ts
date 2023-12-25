import {getDIO, getGraphConnectivity, groupAndCount, kargersMinCut, matchStringTemplate} from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day25'))

interface Node{
  id: string
  edges: Edge[]
}

interface Edge{
  connects: [Node, Node]
}

const readInput = (input: string[]): [Node[], Edge[]] => {
  const nodes : Node[] = []
  const connectionsStr: string[][] = []
  const map: Record<string, Node> = {}

  for(let i = 0; i < input.length; i++){
    const matching = matchStringTemplate(input[i], /([a-z]+): (.*)/g)
    const id = matching[0]
    const newNode : Node = {
      id,
      edges: []
    }
    map[id] = newNode
    nodes.push(newNode)
    connectionsStr.push(matching[1].length > 0 ? matching[1].split(' ') : [])
  }

  const edges: Edge[] = []

  for(let i = 0;i < input.length; i++){
    connectionsStr[i].forEach(id=>{
      let other: Node | undefined = map[id]
      if(other === undefined){
        other = {
          id,
          edges: []
        }
        map[id] = other
        nodes.push(other)
      }
      const newEdge: Edge = {
        connects: [nodes[i], other]
      }
      edges.push(newEdge)
      nodes[i].edges.push(newEdge)
      other.edges.push(newEdge)
    })
  }

  return [nodes, edges]
}

// Naive Solution

// dio.part1 = input => {
//   const [nodes, edges] = readInput(input)
//   let hasFinished: boolean = false
//   let result: number = -1
//   for(let i = 0; !hasFinished && i < edges.length - 2; i++){
//     for(let j = i + 1; !hasFinished && j < edges.length - 1; j++){
//       for(let k = j + 1; !hasFinished && k < edges.length; k++){
//         const goesTo = (node: Node): Node[] => {
//           return node
//             .edges
//             .filter(it => it !== edges[i] && it !== edges[j] && it !== edges[k])
//             .map(it => it.connects.filter(other => other !== node)[0])
//         }
//         const [connexionNumber, connexionMap] = getGraphConnectivity(nodes, goesTo)
//         hasFinished = connexionNumber === 2
//         if(hasFinished){
//           const values = []
//           for(const value of connexionMap.values()){
//             values.push(value)
//           }
//           const count = groupAndCount(values)
//           result = count[0].count * count[1].count
//         }
//       }
//     }
//   }
//   return result
// }

dio.part1 = input => {
  const [nodes, edges] = readInput(input)
  let cut: Edge[]
  do{
    cut = kargersMinCut<Node, Edge>(edges)
  } while(cut.length !== 3)

  const goesTo = (node: Node): Node[] => {
    return node
      .edges
      .filter(it => !cut.includes(it))
      .map(it => it.connects.filter(other => other !== node)[0])
  }
  const [connexionNumber, connexionMap] = getGraphConnectivity(nodes, goesTo)

  if(connexionNumber !== 2){
    throw new Error('Something Went Wrong')
  }

  const values = []
  for(const value of connexionMap.values()){
    values.push(value)
  }
  const count = groupAndCount(values)
  return count[0].count * count[1].count
}

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
