import React from "react";
import { CHART_STROKE, FONT_FAMILY } from "./constants";
import { InsertColumn, InsertRow, Insert, max, Table } from "./formutils";
import parse from "html-react-parser";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { gradientColor } from "./colorutils";

const barStroke = 64;

export const BarChart: React.FC<{
  width: number;
  height: number;
  source: Table;
  translation: boolean;
  dark: boolean;
  primaryBarColor?: string;
}> = ({width, height, source, translation, dark, primaryBarColor}) => {
  const maxData = parseFloat(max(source, (a, b) => parseFloat(a.value) > parseFloat(b.value)).value);
  const frame = useCurrentFrame();
  const legendProgress = interpolate(
    frame,
    translation ? [20, 70] : [0, 50],
    [0, 1],
    {
      extrapolateRight: 'clamp',
      extrapolateLeft: 'clamp',
      easing: Easing.inOut(Easing.cubic)
    }
  );
  const expandProgress = translation ? interpolate(
    frame,
    [0, 15],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  ) : 1;
  const baseProgress = translation ? 1 : legendProgress;

  const surface: (text: boolean) => React.CSSProperties = (text) => {
    const color = dark ? 'white' : 'black';
    return text ? { color } : { backgroundColor: color }
  }
  const baseline: React.CSSProperties = {
    ...surface(false),
    height: `${baseProgress * 100}%`,
    width: CHART_STROKE
  }
  
  const share = 1 / source.data.length;
  function sync(y: number): number {
    return interpolate(
      baseProgress,
      [y * share, (y + 1) * share],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      }
    )
  }
  function labelSync(y: number): React.CSSProperties {
    return {
      opacity: sync(y)
    }
  }
  const baseLabel: React.CSSProperties = {
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

  function getBars(): Array<React.ReactElement> {
    function isTranslation(x: number, y: number): boolean {
      if (!translation || !source.visualEffect) throw new Error("never");
  
      const op = source.visualEffect;
      return (op instanceof InsertColumn && x === op.index)
        || (op instanceof InsertRow && y === op.index)
    }

    function bar(x: number, y: number): React.CSSProperties {
      if (translation) {
        const isTrans = isTranslation(x, y);
        let value = parseFloat(source.data[y].cols[x].value);
        if (isNaN(value)) value = 0;
        return {
          backgroundImage: gradientColor(x - 1, primaryBarColor),
          width: `${100 * value / maxData * (!isTrans ? 1 : legendProgress)}%`,
          height: !isTrans
            ? barStroke
            : expandProgress * barStroke
        }
      } else {
        return {
          backgroundImage: gradientColor(x - 1, primaryBarColor),
          width: `${100 * parseFloat(source.data[y].cols[x].value) / maxData * sync(y)}%`,
          height: barStroke
        }
      }
    }

    function label(x: number, y: number): React.CSSProperties {
      if (translation) {
        if (isTranslation(x, y)) {
          return {
            opacity: legendProgress,
            height: legendProgress * 54
          }
        } else {
          return {
            opacity: 1
          }
        }
      } else {
        return labelSync(y)
      }
    }

    const bars = [];
    for (let y = 0; y < source.data.length; y++) {
      const barStack = [];
      for (let x = 1; x < source.cols.length; x++) {
        barStack.push(
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <div style={bar(x, y)} />
            <span style={{...label(x, y), ...value}}>{source.data[y].cols[x].value}</span>
          </div>
        )
      }
      bars.push(
        <div>{barStack}</div>
      )
    }
    return bars
  }

  function getLegends(): Array<React.ReactElement> {
    function isTranslation(x: number): boolean {
      if (!translation || !source.visualEffect) throw new Error("never");
      return source.visualEffect instanceof InsertColumn && source.visualEffect.index === x;
    }

    function label(x: number): React.CSSProperties {
      if (translation) {
        if (isTranslation(x)) {
          return {
            opacity: legendProgress
          }
        } else {
          return {
          }
        }
      } else {
        return labelSync(0)
      }
    }

    const legends = [];
    for (let x = 1; x < source.cols.length; x++) {
      legends.push(
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', ...label(x)}}>
          <div style={{width: 60, height: 60, backgroundImage: gradientColor(x - 1, primaryBarColor), margin: 12}}/>
          <span style={baseLabel}>{source.cols[x].title}</span>
        </div>
      )
    }
    return legends;
  }

  function getBaselineLabels(): Array<React.ReactElement> {
    function isTranslation(y: number): boolean {
      if (!translation || !source.visualEffect) throw new Error("never");
      
      return source.visualEffect instanceof InsertRow && y === source.visualEffect.index;
    }

    const labelBase: React.CSSProperties = {
      lineHeight: `${barStroke}px`
    }

    function label(y: number): React.CSSProperties {
      if (translation) {
        if (isTranslation(y)) {
          return {
            height: barStroke * expandProgress,
            opacity: expandProgress
          }
        } else {
          return {
            height: barStroke
          }
        }
      } else {
        return {
          ...labelSync(y),
          height: barStroke
        }
      }
    }

    const labels = [];
    for (let y = 0; y < source.data.length; y++) {
      labels.push(
        <strong style={{...labelBase, ...label(y)}}>{parse(source.data[y].cols[0].value)}</strong>
      )
    }
    return labels;
  }

  return <div style={{width, height, display: 'flex'}}>
    <div style={{...baseLabel, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'end'}}>
      {getBaselineLabels()}
    </div>
    <div style={baseline}/>

    <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>{getBars()}</div>
    <div style={{position: 'absolute', top: 100, right: 100}}>{getLegends()}</div>
  </div>
}