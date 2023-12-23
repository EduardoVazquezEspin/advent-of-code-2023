export interface Test {
  test1: string[] | undefined
  test2: string[] | undefined
  res1: string | undefined
  res2: string | undefined
  [key: string]: string | string[] | undefined
}

export interface DIO {
  part1: (input: string[]) => string | number
  part2: (input: string[]) => string | number
  params: Record<string, any>
  input: string[]
  test: Test
}
