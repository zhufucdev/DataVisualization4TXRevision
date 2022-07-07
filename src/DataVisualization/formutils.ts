export interface DataPair {
  time: number,
  value: number
}

export interface Cell {
  x: number,
  y: number,
  value: string
}

export interface Column {
  title: string
}

export interface Row {
  time: Date,
  cols: Array<Cell>
}

export interface Table {
  cols: Array<Column>,
  time: Date,
  data: Array<Row>
}

interface FormBuilder {
  cols: Array<string>,
  rows: Array<Array<string>>
}
export function buildForm(builder: FormBuilder): Table {
  const current = new Date();
  return {
    cols: builder.cols.map(v => {
      return {
        title: v
      }
    }),
    time: current,
    data: builder.rows.map((v, y) => {
      return {
        time: current,
        cols: v.map((d, x) => {
          return {
            x, y, value: d
          }
        })
      }
    })
  }
}

export function max(source: Table, isGreater: (current: Cell, other: Cell) => boolean): Cell {
  let maxData = source.data[1].cols[1];
  for (let x = 1; x < source.cols.length; x++) {
    for (let y = 1; y < source.data.length; y++) {
      const current = source.data[y].cols[x]
      if (isGreater(current, maxData)) {
        maxData = current;
      }
    }
  }
  return maxData
}