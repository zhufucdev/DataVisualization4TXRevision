import React, { ReactElement, useState } from "react";
import { DataPair, extractData } from "./hmlutil";
import { Table, ShowAverage, Partial, ShowMaximun } from "./formutils";
import { FONT_FAMILY, CHART_STROKE } from "./constants";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { baseColor } from "./colorutils";
import htmlParser from "html-react-parser";

const yAxisWidth = 80, xAxisOffset = yAxisWidth + CHART_STROKE + 2,
  lineStroke = CHART_STROKE * 0.3, auxiliaryLineStroke = CHART_STROKE * 0.5;
const hWRate = 0.3854140920931187;

export const XAxisLabel: React.FC<{
  children: ReactElement | string
}> = ({ children }) => {
  const style: React.CSSProperties = {
    fontSize: 32
  }
  return <strong style={style}>{children}</strong>
}

export const LineChart: React.FC<{
  source: Table;
  width: number;
  height: number;
  framesAwait?: number;
  translation: boolean;
  dark: boolean;
  primaryColor?: string;
  label?: string | ReactElement;
  reference?: 'time' | 'header'
}> = ({ source, reference, width, height, framesAwait, translation, dark, primaryColor, label }) => {
  const [data, maxData, minData] = extractData(source, reference || 'time');

  const frame = useCurrentFrame();
  framesAwait = framesAwait || 0;
  const drawingProgress = interpolate(
    frame,
    [framesAwait, framesAwait + (translation ? 50 : 90)],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.exp)
    }
  )

  const surface: (text: boolean) => React.CSSProperties = (text) => {
    const color = dark ? 'white' : 'black';
    return text ? { color } : { backgroundColor: color }
  }
  const mainContainer: React.CSSProperties = {
    width, height,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  }

  const baseLabel: React.CSSProperties = {
    ...surface(true),
    fontFamily: FONT_FAMILY,
    fontSize: '32px',
  }
  const labelContainer: (vertical: boolean) => React.CSSProperties = (vertical) => {
    const shared = {
      ...baseLabel,
      display: 'flex',
      justifyContent: 'space-between',
      marginRight: 12
    }
    return vertical ? {
      ...shared,
      flexDirection: vertical ? 'column' : 'row',
      alignItems: 'flex-end',
      width: yAxisWidth
    } : {
      ...shared,
      marginLeft: xAxisOffset
    }
  }
  const legendsContainer: React.CSSProperties = {
    position: 'absolute',
    top: 100, right: 100,
    display: 'flex',
    flexDirection: 'row'
  }
  const legendLabel: React.CSSProperties = {
    ...surface(true),
    fontFamily: FONT_FAMILY,
    fontSize: 32
  }
  const legendSample: (index: number) => React.CSSProperties = (i) => {
    return {
      borderRadius: '50%',
      backgroundColor: baseColor(i, primaryColor),
      width: 42, height: 42,
      marginRight: 12
    }
  }
  const legendContainer: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12
  }
  const baseline: (vertical: boolean) => React.CSSProperties = (vertical) => {
    return vertical ? {
      ...surface(false),
      width: CHART_STROKE
    } : {
      ...surface(false),
      height: CHART_STROKE,
      marginLeft: xAxisOffset
    }
  }
  const area: React.CSSProperties = {
    flexGrow: 1,
    position: 'relative'
  }
  const bottomLabel: React.CSSProperties = {
    ...surface(true),
    fontSize: '48px',
    textAlign: 'right',
    position: 'absolute',
    width: '100%',
    bottom: -70
  }
  const shadow: React.CSSProperties = {
    filter: `drop-shadow(3px 3px 2px rgba(${dark ? '0, 0, 0, 0.24' : '255, 255, 255, 0.8'}))`
  }

  function friendlyNum(origin: number): string {
    return origin.toFixed(0);
  }

  const xLength = data[0][data[0].length - 1].index, yLength = maxData - minData;
  function getYLabels(): Array<ReactElement> {
    const labels = [], delta = yLength / 4;
    for (let i = 4; i >= 0; i--) {
      labels.push(<strong>{friendlyNum(i * delta + minData)}</strong>);
    }
    return labels;
  }

  function getXLabels(): Array<ReactElement> {
    if (reference === 'time') {
      const labels = [], delta = xLength / 8;
      for (let i = 0; i <= 8; i++) {
        labels.push(<strong>{friendlyNum(delta * i)}s</strong>)
      }
      return labels
    } else {
      return data[0].map(v => <strong>{v.label}</strong>);
    }
  }

  function getLines(): Array<ReactElement> {
    function line(dots: [DataPair, DataPair]): React.CSSProperties {
      const deltaX = (dots[1].index - dots[0].index) / xLength, deltaY = (dots[1].value - dots[0].value) / yLength;
      const slope = deltaY * hWRate / deltaX;
      const a = Math.atan(slope);
      let length = Math.sqrt(deltaX ** 2 + (deltaY * hWRate) ** 2);
      if (length < 0.002) {
        length = 0.002;
      }
      const progressiveLength = translation ? length : interpolate(
        drawingProgress,
        [dots[0].index / xLength, dots[1].index / xLength],
        [0, length],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        }
      )
      return {
        position: 'absolute',
        height: lineStroke,
        width: `${100 * progressiveLength}%`,
        left: `${100 * dots[0].index / xLength}%`,
        bottom: `${100 * (dots[0].value - minData) / yLength}%`,
        transform: `rotate(${-a}rad)`,
        transformOrigin: 'left center'
      }
    }

    const l = [];
    for (let i = 0; i < data.length; i++) {
      const set = data[i];
      for (let j = 0; j < set.length - 1; j++) {
        l.push(<div style={{ ...line([set[j], set[j + 1]]), backgroundColor: baseColor(i, primaryColor) }} />)
      }
    }
    return l;
  }

  function getAuxiliaryLines(): ReactElement | null {
    if (!translation) return null;
    if (!source.visualEffect) throw new Error("never");

    const section = (source.visualEffect as Partial).section;
    const set = data[section.column];

    function labelStr(effect: Partial, value: number) {
      return typeof effect.label === 'function'
        ? effect.label(value)
        : effect.label.replace(/%s/g, value.toString());
    }

    function dottedLine(vertical: boolean): React.CSSProperties {
      const color = dark ? 'white' : 'black';
      return vertical ? {
        background: `linear-gradient(
          to left,
          transparent 0%,
          transparent 50%,
          ${color} 50%,
          ${color} 100%
        )`,
        backgroundSize: `20px ${auxiliaryLineStroke}px`,
        backgroundRepeat: 'repeat-x',
      } : {
        background: `linear-gradient(
          to bottom,
          transparent 0%,
          transparent 50%,
          ${color} 50%,
          ${color} 100%
        )`,
        backgroundSize: `${auxiliaryLineStroke}px 20px`,
        backgroundRepeat: 'repeat-y',
      }
    }

    function getAverageLine(effect: ShowAverage): ReactElement {
      let sum = 0;
      for (let y = section.from; y <= section.to; y++) {
        sum += set[y].value;
      }
      const value = sum / (section.to - section.from);
      const first = set[section.from], last = set[section.to];

      const commonStyle: React.CSSProperties = {
        ...shadow,
        position: 'absolute',
        bottom: `${100 * (value - minData) / yLength}%`
      }
      const line: React.CSSProperties = {
        ...commonStyle,
        ...dottedLine(true),
        left: `${100 * first.index / xLength}%`,
        width: `${100 * (last.index - first.index) / xLength * drawingProgress}%`,
        height: auxiliaryLineStroke
      }
      function label(): React.CSSProperties {
        framesAwait = framesAwait || 0;
        const prototype: React.CSSProperties = {
          ...surface(true),
          ...legendLabel,
          ...commonStyle,
          marginLeft: '12px',
          whiteSpace: 'nowrap'
        }
        return first.index / xLength <= 0.01 ?
          {
            ...prototype,
            right: '100%',
            opacity: interpolate(
              frame,
              [framesAwait, framesAwait + 15],
              [0, 1]
            ),
            marginBottom: -12
          } : {
            ...prototype,
            left: `${100 * first.index / xLength}%`,
            marginBottom: 12,
            opacity: interpolate(
              frame,
              [framesAwait + 10, framesAwait + 25],
              [0, 1]
            ),
            background: 'rgba(0, 0, 0, 0.2)'
          }
      }

      return <>
        <div style={line} />
        <span style={label()}>{labelStr(effect, value)}</span>
      </>
    }

    function getMaxLine(effect: ShowMaximun): ReactElement {
      const section = effect.section;
      const set = data[section.column];

      let max = set[section.from];
      for (let y = section.from + 1; y <= section.to; y++) {
        const current = set[y];
        if (current.value > max.value) max = current;
      }

      framesAwait = framesAwait || 0;
      const commonStyle: React.CSSProperties = {
        ...shadow,
        position: 'absolute'
      }
      const hor: React.CSSProperties = {
        ...dottedLine(false),
        ...commonStyle,
        bottom: 0,
        left: `${100 * max.index / xLength}%`,
        width: auxiliaryLineStroke,
        height: `${100 * (max.value - minData) / yLength * drawingProgress}%`
      }
      const ver: React.CSSProperties = {
        ...dottedLine(true),
        ...commonStyle,
        bottom: `${100 * (max.value - minData) / yLength}%`,
        left: 0,
        width: `${100 * max.index / xLength * drawingProgress}%`,
        height: auxiliaryLineStroke
      }
      const label: React.CSSProperties = {
        ...surface(true),
        ...legendLabel,
        ...commonStyle,
        marginLeft: '12px',
        whiteSpace: 'nowrap',
        bottom: `${100 * (max.value - minData) / yLength}%`,
        right: '100%',
        marginBottom: -12,
        opacity: interpolate(
          frame,
          [framesAwait, framesAwait + 15],
          [0, 1]
        )
      }

      return <>
        <div style={hor} />
        <div style={ver} />
        <span style={label}>{labelStr(effect, max.value)}</span>
      </>
    }

    if (source.visualEffect instanceof ShowAverage) {
      return getAverageLine(source.visualEffect);
    } else if (source.visualEffect instanceof ShowMaximun) {
      return getMaxLine(source.visualEffect);
    } else {
      return null;
    }
  }

  return <>
    <div style={mainContainer}>
      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>
        <div style={labelContainer(true)}>{getYLabels()}</div>
        <div style={baseline(true)} />
        <div style={area}>
          {getLines()}
          {getAuxiliaryLines()}
        </div>
      </div>
      <div style={baseline(false)} />
      <div style={labelContainer(false)}>{getXLabels()}</div>
      <span style={bottomLabel}>{label}</span>
    </div>
    <div style={legendsContainer}>
      {
        source.cols.slice(reference === 'time' ? 0 : 1).map((c, i) =>
          <div style={legendContainer}>
            <div style={legendSample(i)} />
            <span style={legendLabel}>{c.title}</span>
          </div>
        )
      }
    </div>
  </>
}

LineChart.defaultProps = {
  reference: 'time',
  framesAwait: 0
}