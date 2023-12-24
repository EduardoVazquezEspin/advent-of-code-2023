import {calcPolygonalData, calcMaxPolygonalData, type Polygonal, intersection} from '../calcPolygonalData.ts'

test.each`
case | polygonal | biarea | perimeter
${1} | ${[[2, 0], [0, 2], [-2, 0], [0, -2]]} | ${8} | ${8}
${2} | ${[[3, 0], [0, 4], [-3, -4]]} | ${12} | ${12}
${3} | ${[[2, 0], [0, 3], [1, 0], [0, -1], [-3, 0], [0, -2]]} | ${6} | ${12}
`('calcPolygonalData $case', ({polygonal, biarea, perimeter}: { polygonal: Polygonal, biarea: number, perimeter: number }) => {
  const calc = calcPolygonalData(polygonal)
  expect(Math.abs(calc.biarea)).toBe(biarea)
  expect(calc.perimeter).toBe(perimeter)
})

test.each`
case | polygonal | biarea | perimeter
${1} | ${[[2, 0], [0, 2], [-2, 0], [0, -2]]} | ${8} | ${8}
${2} | ${[[3, 0], [0, 4], [-3, -4]]} | ${12} | ${12}
${3} | ${[[2, 0], [0, 3], [1, 0], [0, -1], [-3, 0], [0, -2]]} | ${10} | ${12}
${4} | ${[[3, 0], [0, 4], [-2, 0], [0, -3], [3, 0], [0, 2], [-4, 0], [0, -3]]} | ${34} | ${24}
`('calcMaxPolygonalData $case', ({polygonal, biarea, perimeter}: { polygonal: Polygonal, biarea: number, perimeter: number }) => {
  const calc = calcMaxPolygonalData(polygonal)
  expect(Math.abs(calc.biarea)).toBe(biarea)
  expect(calc.perimeter).toBe(perimeter)
})

test.each`
case | point1 | vector1 | point2 | vector2 | result
${1} | ${[-1, 0]} | ${[2, 0]} | ${[0, -1]} | ${[0, 2]} | ${[0.5, 0.5]}
${2} |${[1, 0]} | ${[2, 0]} | ${[0, -1]} | ${[0, 2]} | ${undefined}
${3} |${[1, 0]} | ${[2, 0]} | ${[-1, 0]} | ${[2, 0]} | ${undefined}
${4} | ${[3, 0]} | ${[-5, 0]} | ${[-6, -3]} | ${[8, 4]} | ${[0.6, 0.75]}
`('intersection $case', ({point1, vector1, point2, vector2, result}) => {
  expect(intersection(point1, vector1, point2, vector2)).toEqual(result)
})
