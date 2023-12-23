export const reduceToInterval = (min: number, max: number, num: number): number => {
  const dif = num - min
  const difNormalized = dif - dif % (max - min)
  return num - difNormalized
}
