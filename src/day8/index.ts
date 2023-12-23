import { getAllMatches, getDIO, lcm } from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day8'))

type Instructions = string

interface Node {
  id: string
  left: string
  right: string
}

interface Input {
  instructions: Instructions
  nodes: Node[]
}

export const getInput = (input: string[]): Input => {
  const instructions = input[0]
  const nodes: Node[] = []
  for (let i = 2; i < input.length; i++) {
    const ids = getAllMatches(input[i], /([A-Z]|[0-9]){3}/g, 0)
    nodes.push({
      id: ids[0],
      left: ids[1],
      right: ids[2]
    })
  }
  return {
    instructions, nodes
  }
}

dio.part1 = input => {
  const { instructions, nodes } = getInput(input)

  let currentNode: Node | undefined = nodes.find(it => it.id === 'AAA')
  let steps = 0

  while (currentNode !== undefined && currentNode.id !== 'ZZZ') {
    const direction = instructions[steps % instructions.length]
    let nextId: string = currentNode.right
    if (direction === 'L') {
      nextId = currentNode.left
    }
    currentNode = nodes.find(it => it.id === nextId)
    steps++
  }

  if (currentNode === undefined) {
    throw new Error('Something Went Wrong')
  }

  return steps
}

dio.part2 = input => {
  const { instructions, nodes } = getInput(input)

  const currentNodes: Array<Node | undefined> = nodes.filter(it => it.id[2] === 'A')

  const steps: number[] = currentNodes.map(node => {
    let steps = 0
    let currentNode = node

    while (currentNode !== undefined && currentNode.id[2] !== 'Z') {
      const direction = instructions[steps % instructions.length]
      let nextId: string = currentNode.right
      if (direction === 'L') {
        nextId = currentNode.left
      }
      currentNode = nodes.find(it => it.id === nextId)
      steps++
    }

    if (currentNode === undefined) {
      throw new Error('Something Went Wrong')
    }

    return steps
  })

  return lcm(...steps)
}

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
