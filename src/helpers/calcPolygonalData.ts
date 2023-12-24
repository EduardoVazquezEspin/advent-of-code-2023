type Vector2D = [number, number]

export type Polygonal = Vector2D[]

export interface PolygonalData {
  biarea: number
  perimeter: number
}

interface PolygonalNode {
  type: 'polygonal'
  vector: Vector2D
}

const scalePolygonalNode = (scalar: number, node: PolygonalNode): PolygonalNode => {
  return {type: 'polygonal', vector: [scalar * node.vector[0], scalar * node.vector[1]]}
}

interface IntersectionNode {
  type: 'intersection'
  index: number
  entry: InstructionsNode[]
  exit: InstructionsNode[]
}

interface InstructionsNode {
  type: 'instructions'
  biarea: number
  perimeter: number
  start: IntersectionNode | undefined
  end: IntersectionNode | undefined
}

type PolygonalOrIntersectionNode = PolygonalNode | IntersectionNode

type InstructionsOrIntersectionNode = InstructionsNode | IntersectionNode

interface OrientedInstructions {
  instructions: InstructionsNode
  orientation: boolean
}

interface PathOfInstructions {
  path: OrientedInstructions[]
  biarea: number
  perimeter: number
}

const addInstructionsNode = (node: OrientedInstructions, path: PathOfInstructions): void => {
  path.perimeter += node.instructions.perimeter
  path.biarea += (node.orientation ? 1 : -1) * node.instructions.biarea
  path.path.push(node)
}

const vectorLength = (vector: Vector2D): number => {
  if (vector[0] === 0) {
    return Math.abs(vector[1])
  }
  if (vector[1] === 0) {
    return Math.abs(vector[0])
  }
  return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1])
}

export const intersection = (point1: Vector2D, vector1: Vector2D, point2: Vector2D, vector2: Vector2D): Vector2D | undefined => {
  const det = vector1[1] * vector2[0] - vector1[0] * vector2[1]
  if (det === 0) {
    return undefined
  }
  const diff = [point2[0] - point1[0], point2[1] - point1[1]]
  const constant1 = (vector2[0] * diff[1] - vector2[1] * diff[0]) / det
  if (constant1 < 0 || constant1 > 1) {
    return undefined
  }
  const constant2 = (vector1[0] * diff[1] - vector1[1] * diff[0]) / det
  if (constant2 < 0 || constant2 > 1) {
    return undefined
  }
  return [constant1, constant2]
}

const findIntersectionsAndCut = (polygonal: Polygonal): PolygonalOrIntersectionNode[] => {
  let listWithIntersections: PolygonalOrIntersectionNode[] = []
  const currentWork: PolygonalOrIntersectionNode[] = []
  const displacement: Vector2D = [0, 0]
  let intersectionIndex: number = 0
  let top: PolygonalOrIntersectionNode | undefined
  for (let i = 0; i < polygonal.length; i++) {
    currentWork.push({type: 'polygonal', vector: polygonal[i]})
    while ((top = currentWork.pop()) !== undefined) {
      if (top.type === 'polygonal') {
        let hasIntersections: boolean = false
        let index: number = 0
        let params: Vector2D | undefined
        const currentDisplacement: Vector2D = [0, 0]
        while (!hasIntersections && index < listWithIntersections.length) {
          const currentNode = listWithIntersections[index]
          if (currentNode.type === 'polygonal') {
            params = intersection(displacement, top.vector, currentDisplacement, currentNode.vector)
            currentDisplacement[0] += currentNode.vector[0]
            currentDisplacement[1] += currentNode.vector[1]
            hasIntersections = params !== undefined && params[0] !== 0 && params[0] !== 1 && params[1] !== 0 && params[1] !== 1
          }
          index++
        }
        index--
        const currentNode = listWithIntersections[index]
        if (hasIntersections && currentNode.type === 'polygonal' && params !== undefined) {
          const intersectionNode: IntersectionNode = {
            type: 'intersection',
            index: intersectionIndex++,
            entry: [],
            exit: []
          }
          listWithIntersections = [
            ...listWithIntersections.filter((_, pos) => pos < index),
            scalePolygonalNode(params[1], currentNode),
            intersectionNode,
            scalePolygonalNode(1 - params[1], currentNode),
            ...listWithIntersections.filter((_, pos) => pos > index)
          ]
          currentWork.push(scalePolygonalNode(1 - params[0], top))
          currentWork.push(intersectionNode)
          currentWork.push(scalePolygonalNode(params[0], top))
        } else {
          listWithIntersections.push(top)
          displacement[0] += top.vector[0]
          displacement[1] += top.vector[1]
        }
      } else {
        listWithIntersections.push(top)
      }
    }
  }

  return listWithIntersections
}

