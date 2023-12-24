interface GroupAndCount<T> {
  value: T
  count: number
}

export const groupAndCount = <T>(input: T[]): Array<GroupAndCount<T>> => {
  const dictionary = input.reduce<Map<T, number>>((acc, curr) => {
    const val = acc.get(curr)
    acc.set(curr, val === undefined ? 1 : val + 1)
    return acc
  }, new Map<T, number>())

  const iter = dictionary.entries()
  const result: Array<GroupAndCount<T>> = []
  let x: [T, number] | undefined
  while ((x = iter.next().value) !== undefined) {
    result.push({value: x[0], count: x[1]})
  }
  return result.sort((a, b) => b.count - a.count)
}
