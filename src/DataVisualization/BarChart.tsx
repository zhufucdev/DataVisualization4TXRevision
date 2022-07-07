import React from "react";
import { CHART_STROKE, FONT_FAMILY } from "./constants";
import { Row, Table } from "./formutils";
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
  dark: boolean;
  primaryBarColor?: string;
}> = ({width, height, source, dark, primaryBarColor}) => {
  const barColor = (index: number): string => 
    primaryBarColor ? (index == 0 ? primaryBarColor : barColors[index - 1]) : barColors[index];

  const maxData: Array<number> = [];
  for (let x = 1; x < source.cols.length; x++) {
    let max = parseFloat(source.data[1].cols[x].value);
    for (let y = 2; y < source.data.length; y++) {
      const current = parseFloat(source.data[y].cols[x].value)
      if (current > max) {
        max = current;
      }
    }
    maxData.push(max);
  }

  const frame = useCurrentFrame();
  const legendProgress = interpolate(
    frame,
    [0, 50],
    [0, 1],
    {
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic)
    }
  )

  const surface: (text: boolean) => React.CSSProperties = (text) => {
    const color = dark ? 'white' : 'black';
    return text ? { color } : { backgroundColor: color }
  }
  const baseline: React.CSSProperties = {
    ...surface(false),
    height: `${legendProgress * 100}%`,
    width: CHART_STROKE
  }
  
  const share = 1 / source.data.length;
  const sync: (i: number) => number = (i) => interpolate(
    legendProgress,
    [i * share, (i + 1) * share],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  )
  const opacitySync: (i: number) => React.CSSProperties = (i) => {
    return {
      opacity: sync(i)
    }
  }
  const label: React.CSSProperties = {
    ...surface(true),
    fontSize: 48,
    marginRight: 12,
    fontFamily: FONT_FAMILY,
  }
  const bar: (v: Row, i: number) => React.CSSProperties = (v, i) => {
    const baseColor = barColor(0);
    const darkened = Color(baseColor).darken(0.2).hex();
    return {
      backgroundImage: `linear-gradient(to right, ${darkened}, ${baseColor})`,
      width: parseFloat(v.cols[1].value) / maxData[0] * maxLength * sync(i),
      height: barStroke
    }
  }
  const value: React.CSSProperties = {
    ...surface(true),
    fontSize: 32,
    marginLeft: 12,
    fontFamily: FONT_FAMILY
  }

  return <div style={{width, height, display: 'flex'}}>
    <div style={{...label, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'end'}}>
      {
        source.data.map(
          (v, i) => <strong style={{...opacitySync(i), lineHeight: `${barStroke}px`, height: barStroke}}>{parse(v.cols[0].value)}</strong>
        )
      }
    </div>
    <div style={baseline}/>
    <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>
      {
        source.data.map(
          (v, i) => <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <div style={bar(v, i)}/>
            <span style={{...opacitySync(i), ...value}}>{v.cols[1].value}</span>
          </div>
        )
      }
    </div>
  </div>
}