const mergePolygonalsIntoInstructions = (listWithIntersections: PolygonalOrIntersectionNode[]): InstructionsOrIntersectionNode[] => {
  const listOfInstructions: InstructionsOrIntersectionNode[] = []
  const displacement: Vector2D = [0, 0]
  let prevDisplacement: Vector2D = [0, 0]
  let currentPolygonal: Polygonal = []
  for (let i = 0; i < listWithIntersections.length; i++) {
    const currentNode = listWithIntersections[i]
    if (currentNode.type === 'polygonal') {
      displacement[0] += currentNode.vector[0]
      displacement[1] += currentNode.vector[1]
      currentPolygonal.push(currentNode.vector)
    } else {
      const {biarea, perimeter} = calcPolygonalDataWithDisplacement(currentPolygonal, prevDisplacement)
      const prevIntersection = listOfInstructions.length !== 0 ? listOfInstructions[listOfInstructions.length - 1] as IntersectionNode : undefined
      const instructionsNode: InstructionsNode = {type: 'instructions', biarea, perimeter, start: prevIntersection, end: currentNode}
      if (prevIntersection !== undefined) {
        prevIntersection.exit.push(instructionsNode)
      }
      currentNode.entry.push(instructionsNode)
      listOfInstructions.push(instructionsNode)
      listOfInstructions.push(currentNode)

      prevDisplacement = [...displacement]
      currentPolygonal = []
    }
  }

  const {biarea, perimeter} = calcPolygonalData(currentPolygonal)
  const prevIntersection = listOfInstructions.length !== 0 ? listOfInstructions[listOfInstructions.length - 1] as IntersectionNode : undefined
  const instructionsNode: InstructionsNode = {type: 'instructions', biarea, perimeter, start: prevIntersection, end: undefined}
  if (prevIntersection !== undefined) {
    prevIntersection.exit.push(instructionsNode)
  }
  listOfInstructions.push(instructionsNode)

  return listOfInstructions
}

export const calcMaxPolygonalData = (polygonal: Polygonal): PolygonalData => {
  const listWithIntersections = findIntersectionsAndCut(polygonal)

  const listOfInstructions = mergePolygonalsIntoInstructions(listWithIntersections)

  const queue: PathOfInstructions[] = [{path: [], biarea: 0, perimeter: 0}]
  const results: PathOfInstructions[] = []
  addInstructionsNode({instructions: listOfInstructions[0] as InstructionsNode, orientation: true}, queue[0])
  let path: PathOfInstructions | undefined
  while ((path = queue.shift()) !== undefined) {
    const lastNode = path.path[path.path.length - 1]
    let intersectionNode: IntersectionNode | undefined
    if (lastNode.orientation && lastNode.instructions.end !== undefined) {
      intersectionNode = lastNode.instructions.end
    } else if (lastNode.orientation && lastNode.instructions.end === undefined) {
      results.push(path)
    } else if (!lastNode.orientation && lastNode.instructions.start !== undefined) {
      intersectionNode = lastNode.instructions.start
    }

    if (intersectionNode !== undefined) {
      intersectionNode.entry.forEach(node => {
        if (path !== undefined && path.path.every(it => it.instructions !== node)) {
          const copy: PathOfInstructions = {
            ...path,
            path: [...path.path]
          }
          addInstructionsNode({instructions: node, orientation: false}, copy)
          queue.push(copy)
        }
      })
      intersectionNode.exit.forEach(node => {
        if (path !== undefined && path.path.every(it => it.instructions !== node)) {
          const copy: PathOfInstructions = {
            ...path,
            path: [...path.path]
          }
          addInstructionsNode({instructions: node, orientation: true}, copy)
          queue.push(copy)
        }
      })
    }
  }

  const maxBiarea = results.reduce((acc, curr) => acc < Math.abs(curr.biarea) ? Math.abs(curr.biarea) : acc, 0)
  const minPerimeter = results.filter(it => Math.abs(it.biarea) === maxBiarea).reduce((acc, curr) => acc > curr.perimeter ? curr.perimeter : acc, Infinity)
  return {biarea: maxBiarea, perimeter: minPerimeter}
}

const calcPolygonalDataWithDisplacement = (polygonal: Polygonal, displacement: Vector2D = [0, 0]): PolygonalData => {
  let biarea: number = 0
  let perimeter: number = 0
  for (let i = 0; i < polygonal.length; i++) {
    const step = polygonal[i]
    perimeter += vectorLength(step)
    biarea += displacement[0] * step[1] - displacement[1] * step[0]
    displacement[0] += step[0]
    displacement[1] += step[1]
  }
  return {biarea, perimeter}
}

export const calcPolygonalData = (polygonal: Polygonal): PolygonalData => {
  return calcPolygonalDataWithDisplacement(polygonal)
}
