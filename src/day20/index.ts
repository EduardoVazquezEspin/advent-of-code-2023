import {getDIO, lcm, matchStringTemplate} from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day20'), 'test1b')

type PulseIntensity = 'low' | 'high'

interface Pulse {
  intensity: PulseIntensity
  origin: string
  destination: string
}

class Node {
  public name: string
  public destinations: string[]

  constructor (name: string, ...destinations: string[]) {
    this.name = name
    this.destinations = destinations
  }

  runPulse (pulse: Pulse): Pulse[] {
    return this.destinations.map(destination => ({destination, intensity: pulse.intensity, origin: this.name}))
  }
}

type FlipFlopState = 'on' | 'off'

class FlipFlop extends Node {
  public state: FlipFlopState

  constructor (name: string, ...destinations: string[]) {
    super(name, ...destinations)
    this.state = 'off'
  }

  private invert (): void {
    if (this.state === 'off') {
      this.state = 'on'
      return
    }
    this.state = 'off'
  }

  runPulse (pulse: Pulse): Pulse[] {
    const {intensity} = pulse

    if (intensity === 'high') {
      return []
    }

    this.invert()

    let newIntensity: PulseIntensity = 'low'
    if (this.state === 'on') {
      newIntensity = 'high'
    }

    return this.destinations.map(destination => ({destination, intensity: newIntensity, origin: this.name}))
  }
}

class Conjunction extends Node {
  public memory: Array<[string, PulseIntensity]>

  constructor (name: string, origins: string[], ...destinations: string[]) {
    super(name, ...destinations)

    this.memory = origins.reduce((acc: Array<[string, PulseIntensity]>, curr: string): Array<[string, PulseIntensity]> => [...acc, [curr, 'low']], [])
  }

  setOrigins (...origins: string[]): void {
    this.memory = origins.reduce((acc: Array<[string, PulseIntensity]>, curr: string): Array<[string, PulseIntensity]> => [...acc, [curr, 'low']], [])
  }

  runPulse (pulse: Pulse): Pulse[] {
    const {intensity, origin} = pulse

    const index = this.memory.findIndex(it => it[0] === origin)
    if (index !== -1) {
      this.memory[index][1] = intensity
    }

    let newIntensity: PulseIntensity = 'high'
    if (this.memory.every(it => it[1] === 'high')) {
      newIntensity = 'low'
    }

    return this.destinations.map(destination => ({intensity: newIntensity, origin: this.name, destination}))
  }
}

const readInput = (input: string[]): Node[] => {
  const nodes: Node[] = input.map(line => {
    const matches = matchStringTemplate(line, /^(b|%|&)([a-z]+) -> (.*)$/g)
    const type = matches[0]
    const name = matches[1]
    const destinations = matches[2].split(', ')
    if (type === 'b') {
      return new Node('broadcaster', ...destinations)
    }
    if (type === '%') {
      return new FlipFlop(name, ...destinations)
    }
    return new Conjunction(name, [], ...destinations)
  })

  nodes.forEach(node => {
    if (node instanceof Conjunction) {
      const origins: string[] = nodes.reduce((acc: string[], curr: Node) => {
        if (curr.destinations.includes(node.name)) {
          return [...acc, curr.name]
        }
        return acc
      }, [])

      node.setOrigins(...origins)
    }
  })

  return nodes
}

const pushButton = (nodes: Node[], onPulseReject: (pulse: Pulse) => boolean = () => false): [number, number] => {
  const queue: Pulse[] = [{origin: 'button', intensity: 'low', destination: 'broadcaster'}]
  let pulse: Pulse | undefined
  let lows: number = 0
  let highs: number = 0
  while ((pulse = queue.shift()) !== undefined) {
    const reject = onPulseReject(pulse)

    if (reject) {
      return [lows, highs]
    }

    if (pulse.intensity === 'low') {
      lows++
    } else {
      highs++
    }

    const destinationNode: Node | undefined = nodes.find(it => it.name === pulse?.destination)

    if (destinationNode !== undefined) {
      const newPulses = destinationNode.runPulse(pulse)
      newPulses.forEach(it => queue.push(it))
    }
  }
  return [lows, highs]
}

const stringifyNodesState = (nodes: Node[], restrictTo: string[] = []): string =>
  nodes.reduce((acc, curr) => {
    if (restrictTo.length !== 0 && !restrictTo.includes(curr.name)) {
      return acc
    }
    if (curr instanceof FlipFlop) {
      return acc + curr.name + (curr.state === 'on' ? '1' : '0') + ';'
    }
    if (curr instanceof Conjunction) {
      return acc + curr.name + curr.memory.reduce((a, b) => a + (b[1] === 'high' ? '1' : '0'), '') + ';'
    }
    return acc
  }, '')

