export const splitInput = (input: string[], separator: string): string[][] =>
  input.length === 0
    ? []
    : input.reduce((acc: string[][], curr: string) => {
      if (curr === separator) {
        acc.push([])
      } else {
        acc[acc.length - 1] = [
          ...acc[acc.length - 1],
          curr
        ]
      }
      return acc
    }, [[]])
