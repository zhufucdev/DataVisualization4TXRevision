import React from "react";
import { CHART_STROKE, FONT_FAMILY } from "./constants";
import { Column, max, Row, Table } from "./formutils";
import parse from "html-react-parser";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import Color from "color";

const maxLength = 1200,
  barColors = ['#00B0FF', '#FF3D00', '#FFD600', '#F50057', '#D500F9'],
  barStroke = 64;

export const BarChart: React.FC<{
  width: number;
  height: number;
  source: Table;
  progressive: boolean;
  dark: boolean;
  primaryBarColor?: string;
}> = ({width, height, source, progressive, dark, primaryBarColor}) => {
  const barColor = (index: number): string => {
      const baseColor = primaryBarColor
      ? (index == 0 ? primaryBarColor
        : Color(barColors[index - 1]).saturationl(Color(primaryBarColor).saturationl()).hex())
        : barColors[index];
      const darkened = Color(baseColor).darken(0.2).hex();
      return `linear-gradient(to right, ${darkened}, ${baseColor})`
    }

  const maxData = parseFloat(max(source, (a, b) => parseFloat(a.value) > parseFloat(b.value)).value);
  const frame = useCurrentFrame();
  const legendProgresses: Array<number> = [];
  if (!progressive) {
    legendProgresses.push(
      interpolate(
        frame,
        [0, 50],
        [0, 1],
        {
          extrapolateRight: 'clamp',
          extrapolateLeft: 'clamp',
          easing: Easing.inOut(Easing.cubic)
        }
      )
    )
  } else {
    for (let x = 1; x < source.cols.length; x++) {
      legendProgresses.push(
        interpolate(
          frame,
          [(x - 1) * 100, x * 100 - 50],
          [0, 1],
          {
            extrapolateRight: 'clamp',
            easing: Easing.inOut(Easing.cubic)
          }
        )
      )
    }
  }

  const surface: (text: boolean) => React.CSSProperties = (text) => {
    const color = dark ? 'white' : 'black';
    return text ? { color } : { backgroundColor: color }
  }
  const baseline: React.CSSProperties = {
    ...surface(false),
    height: `${legendProgresses[0] * 100}%`,
    width: CHART_STROKE
  }
  
  const share = 1 / source.data.length;
  function sync(y: number, x: number): number {
    if (!progressive) {
      x = 1
    }
    return interpolate(
      legendProgresses[x - 1],
      [y * share, (y + 1) * share],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      }
    )
  }
  function labelSync(y: number, x: number): React.CSSProperties {
    const a = sync(y, x);
    const h: React.CSSProperties = 
    !progressive || x === 1 
      ? {}
      : {
        height: 54 * a
      }
    return {
      ...h,
      opacity: a
    }
  }
  const label: React.CSSProperties = {
    ...surface(true),
    fontSize: 48,
    marginRight: 12,
    fontFamily: FONT_FAMILY,
  }
  const value: React.CSSProperties = {
    ...surface(true),
    fontSize: 32,
    marginLeft: 12,
    fontFamily: FONT_FAMILY
  }

  let bars: Array<React.ReactElement> = [];
  function getBars(row: Row, y: number): Array<React.ReactElement> {
    function bar(v: Row, y: number, x: number): React.CSSProperties {
      const shouldSync = !progressive || x === 1;
      return {
        backgroundImage: barColor(x - 1),
        width: parseFloat(v.cols[x].value) / maxData * maxLength * (shouldSync ? sync(y, x) : legendProgresses[x - 1]),
        height: shouldSync
          ? barStroke
          : interpolate(
            frame,
            [(x - 2) * 100 + 80, (x - 1) * 100],
            [0, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp'
            }
          ) * barStroke
      }
    }

    const bars = [];
    for (let x = 1; x < row.cols.length; x++) {
      bars.push(
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <div style={bar(row, y, x)} />
          <span style={{...labelSync(y, x), ...value}}>{row.cols[x].value}</span>
        </div>
      )
    }
    return bars
  }
  bars = source.data.map(
    (v, y) => <div> {getBars(v, y)} </div>
  )

  const legends = [];
  for (let x = 1; x < source.cols.length; x++) {
    legends.push(
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', opacity: legendProgresses[x - 1]}}>
        <div style={{width: 60, height: 60, backgroundImage: barColor(x - 1), margin: 12}}/>
        <span style={label}>{source.cols[x].title}</span>
      </div>
    )
  }

  return <div style={{width, height, display: 'flex'}}>
    <div style={{...label, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'end'}}>
      {
        source.data.map(
          (v, i) => <strong style={{...labelSync(i, 1), lineHeight: `${barStroke}px`, height: barStroke}}>{parse(v.cols[0].value)}</strong>
        )
      }
    </div>
    <div style={baseline}/>
    <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>
      {bars}
    </div>
    <div style={{ position: 'absolute', top: 100, right: 100}}>{legends}</div>
  </div>
}