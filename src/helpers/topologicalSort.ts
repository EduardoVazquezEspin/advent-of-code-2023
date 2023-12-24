interface EvalNode<T> {
  type: 'eval'
  node: T
}

interface AddNode<T> {
  type: 'add'
  node: T
}

type StackNode<T> = EvalNode<T> | AddNode<T>

export const topologicalSort = <T>(nodes: T[], getChildren: (input: T) => T[]): T[] => {
  const result: T[] = []
  const stack: Array<StackNode<T>> = nodes.map(node => ({type: 'eval', node}))
  const visited: Set<T> = new Set<T>()
  let top: StackNode<T> | undefined
  while ((top = stack.pop()) !== undefined) {
    if (top.type === 'add') {
      result.push(top.node)
    } else {
      if (!visited.has(top.node)) {
        visited.add(top.node)
        stack.push({node: top.node, type: 'add'})
        const children = getChildren(top.node)
        children.forEach(node => {
          stack.push({node, type: 'eval'})
        })
      }
    }
  }
  return result
}
