import { Table, Row, Column, Cell } from "./formutils";

export interface DataPair {
  time: number,
  value: number
}

export function parseHML(raw: string): Table {
  function parseDate(str: string): Date {
    const [date, time] = str.split(' ');
    const [day, month, year] = date.split('-');
    const [hour, min, sec] = time.split(':');

    const result = new Date();
    result.setFullYear(parseInt(year), parseInt(month), parseInt(day));
    result.setHours(parseInt(hour), parseInt(min), parseInt(sec));

    return result
  }

  function parseLog(line: string, y: number): Row | null {
    const cols = line.split(',');
    const time = parseDate(cols[1].trim());
    const data: Array<Cell> = [];
    for (let x = 2; x < cols.length; x++) {
      data.push({
        x, y, value: cols[x].trim()
      });
    }

    return {
      time,
      cols: data
    }
  }

  let data: Array<Row> = [], time: Date, cols: Array<Column>;

  const lines = raw.split('\n');
  const rowStart = lines.find(v => v.trim().startsWith('02'));
  if (typeof rowStart === 'undefined') {
    throw new Error("while parsing HML: no column header found");
  }
  // parse header
  const header = parseLog(rowStart, 0);
  if (header?.time) {
    time = header.time;
  } else {
    throw new Error("while parsing HML: no starter time found");
  }
  cols = header.cols.map(v => {
    return {
      title: v.value
    }
  })
  // parse body
  let y = 0;
  lines.forEach((v) => {
    if (!v.trimStart().startsWith('80')) {
      return;
    }
    const parse = parseLog(v, y);
    if (parse === null) {
      throw new Error("while parsing HML in line " + (y + 1));
    }
    data.push(parse);
    y++;
  })
  return { data, time, cols, visualEffect: undefined }
}

/**
 * Convert table to simple 2-d array
 * @param hml The data source to extract from.
 * @returns Extracted, Maxinum, Mininum Data
 */
export function extractData(hml: Table): [Array<Array<DataPair>>, number, number] {
  const starter = hml.data[0].time;
  let max = parseFloat(hml.data[0].cols[0].value);
  let min = max;
  const data = hml.cols.map((_, c) => hml.data.map(v => {
    const value = parseFloat(v.cols[c].value);
    if (value > max) {
      max = value;
    } else if (value < min) {
      min = value;
    }
    const r: DataPair = {
      value,
      time: (v.time.getTime() - starter.getTime()) / 1000
    }
    return r
  }))

  return [data, max, min];
}

