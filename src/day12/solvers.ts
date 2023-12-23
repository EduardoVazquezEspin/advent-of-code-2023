interface Input {
  springs: string
  count: number[]
}

export const stringToInput = (input: string): Input => {
  const split = input.split(' ')
  const springs = split[0]
  const count = split[1] !== '' ? split[1].split(',').map(it => parseInt(it)) : []
  return { springs, count }
}

export const inputToString = (input: Input): string => {
  return input.springs + ' ' + input.count.toString()
}

export type CachedSolutions = Record<string, number>

export const solveLeft = (input: string, cache: CachedSolutions): number => {
  if (cache[input] !== undefined) {
    return cache[input]
  }

  const data: Input = stringToInput(input)
  if (data.count.length === 0) {
    const hasErrors = data.springs.includes('#')
    if (hasErrors) {
      cache[input] = 0
      return 0
    } else {
      cache[input] = 1
      return 1
    }
  }
  if (data.springs.length < data.count.reduce((acc, curr) => acc + curr + 1, -1)) {
    cache[input] = 0
    return 0
  }

  let firstResults: number = 0
  if (data.springs[0] === '.' || data.springs[0] === '?') {
    firstResults = solveLeft(
      inputToString({ springs: data.springs.slice(1), count: data.count }),
      cache
    )
  }

  let secondResults: number = 0
  let canFitResult: boolean = data.count.length === 1 || data.springs[data.count[0]] === '.' || data.springs[data.count[0]] === '?'
  for (let i = 0; i < data.count[0] && canFitResult; i++) {
    canFitResult = data.springs[i] === '#' || data.springs[i] === '?'
  }
  if (canFitResult) {
    secondResults = solveLeft(
      inputToString({ springs: data.springs.slice(data.count[0] + (data.count.length === 1 ? 0 : 1)), count: data.count.filter((_, index) => index > 0) }),
      cache
    )
  }

  const total = firstResults + secondResults
  cache[input] = total
  return total
}

export const solveRight = (input: string, cache: CachedSolutions): number => {
  if (cache[input] !== undefined) {
    return cache[input]
  }

  const data: Input = stringToInput(input)
  if (data.count.length === 0) {
    const hasErrors = data.springs.includes('#')
    if (hasErrors) {
      cache[input] = 0
      return 0
    } else {
      cache[input] = 1
      return 1
    }
  }
  if (data.springs.length < data.count.reduce((acc, curr) => acc + curr + 1, -1)) {
    cache[input] = 0
    return 0
  }

  const len = data.springs.length

  let firstResults: number = 0
  if (data.springs[len - 1] === '.' || data.springs[len - 1] === '?') {
    firstResults = solveRight(
      inputToString({ springs: data.springs.slice(0, len - 1), count: data.count }),
      cache
    )
  }

  let secondResults: number = 0
  const lastCount = data.count[data.count.length - 1]
  let canFitResult: boolean = data.count.length === 1 || data.springs[len - lastCount - 1] === '.' || data.springs[len - lastCount - 1] === '?'
  for (let i = 1; i <= lastCount && canFitResult; i++) {
    canFitResult = data.springs[len - i] === '#' || data.springs[len - i] === '?'
  }
  if (canFitResult) {
    secondResults = solveRight(
      inputToString({ springs: data.springs.slice(0, len - lastCount - (data.count.length === 1 ? 0 : 1)), count: data.count.filter((_, index) => index < data.count.length - 1) }),
      cache
    )
  }

  const total = firstResults + secondResults
  cache[input] = total
  return total
}

export const solveAsync = async (input: string, cache: CachedSolutions): Promise<number> => {
  if (cache[input] !== undefined) {
    return cache[input]
  }
  const leftPromise = new Promise<number>((resolve) => { resolve(solveLeft(input, cache)) })
  const rightPromise = new Promise<number>((resolve) => { resolve(solveRight(input, cache)) })
  return await Promise.any([leftPromise, rightPromise])
}
