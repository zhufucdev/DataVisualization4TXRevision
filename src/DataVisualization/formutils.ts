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

interface VisualEffect {
  readonly name: string
}

export interface Table {
  cols: Array<Column>,
  time: Date,
  data: Array<Row>,
  visualEffect: VisualEffect | undefined
}

export abstract class Insert implements VisualEffect {
  abstract readonly name: string;
  readonly index: number;
  constructor(index: number) {
    this.index = index
  }
}

export abstract class Partial implements VisualEffect {
  abstract readonly name: string;
  readonly section: Section;
  readonly label: string | ((avg: number) => string)
  constructor(label: string | ((avg: number) => string), section: Section) {
    this.label = label;
    this.section = section;
  }
}

export class InsertColumn extends Insert {
  override readonly name = 'insert_column';
  constructor(index: number) {
    super(index);
  }
}

export class InsertRow extends Insert {
  override readonly name = 'insert_row';
  constructor(index: number) {
    super(index);
  }
}

export class ShowAverage extends Partial {
  override readonly name = 'show_average';
  constructor(label: string | ((avg: number) => string), section: Section) {
    super(label, section);
  }
}

export class ShowMaximun extends Partial {
  override readonly name = 'show_max';
  constructor(label: string | ((avg: number) => string), section: Section) {
    super(label, section);
  }
}

export interface Section {
  column: number,
  from: number,
  to: number
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
    }),
    visualEffect: undefined
  }
}

export function max(source: Table, isGreater: (current: Cell, other: Cell) => boolean): Cell {
  let maxData = source.data[0].cols[1];
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

export function deepCopy(source: Table): Table {
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
    visualEffect: source.visualEffect
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
    for (let x = i + 1; x < source.cols.length + 1; x++) {
      r.data[i].cols[x].x = x;
    }
  }
  r.visualEffect = new InsertColumn(index);
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
      for (let y = index; y < source.data.length; y++) {
        r.data[y].cols.forEach(c => c.y = y + 1);
      }
      return {
        x: i,
        y: index,
        value: c
      }
    })
  });
  r.visualEffect = new InsertRow(index);
  return r
}

export function select(source: Table, ...col: RegExp[]): Table {
  const colSlice = [], dataSlice = new Array<Row>();
  for (let x = 0; x < source.cols.length; x++) {
    const title = source.cols[x].title;
    
    for (let i = 0; i < col.length; i++) {
      if (title.match(col[i])) {
        colSlice.push({
          index: i,
          origin: x,
          col: source.cols[x]
        });
      }
    }
  }

  colSlice.sort((a, b) => a.index - b.index);

  for (let y = 0; y < source.data.length; y++) {
    const row = source.data[y];
    const slice = new Array<Cell>();
    colSlice.forEach((c, i) => slice[i] = row.cols[c.origin]);
    dataSlice.push({
      time: row.time,
      cols: slice
    });
  }
  return {
    cols: colSlice.map(c => c.col),
    time: source.time,
    data: dataSlice,
    visualEffect: source.visualEffect
  }
}

export function renameHeaders(source: Table, headers: Array<string>) {
  headers.forEach((h, i) => source.cols[i].title = h)
}
