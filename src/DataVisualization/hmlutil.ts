import { Table, Row, Column, Cell } from "./formutils";

export interface DataPair {
  label: string,
  index: number,
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
export function extractData(hml: Table, reference: 'time' | 'header'): [DataPair[][], number, number] {
  const starter = hml.data[0].time, startX = reference === 'time' ? 0 : 1;
  let max = parseFloat(hml.data[startX].cols[0].value);
  let min = max;
  const data: DataPair[][] = [];
  for (let x = startX; x < hml.cols.length; x++) {
    const series = [];
    for (let y = 0; y < hml.data.length; y++) {
      const row = hml.data[y]
      const value = parseFloat(row.cols[x].value);
      let timeIndex = (row.time.getTime() - starter.getTime()) / 1000;
      if (y !== 0 && timeIndex === 0) {
        timeIndex = y;
      }
      const label = reference === 'time'
        ? timeIndex + 's'
        : row.cols[0].value;
      if (value > max) {
        max = value;
      } else if (value < min) {
        min = value;
      }
      series.push({ value, label, index: timeIndex });
    }
    data.push(series);
  }

  return [data, max, min];
}

