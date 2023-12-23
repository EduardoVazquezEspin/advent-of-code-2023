export const getSumOfAllDifferences = (numbers: number[]): number => {
  const copy = numbers
  copy.sort((a, b) => a - b)
  const length = copy.length
  let total = 0
  let multiplier = -length + 1
  for (let i = 0; i < length; i++) {
    total += multiplier * copy[i]
    multiplier += 2
  }
  return total
}
