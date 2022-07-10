import React, { ReactElement, useState } from "react";
import { DataPair, extractData } from "./hmlutil";
import { max, Table } from "./formutils";
import { FONT_FAMILY, CHART_STROKE } from "./constants";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { baseColor } from "./colorutils";

const yAxisWidth = 80, xAxisOffset = yAxisWidth + CHART_STROKE + 2, lineStroke = CHART_STROKE * 0.4;
const framesAwait = 50;
const hWRate = 0.3854140920931187;

export const LineChart: React.FC<{
  source: Table;
  width: number;
  height: number;
  transition: boolean;
  dark: boolean;
  primaryColor?: string;
  label?: string;
}> = ({ source, width, height, dark, primaryColor, label }) => {
  const [data, maxData, minData] = extractData(source);

  const frame = useCurrentFrame();
  const drawingProgress = interpolate(
    frame,
    [framesAwait, framesAwait + 90],
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
    flexDirection: 'row',
    opacity: drawingProgress
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

  const xLength = data[0][data[0].length - 1].time, yLength = maxData - minData;
  function getYLabels(): Array<ReactElement> {
    const labels = [], delta = yLength / 4;
    for (let h = maxData; h >= minData; h -= delta) {
      labels.push(<strong>{h}</strong>);
    }
    return labels;
  }

  function getXLabels(): Array<ReactElement> {
    const labels = [], delta = xLength / 8;
    for (let w = 0; w <= delta * 8; w += delta) {
      labels.push(<strong>{w.toFixed(0)}s</strong>)
    }
    return labels
  }

  function getLines(): Array<ReactElement> {
    function line(dots: [DataPair, DataPair]): React.CSSProperties {
      const deltaX = (dots[1].time - dots[0].time) / xLength, deltaY = (dots[1].value - dots[0].value) / yLength;
      const slope = deltaY * hWRate / deltaX;
      const a = Math.atan(slope);
      const length = Math.sqrt(deltaX ** 2 + (deltaY * hWRate) ** 2);
      const progressiveLength = interpolate(
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
        bottom: `${100 * dots[0].value / yLength}%`,
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

  return <>
    <div style={mainContainer}>
      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>
        <div style={labelContainer(true)}>{getYLabels()}</div>
        <div style={baseline(true)} />
        <div style={area}>{getLines()}</div>
      </div>
      <div style={baseline(false)} />
      <div style={labelContainer(false)}>{getXLabels()}</div>
      <span style={bottomLabel}>{label}</span>
    </div>
    <div style={legendsContainer}>
      {
        source.cols.map((c, i) => 
          <div style={legendContainer}>
            <div style={legendSample(i)}/>
            <span style={legendLabel}>{c.title}</span>
          </div>
        )
      }
    </div>
  </>
}