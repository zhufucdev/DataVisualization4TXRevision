import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { balancedResult, basicResult, performanceResult } from "./Data/cyberpunk";
import { ShowAverage } from "./formutils";
import { LineChart } from "./LineChart";

const test1 = basicResult,
  test2 = balancedResult,
  test3 = performanceResult;

test1.visualEffect = new ShowAverage(
  (v) => `平均${v.toFixed(2)}fps`,
  {
    column: test1.cols[2],
    from: test1.data[0].cols[2],
    to: test1.data[test1.data.length - 1].cols[2]
  }
)

export const CyberCharts: React.FC<{}> = () => {
  const video = useVideoConfig();
  const width = video.width - 200, height = video.height - 400;
  const color = "#6A1B9A";

  const container: React.CSSProperties = { justifyContent: 'center', alignItems: 'center' };

  return <>
  <Sequence from={0}>
    <AbsoluteFill style={container}>
      <LineChart width={width} height={height} source={test1}
        transition={false} dark={false} framesAwait={30} primaryColor={color}
        label="基准测试"/>
    </AbsoluteFill>
  </Sequence>
  <Sequence from={100}>
    <AbsoluteFill style={container}>
      <LineChart width={width} height={height} source={test1}
        transition={true} dark={false} framesAwait={30} primaryColor={color}
        label="基准测试"/>
      </AbsoluteFill>
  </Sequence>
  </>
}