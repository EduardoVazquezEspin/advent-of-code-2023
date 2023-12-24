import {getDIO, matchStringTemplate} from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day19'))

interface CommonInstruction {
  type: string
  result: string
}

type Category = 'x' | 'm' | 'a' | 's'

type Comparator = '<' | '>'

interface Conditional extends CommonInstruction {
  type: 'conditional'
  category: Category
  comparator: Comparator
  value: number
}

interface Fixed extends CommonInstruction {
  type: 'fixed'
}

type Instruction = Conditional | Fixed

interface Workflow {
  instructions: Instruction[]
  name: string
}

type MetalShape = Record<Category, number>

interface Range {
  min: number
  max: number
}

const getRangeLength = (range: Range): number => {
  return Math.max(range.max - range.min + 1, 0)
}

type RangedMetalShape = Record<Category, Range>

const copyRangedMetalShape = (rms: RangedMetalShape): RangedMetalShape => {
  return {
    x: {...rms.x},
    m: {...rms.m},
    a: {...rms.a},
    s: {...rms.s}
  }
}

const getPossibilities = (rms: RangedMetalShape): number => {
  return getRangeLength(rms.x) * getRangeLength(rms.m) * getRangeLength(rms.a) * getRangeLength(rms.s)
}

const hasPossibilities = (rms: RangedMetalShape): boolean => {
  if (getRangeLength(rms.x) === 0) {
    return false
  }
  if (getRangeLength(rms.m) === 0) {
    return false
  }
  if (getRangeLength(rms.a) === 0) {
    return false
  }
  if (getRangeLength(rms.s) === 0) {
    return false
  }

  return true
}

dio.part1 = input => {
  let index: number = 0
  let line: string
  const workflows: Record<string, Workflow> = {}
  while ((line = input[index]) !== '') {
    const matches = matchStringTemplate(line, /^([a-z]+)\{(.+)\}$/g)
    const name = matches[0]
    const instructionsStr = matches[1]
    const instructions: Instruction[] = instructionsStr.split(',').map(it => {
      if (it.includes(':')) {
        const matching = matchStringTemplate(it, /^([a-z]+)(<|>)(\d+):([a-z]+|A|R)$/g)
        const category: Category = matching[0] as Category
        const comparator: Comparator = matching[1] as Comparator
        const value: number = parseInt(matching[2])
        const result: string = matching[3]
        return {type: 'conditional', category, comparator, value, result}
      } else {
        return {type: 'fixed', result: it}
      }
    })
    workflows[name] = {instructions, name}
    index++
  }
  index++

  const metalShapes: MetalShape[] = []
  while (index < input.length) {
    const metalShapeStr = matchStringTemplate(input[index], /^\{x=(\d+),m=(\d+),a=(\d+),s=(\d+)\}$/g)
    const x = parseInt(metalShapeStr[0])
    const m = parseInt(metalShapeStr[1])
    const a = parseInt(metalShapeStr[2])
    const s = parseInt(metalShapeStr[3])
    metalShapes.push({x, m, a, s})
    index++
  }

  const accepted: MetalShape[] = []
  const rejected: MetalShape[] = []
  let top: MetalShape | undefined
  while ((top = metalShapes.shift()) !== undefined) {
    let currWorkflow: string = 'in'
    while (currWorkflow !== 'A' && currWorkflow !== 'R') {
      const workflow = workflows[currWorkflow]
      if (workflow === undefined) {
        throw new Error('Something Went Wrong')
      }
      let hasPassed = false
      for (let i = 0; !hasPassed && i < workflow.instructions.length; i++) {
        const instruction = workflow.instructions[i]
        if (instruction.type === 'conditional') {
          if (instruction.comparator === '<') {
            if (top[instruction.category] < instruction.value) {
              hasPassed = true
              currWorkflow = instruction.result
            }
          } else {
            if (top[instruction.category] > instruction.value) {
              hasPassed = true
              currWorkflow = instruction.result
            }
          }
        } else {
          hasPassed = true
          currWorkflow = instruction.result
        }
      }
    }
    if (currWorkflow === 'A') {
      accepted.push(top)
    } else {
      rejected.push(top)
    }
  }

  return accepted.reduce((acc, curr) => acc + curr.x + curr.m + curr.a + curr.s, 0)
}

dio.part2 = input => {
  let index: number = 0
  let line: string
  const workflows: Record<string, Workflow> = {}
  while ((line = input[index]) !== '') {
    const matches = matchStringTemplate(line, /^([a-z]+)\{(.+)\}$/g)
    const name = matches[0]
    const instructionsStr = matches[1]
    const instructions: Instruction[] = instructionsStr.split(',').map(it => {
      if (it.includes(':')) {
        const matching = matchStringTemplate(it, /^([a-z]+)(<|>)(\d+):([a-z]+|A|R)$/g)
        const category: Category = matching[0] as Category
        const comparator: Comparator = matching[1] as Comparator
        const value: number = parseInt(matching[2])
        const result: string = matching[3]
        return {type: 'conditional', category, comparator, value, result}
      } else {
        return {type: 'fixed', result: it}
      }
    })
    workflows[name] = {instructions, name}
    index++
  }

  const queue: Array<[RangedMetalShape, string]> = [[
    {
      x: {min: 1, max: 4000},
      m: {min: 1, max: 4000},
      a: {min: 1, max: 4000},
      s: {min: 1, max: 4000}
    }, 'in'
  ]]
  const accepted: RangedMetalShape[] = []
  const rejected: RangedMetalShape[] = []
  let top: [RangedMetalShape, string] | undefined
  while ((top = queue.shift()) !== undefined) {
    const rms: RangedMetalShape = top[0]
    let workflowId: string = top[1]
    while (workflowId !== 'A' && workflowId !== 'R' && hasPossibilities(rms)) {
      const workflow = workflows[workflowId]
      if (workflow === undefined) {
        throw new Error('Something Went Wrong')
      }
      for (let i = 0; i < workflow.instructions.length && hasPossibilities(rms); i++) {
        const instruction = workflow.instructions[i]
        if (instruction.type === 'conditional') {
          if (instruction.comparator === '<' && rms[instruction.category].min < instruction.value) {
            const copy = copyRangedMetalShape(rms)
            copy[instruction.category].max = instruction.value - 1
            rms[instruction.category].min = instruction.value
            queue.push([copy, instruction.result])
          } else if (instruction.comparator === '>' && rms[instruction.category].max > instruction.value) {
            const copy = copyRangedMetalShape(rms)
            copy[instruction.category].min = instruction.value + 1
            rms[instruction.category].max = instruction.value
            queue.push([copy, instruction.result])
          }
        } else {
          workflowId = instruction.result
        }
      }
    }
    if (workflowId === 'A' && hasPossibilities(rms)) {
      accepted.push(rms)
    } else if (hasPossibilities(rms)) {
      rejected.push(rms)
    }
  }
  return accepted.reduce((acc, curr) => acc + getPossibilities(curr), 0)
}

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
