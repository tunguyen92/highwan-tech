export function groupBy<T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key])

      if (!result[groupKey]) {
        result[groupKey] = []
      }

      result[groupKey].push(item)
      return result
    },
    {} as Record<string, T[]>
  )
}
