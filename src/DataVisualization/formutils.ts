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