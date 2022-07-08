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
  data: Array<Row>,
  lastOperation: [symbol, number] | undefined
}

export const INSERT_COLUMN = Symbol('insert_col');
export const INSERT_ROW = Symbol('insert_row');

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
    }),
    lastOperation: undefined
  }
}

export function max(source: Table, isGreater: (current: Cell, other: Cell) => boolean): Cell {
  let maxData = source.data[1].cols[1];
  for (let x = 1; x < source.cols.length; x++) {
    for (let y = 1; y < source.data.length; y++) {
      const current = source.data[y].cols[x];
      if (isGreater(current, maxData)) {
        maxData = current;
      }
    }
  }
  return maxData
}

function deepCopy(source: Table): Table {
  const cols = source.cols.map(v => { return { title: v.title } });
  const data = source.data.map(d => {
    return {
      time: d.time,
      cols: d.cols.map(v => {
        return {
          x: v.x, y: v.y, value: v.value
        }
      })
    }
  });
  return {
    time: source.time,
    cols, data,
    lastOperation: source.lastOperation
  }
}

export function insertColumn(source: Table, index: number, cells: Array<string>): Table {
  if (cells.length !== source.data.length + 1) {
    throw new Error("unexpected rows count.")
  }

  const current = new Date();
  const r = deepCopy(source);
  r.cols.push({ title: cells[0] })
  for (let i = 0; i < source.data.length; i++) {
    r.data[i].time = current;
    r.data[i].cols.splice(index, 0, { x: source.cols.length, y: i, value: cells[i + 1] });
  }
  r.lastOperation = [INSERT_COLUMN, index];
  return r
}

export function insertRow(source: Table, index: number, cells: Array<string>): Table {
  if (cells.length !== source.cols.length) {
    throw new Error("unexpected columns count.")
  }

  const current = new Date();
  const r = deepCopy(source);
  r.data.splice(index, 0, { 
    time: current,
    cols: cells.map((c, i) => {
      return {
        x: i,
        y: source.data.length,
        value: c
      }
    })
  });
  r.lastOperation = [INSERT_ROW, index];
  return r
}