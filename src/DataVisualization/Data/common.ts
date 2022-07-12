import { Table, select, renameHeaders } from "../formutils";
import { parseHML } from "../hmlutil";

const newHeaders = ['CPU利用率（%）', '独显利用率（%）', '帧率', 'CPU温度（℃）', 'GPU温度（℃）'];

export function proceed(raw: string): Table {
  const r = select(parseHML(raw), /((?<!ram) usage)/gi, /framerate/gi, /temp/gi);
  renameHeaders(r, newHeaders);
  return r
}