import { Table, select, renameHeaders } from "../formutils";
import { parseHML } from "../hmlutil";

const newHeaders = ['CPU温度（℃）', 'CPU功耗（W）', 'FPS'];

export function proceed(raw: string): Table {
  const r = select(parseHML(raw), /(framerate)|(temp)|(power)/gi);
  renameHeaders(r, newHeaders);
  return r
}