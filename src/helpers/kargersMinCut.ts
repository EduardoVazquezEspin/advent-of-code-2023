export interface Edge<T>{
    connects: [T, T]
}

interface InternalNode<T, E extends Edge<T>>{
    edges: InternalEdge<T, E>[]
}

interface InternalEdge<T, E extends Edge<T>>{
    edge: E
    connects: [InternalNode<T, E>, InternalNode<T, E>]
}

/**
 * Runs Karger's algorithm on a Connected Graph
 *
 * @summary
 * Requires the graph to be connected.
 * The result is heuristic and so it should be run several times.
 * https://en.wikipedia.org/wiki/Karger%27s_algorithm
 * @param {E extends Edge<T>} edges The edges of the graph.
 * @return {ReturnValueDataTypeHere} A set cut of edges with high probability of being the min-cut.
 */
export const kargersMinCut = <T, E extends Edge<T>>(edges: E[]): E[] => {
  const nodes: Map<T, InternalNode<T, E>> = new Map<T, InternalNode<T, E>>()
  let nodeCount: number = 0
  let internalEdges: InternalEdge<T, E>[] = edges.map(it => {
    let node1: InternalNode<T, E> | undefined = nodes.get(it.connects[0])
    if(node1 === undefined){
      nodeCount++
      node1 = {
        edges: []
      }
      nodes.set(it.connects[0], node1)
    }
    let node2: InternalNode<T, E> | undefined = nodes.get(it.connects[1])
    if(node2 === undefined){
      nodeCount++
      node2 = {
        edges: []
      }
      nodes.set(it.connects[1], node2)
    }
    const edge : InternalEdge<T, E> = {edge: it, connects: [node1, node2]}
    node1.edges.push(edge)
    node2.edges.push(edge)
    return edge
  })
  if(nodeCount < 2){
    throw new Error('Not Enough Nodes')
  }
  while(nodeCount > 2 && internalEdges.length > 0){
    const rand = Math.floor(internalEdges.length * Math.random())
    const edge = internalEdges[rand]
    internalEdges = internalEdges.filter(it => it !== edge)
    if(edge.connects[0] !== edge.connects[1]){
      nodeCount--
      const filteredEdges1 = edge.connects[0].edges.filter(it => it !== edge)
      const filteredEdges2 = edge.connects[1].edges.filter(it => it !== edge)
      const virtualNode: InternalNode<T, E> = {
        edges: [
          ...filteredEdges1,
          ...filteredEdges2
        ]
      }
      filteredEdges1.forEach(other => {
        other.connects = other.connects.map(it => {
          if(it === edge.connects[0]){
            return virtualNode
          }
          return it
        }) as [InternalNode<T, E>, InternalNode<T, E>]
      })
      filteredEdges2.forEach(other => {
        other.connects = other.connects.map(it => {
          if(it === edge.connects[1]){
            return virtualNode
          }
          return it
        }) as [InternalNode<T, E>, InternalNode<T, E>]
      })
    }
  }
  if(nodeCount > 2){
    throw new Error('Graph Is Not Connected With >2 Connected Subgraphs')
  }
  return internalEdges.filter(it => it.connects[0] !== it.connects[1]).map(it => it.edge)
}