const getChildrenOf = (name: string, nodes: Node[]): string[] => {
  const queue: string[] = [name]
  const result: string[] = []
  let top: string | undefined
  while ((top = queue.shift()) !== undefined) {
    if (!result.includes(top)) {
      result.push(top)
      const node = nodes.find(it => it.name === top)
      if (node !== undefined) {
        node.destinations.forEach(childName => {
          queue.push(childName)
        })
      }
    }
  }
  return result
}

dio.part1 = input => {
  const nodes = readInput(input)
  const cache: Array<[string, number, number]> = []
  let stringified: string = stringifyNodesState(nodes)
  const LIMIT = 1000
  while ((cache.length === 0 || stringified !== cache[0][0]) && cache.length < LIMIT) {
    const [lows, highs] = pushButton(nodes)
    cache.push([stringified, lows, highs])
    stringified = stringifyNodesState(nodes)
  }
  const product = cache.reduce((acc, curr) => [acc[0] + curr[1], acc[1] + curr[2]], [0, 0]).reduce((a, b) => a * b, 1)
  return product * (LIMIT / cache.length) ** 2
}

// Naive Solution (let it run for 20 min didn't work lol)

// dio.part2 = input => {
//   const nodes = readInput(input)
//   let hasBeenCalled: boolean = false
//   let buttonPushes: number = 0
//   while (!hasBeenCalled) {
//     buttonPushes++
//     pushButton(nodes, (pulse) => {
//       if (pulse.destination === 'rx' && pulse.intensity === 'low') {
//         hasBeenCalled = true
//         return true
//       }
//       return false
//     })
//   }
//
//   return buttonPushes
// }

if(process.env.TESTING !== 'TRUE'){

  // Obtain the sets of independent nodes

  {
    const nodes = readInput(dio.input)
    const sets: string[][] = []
    nodes.forEach(node => {
      const set = getChildrenOf(node.name, nodes)
      if (sets.every(it => it.length !== set.length || it.some(thing => !set.includes(thing)))) {
        sets.push(set)
      }
    })
    console.log(sets)
  }

interface Set {
  flipflops: string[]
  result: string
}

const sets: Set[] = [
  {
    flipflops: [
      'qx', 'gz', 'hl', 'xt',
      'ns', 'rj', 'qf', 'gs',
      'sb', 'cg', 'gj',
      'tx', 'vz', 'xv'
    ],
    result: 'gs'
  },
  {
    flipflops: [
      'tr', 'rm', 'pf', 'ml',
      'hr', 'zf', 'sr', 'xq',
      'pm', 'lc', 'zd',
      'dj', 'sx', 'qc'
    ],
    result: 'zf'
  },
  {
    flipflops: [
      'qr', 'kx', 'jm', 'zs',
      'br', 'jd', 'bj', 'vg',
      'jz', 'lx', 'pt',
      'vp', 'cb', 'sk'
    ],
    result: 'vg'
  },
  {
    flipflops: [
      'tg', 'tq', 'cp', 'tp',
      'rb', 'dt', 'kd', 'zt',
      'dm', 'lz', 'qn',
      'gp', 'vn', 'vv'
    ],
    result: 'kd'
  }
]

sets.forEach(set => {
  const nodes = readInput(dio.input)
  const cache: Array<[string, number, number]> = []
  let stringified: string = stringifyNodesState(nodes, set.flipflops)
  let index: number
  const highPulses: number[] = []
  while ((index = cache.findIndex(it => it[0] === stringified)) === -1) {
    const [lows, highs] = pushButton(nodes, (pulse: Pulse) => {
      if (pulse.origin === set.result && pulse.intensity === 'high') {
        highPulses.push(cache.length)
      }
      return false
    })
    cache.push([stringified, lows, highs])
    stringified = stringifyNodesState(nodes, set.flipflops)
  }
  console.log(index, cache.length)
})

// 1 3890 [ 3888 ]
// 1 3780 [ 3778 ]
// 1 4058 [ 4056 ]
// 1 3768 [ 3766 ]

console.log(lcm(3890 - 1, 3780 - 1, 4058 - 1, 3768 - 1)) // 224602953547789

console.log('Part 1:', dio.part1(dio.input))
}
