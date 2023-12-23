export const setCharAt = (str: string, index: number, char: string): string => {
  if (index > str.length - 1) {
    return str
  }
  return str.slice(0, index) + char + str.slice(index + 1)
}
