import React, { ReactElement, useState } from "react";
import { DataPair, extractData } from "./hmlutil";
import { Table, ShowAverage } from "./formutils";
import { FONT_FAMILY, CHART_STROKE } from "./constants";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { baseColor } from "./colorutils";

const yAxisWidth = 80, xAxisOffset = yAxisWidth + CHART_STROKE + 2,
  lineStroke = CHART_STROKE * 0.3, auxiliaryLineStroke = CHART_STROKE * 0.5;
const hWRate = 0.3854140920931187;

export const LineChart: React.FC<{
  source: Table;
  width: number;
  height: number;
  framesAwait?: number;
  transition: boolean;
  dark: boolean;
  primaryColor?: string;
  label?: string;
}> = ({ source, width, height, framesAwait, transition, dark, primaryColor, label }) => {
  const [data, maxData, minData] = extractData(source);

  const frame = useCurrentFrame();
  framesAwait = framesAwait || 0;
  const drawingProgress = interpolate(
    frame,
    [framesAwait, framesAwait + (transition ? 50 : 90)],
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

  function friendlyNum(origin: number): string {
    return origin.toFixed(0);
  }

  const xLength = data[0][data[0].length - 1].time, yLength = maxData - minData;
  function getYLabels(): Array<ReactElement> {
    const labels = [], delta = yLength / 4;
    for (let i = 4; i >= 0; i--) {
      labels.push(<strong>{friendlyNum(i * delta + minData)}</strong>);
    }
    return labels;
  }

  function getXLabels(): Array<ReactElement> {
    const labels = [], delta = xLength / 8;
    for (let i = 0; i <= 8; i++) {
      labels.push(<strong>{friendlyNum(delta * i)}s</strong>)
    }
    return labels
  }

  function getLines(): Array<ReactElement> {
    function line(dots: [DataPair, DataPair]): React.CSSProperties {
      const deltaX = (dots[1].time - dots[0].time) / xLength, deltaY = (dots[1].value - dots[0].value) / yLength;
      const slope = deltaY * hWRate / deltaX;
      const a = Math.atan(slope);
      let length = Math.sqrt(deltaX ** 2 + (deltaY * hWRate) ** 2);
      if (length < 0.002) {
        length = 0.002;
      }
      const progressiveLength = transition ? length : interpolate(
        drawingProgress,
        [dots[0].time / xLength, dots[1].time / xLength],
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
        left: `${100 * dots[0].time / xLength}%`,
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
    if (!transition) return null;
    if (!source.visualEffect) throw new Error("never");
    if (!(source.visualEffect instanceof ShowAverage)) return null;

    const section = source.visualEffect.section;
    const set = data[source.cols.indexOf(section.column)];
    let sum = 0;
    for (let y = section.from.y; y <= section.to.y; y++) {
      sum += set[y].value;
    }
    const value = sum / (section.to.y - section.from.y);
    const first = set[section.from.y], last = set[section.to.y];

    const color = dark ? 'white' : 'black';

    const commonStyle: React.CSSProperties = {
      position: 'absolute',
      bottom: `${100 * (value - minData) / yLength}%`,
      filter: 'drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.24))'
    }
    const line: React.CSSProperties = {
      ...commonStyle,
      left: `${100 * first.time / xLength}%`,
      background: `linear-gradient(
        to left,
        transparent 0%,
        transparent 50%,
        ${color} 50%,
        ${color} 100%
      )`,
      backgroundSize: `20px ${auxiliaryLineStroke}px`,
      backgroundRepeat: 'repeat-x',
      width: `${100 * (last.time - first.time) / xLength * drawingProgress}%`,
      height: auxiliaryLineStroke
    }
    function label(): React.CSSProperties {
      framesAwait = framesAwait || 0;
      const prototype: React.CSSProperties = {
        ...surface(true),
        ...legendLabel,
        ...commonStyle,
        height: 28,
        marginLeft: '12px',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }
      return first.time / xLength <= 0.001 ?
        {
          ...prototype,
          right: '100%',
          opacity: interpolate(
            frame,
            [framesAwait, framesAwait + 15],
            [0, 1]
          )
        } : {
          ...prototype,
          left: `${100 * last.time / xLength}%`,
          opacity: interpolate(
            frame,
            [framesAwait + 40, framesAwait + 55],
            [0, 1]
          )
        }
    }

    const labelStr =
      typeof source.visualEffect.label === 'function'
        ? source.visualEffect.label(value)
        : source.visualEffect.label.replace(/%s/g, value.toString());
    return <>
      <div style={line} />
      <span style={label()}>{labelStr}</span>
    </>
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
        source.cols.map((c, i) =>
          <div style={legendContainer}>
            <div style={legendSample(i)} />
            <span style={legendLabel}>{c.title}</span>
          </div>
        )
      }
    </div>
  </>
}