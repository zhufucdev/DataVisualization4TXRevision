import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { BarChart } from "./BarChart";
import { Table, buildForm, insertColumn, insertRow } from "./formutils";

const test1: Table = buildForm({
  cols: ['型号', 'Time Spy'],
  rows: [
    ['天选3<p style="font-size: 30px; color: whitesmoke; margin: auto">RTX 3060 (140W)</p>', '8990'],
    ['RTX 3070 (140W)', '10200'],
    ['RTX 3090', '18159']
  ]
})
const test2 = insertColumn(test1, 2, ['Port Royal', '4926', '6268', '12649']);
const test3 = insertRow(test2, 0, ['RTX 3060 (105W)', '8250', '4693'])

export const TDMarkCharts: React.FC<{}> = () => {
  const video = useVideoConfig();
  const height = video.height - 400, width = video.width - 200;
  const color = "#FFCC80";

  const container: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  return <>
    <Sequence from={0} durationInFrames={100}>
      <AbsoluteFill style={container}>
        <BarChart height={height} width={width} source={test1} dark={true} translation={false} primaryBarColor={color}/>
      </AbsoluteFill>
    </Sequence>
    <Sequence from={100} durationInFrames={100}>
      <AbsoluteFill style={container}>
        <BarChart height={height} width={width} source={test2} translation={true} dark={true} primaryBarColor={color} />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={200}>
      <AbsoluteFill style={container}>
        <BarChart height={height} width={width} source={test3} translation={true} dark={true} primaryBarColor={color} />
      </AbsoluteFill>
    </Sequence>
  </>
}