export const getAllMatches = (str: string, regexp: RegExp, depth: number = 1): string[] => {
  const match = str.matchAll(regexp)
  const result: string[] = []
  let x: string[]
  while ((x = match.next().value) !== undefined) {
    result.push(x[depth])
  }
  return result
}
