import { gcd } from './gcd.ts'

export const lcm = (...args: number[]): number => {
  if (args.length < 2) {
    return args[0] ?? 0
  }
  return lcm(lcmTwoNumbers(args[0], args[1]), ...args.filter((_, index) => index > 1))
}

const lcmTwoNumbers = (a: number, b: number): number => {
  return a * b / gcd(a, b)
}
