export const getGraphConnectivity = <T>(
  nodes: T[],
  goesTo: (input: T) => T[]
):[number, Map<T, number>] => {
  const visitingNumber: Map<T, number> = new Map()
  let connectionNumber: number = 0
  let collisions: number = 0
  for(let i = 0; i < nodes.length; i++){
    if(!visitingNumber.has(nodes[i])){
      connectionNumber++
      const queue: Array<[T, number]> = [[nodes[i], connectionNumber]]
      const collisionsWith: Set<number> = new Set<number>()
      let top: [T, number] | undefined
      let otherNumber: number | undefined
      while((top = queue.shift()) !== undefined){
        const [currNode, currNumber] = top
        if((otherNumber = visitingNumber.get(currNode)) === undefined){
          visitingNumber.set(currNode, currNumber)
          const neighbours = goesTo(currNode)
          neighbours.forEach(it => {
            queue.push([it, currNumber])
          })
        } else if(otherNumber !== currNumber){
          if(!collisionsWith.has(otherNumber)){
            collisionsWith.add(otherNumber)
            collisions++
          }
          visitingNumber.set(currNode, currNumber)
          const neighbours = goesTo(currNode)
          neighbours.forEach(it => {
            queue.push([it, currNumber])
          })
        }
      }
    }
  }
  return [connectionNumber - collisions, visitingNumber]
}