export interface IComparable {
  compareTo: (other: IComparable) => number
}

export class PriorityQueue<T extends IComparable> {
  private readonly storage: T[] = []

  constructor (private readonly capacity: number = Infinity) {}

  enqueue (item: T): void {
    if (this.size() === this.capacity) {
      throw Error('Queue has reached max capacity, you cannot add more items')
    }
    let index: number = this.storage.length
    this.storage.push(item)

    let parent: number | null = this.parentIndex(index)
    while (parent !== null && this.storage[index].compareTo(this.storage[parent]) > 0) {
      [this.storage[index], this.storage[parent]] = [this.storage[parent], this.storage[index]]

      index = parent
      parent = this.parentIndex(index)
    }
  }

  dequeue (): T | undefined {
    if (this.storage.length === 0) {
      return undefined
    }
    const result = this.storage[0]
    const element = this.storage.pop()
    if (element !== undefined && this.storage.length !== 0) {
      this.storage[0] = element
      let index = 0
      let bigger = []
      do {
        const left = this.leftChildIndex(index)
        const right = this.rightChildIndex(index)
        bigger = []
        if (this.storage[left] !== undefined && this.storage[index].compareTo(this.storage[left]) < 0) {
          bigger.push(left)
        }
        if (this.storage[right] !== undefined && this.storage[index].compareTo(this.storage[right]) < 0) {
          bigger.push(right)
        }
        if (bigger.length > 0) {
          if (bigger.length === 2) {
            if (this.storage[left].compareTo(this.storage[right]) > 0) {
              bigger.pop()
            } else {
              bigger.shift()
            }
          }
          [this.storage[index], this.storage[bigger[0]]] = [this.storage[bigger[0]], this.storage[index]]
          index = bigger[0]
        }
      } while (bigger.length > 0)
    }
    return result
  }

  size (): number {
    return this.storage.length
  }

  private parentIndex (index: number): number | null {
    if (index === 0) {
      return null
    }
    return index >>> 1
  }

  private leftChildIndex (index: number): number {
    return 2 * index + 1
  }

  private rightChildIndex (index: number): number {
    return 2 * index + 2
  }
}
