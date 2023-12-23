export const gcd = (...args: number[]): number => {
  if (args.length < 2) {
    return args[0] ?? 0
  }
  return gcd(gcdTwoNumbers(args[0], args[1]), ...args.filter((_, index) => index > 1))
}

const gcdTwoNumbers = (a: number, b: number): number => {
  if (b === 0) {
    return a
  }
  return gcdTwoNumbers(b, a % b)
}
