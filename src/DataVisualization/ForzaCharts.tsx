import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { gamePracticeResult, ingameBenchmarkResult } from "./Data/forza";
import { ShowAverage } from "./formutils";
import { LineChart } from "./LineChart";

const test1 = ingameBenchmarkResult,
  test2 = gamePracticeResult;

test2.visualEffect = new ShowAverage(
  (a) => `平均${a.toFixed(2)}fps`, 
  {
    column: test2.cols[2],
    from: test2.data[0].cols[2],
    to: test2.data[test2.data.length - 1].cols[2]
  }
);

export const ForzaCharts: React.FC<{}> = () => {
  const video = useVideoConfig();
  const width = video.width - 200, height = video.height - 400;
  const color = "#FFEE58";

  const container: React.CSSProperties = { justifyContent: 'center', alignItems: 'center' };

  return <>
  <Sequence from={0} durationInFrames={140}>
    <AbsoluteFill style={container}>
      <LineChart width={width} height={height} source={test1} framesAwait={50}
        transition={false} dark={true} primaryColor={color} label="基准测试" />
    </AbsoluteFill>
  </Sequence>
  <Sequence from={140} durationInFrames={90}>
    <AbsoluteFill style={container}>
      <LineChart width={width} height={height} source={test2}
        transition={false} dark={true} primaryColor={color} label="实际操作" />
    </AbsoluteFill>
  </Sequence>
  <Sequence from={230}>
    <AbsoluteFill style={container}>
      <LineChart width={width} height={height} source={test2}
        transition={true} dark={true} primaryColor={color} label="实际操作" />
    </AbsoluteFill>
  </Sequence>
  </>
}