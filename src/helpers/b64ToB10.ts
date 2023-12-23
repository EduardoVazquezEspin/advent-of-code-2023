export const b64ToB10 = (hex: string): number => {
  let res: number = 0
  for (let i = 0; i < hex.length; i++) {
    res *= 16
    switch (hex[i].toUpperCase()) {
      case 'A':
        res += 10
        break
      case 'B':
        res += 11
        break
      case 'C':
        res += 12
        break
      case 'D':
        res += 13
        break
      case 'E':
        res += 14
        break
      case 'F':
        res += 15
        break
      case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
        res += parseInt(hex[i])
        break
      default:
        throw new Error('Invalid Character')
    }
  }
  return res
}
