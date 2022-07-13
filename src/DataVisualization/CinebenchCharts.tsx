import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { BarChart } from "./BarChart";
import { stressTestResult } from "./Data/cinebench";
import { buildForm, insertRow } from "./formutils";
import { LineChart } from "./LineChart";

const test1 = buildForm({
  cols: ['r23', '得分'],
  rows: [
    ['天选3<p style="font-size: 30px; color: whitesmoke; margin: auto">i7-12700H 极限性能</p>', '18154'],
    ['Ryzen 9 6900HX', '14318'],
    ['M1 Max', '12389']
  ]
});
const test2 = stressTestResult;
const test3 = insertRow(
  test1,
  1,
  ['天选3<p style="font-size: 30px; color: whitesmoke; margin: auto">稳定性能</p>', '17284']
)

export const CinebenchCharts: React.FC<{}> = () => {
  const video = useVideoConfig();
  const width = video.width - 200, height = video.height - 400;
  const color = '#FDD835';

  const container: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  return (
    <>
      <Sequence from={0} durationInFrames={60}>
        <AbsoluteFill style={container}>
          <BarChart width={width} height={height} dark={true}
            translation={false} source={test1} primaryBarColor={color} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={60} durationInFrames={90}>
        <AbsoluteFill style={container}>
          <LineChart width={width} height={height} dark={true}
            translation={false} source={test2} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={150}>
        <AbsoluteFill style={container}>
          <BarChart width={width} height={height} dark={true}
            translation={true} source={test3} primaryBarColor={color} />
        </AbsoluteFill>
      </Sequence>
    </>
  )
}