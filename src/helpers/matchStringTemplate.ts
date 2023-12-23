export const matchStringTemplate = (str: string, template: RegExp): string[] => {
  const match = str.matchAll(template)
  const value = match.next().value
  if (value === undefined) {
    throw new Error('Invalid string template: ' + str)
  }
  return value.filter((it: string, index: number) => index > 0)
}
