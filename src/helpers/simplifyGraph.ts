export interface Node<T>{
    node: T
    goesTo: Edge<T>[]
    comesFrom: Edge<T>[]
}

export interface Edge<T>{
    weight: number
    from: Node<T>
    to: Node<T>
}

export const equal2Array = <T>(arrayFrom: Edge<T>[], arrayTo: Edge<T>[]): boolean => {
  if(arrayFrom.length !== 2 || arrayTo.length !== 2){
    return false
  }
  if(arrayFrom[0].from === arrayFrom[1].from){
    return false
  }
  if(arrayFrom[0].from === arrayTo[0].to && arrayFrom[1].from === arrayTo[1].to){
    [arrayFrom[0], arrayFrom[1]] = [arrayFrom[1], arrayFrom[0]]
    return true
  }
  if(arrayFrom[0].from === arrayTo[1].to && arrayFrom[1].from === arrayTo[0].to){
    return true
  }
  return false
}

export const simplifyGraph = <T>(
  nodes: T[], 
  goesTo: (input: T) => T[]
): Node<T>[] => {
  const map = new Map<T, Node<T>>()
  let extendedNodes: Node<T>[] = nodes.map(it => {
    const node = {
      node: it,
      goesTo: [],
      comesFrom: []
    }
    map.set(it, node)
    return node
  })

  nodes.forEach(it => {
    const node = map.get(it)
    if(node === undefined){
      return
    }
    const goesToValues = goesTo(it)
    goesToValues.forEach(other => {
      const otherNode = map.get(other)
      if(otherNode === undefined){
        return
      }
      const edge :Edge<T> = {
        weight: 1,
        from: node,
        to: otherNode
      }
      node.goesTo.push(edge)
      otherNode.comesFrom.push(edge)
    })
  })

  for(let i = 0; i < extendedNodes.length; i++){
    const node = extendedNodes[i]
    if(node.goesTo.length === 1 && node.comesFrom.length === 1){
      const edgeTo = node.goesTo[0]
      const edgeFrom = node.comesFrom[0]
      if(edgeTo.to !== edgeFrom.from){
        const newEdge : Edge<T> = {
          weight: edgeTo.weight + edgeFrom.weight,
          from: edgeFrom.from,
          to: edgeTo.to
        }
        edgeFrom.from.goesTo = edgeFrom.from.goesTo.map(it => {
          if(it !== edgeFrom){
            return it
          }
          return newEdge
        })
        edgeTo.to.comesFrom = edgeTo.to.comesFrom.map(it => {
          if(it !== edgeTo){
            return it
          }
          return newEdge
        })
        extendedNodes = extendedNodes.filter((_, index) => index !== i)
        i--
      }
    }
    else if(equal2Array(node.comesFrom, node.goesTo)){
      const edgesTo = node.goesTo
      const edgesFrom = node.comesFrom
      for(let j = 0; j < 2; j++){
        const newEdge : Edge<T> = {
          weight: edgesFrom[j].weight + edgesTo[j].weight,
          from: edgesFrom[j].from,
          to: edgesTo[j].to
        }
        edgesFrom[j].from.goesTo = edgesFrom[j].from.goesTo.map(it => {
          if(it !== edgesFrom[j]){
            return it
          }
          return newEdge
        })
        edgesTo[j].to.comesFrom = edgesTo[j].to.comesFrom.map(it => {
          if(it !== edgesTo[j]){
            return it
          }
          return newEdge
        })
      }
      extendedNodes = extendedNodes.filter((_, index) => index !== i)
      i--
    }
  }

  return extendedNodes
}