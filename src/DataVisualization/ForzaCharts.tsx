import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ingameBenchmarkResult } from "./Data/forza";
import { LineChart } from "./LineChart";

export const ForzaCharts: React.FC<{}> = () => {
  const video = useVideoConfig();
  const width = video.width - 200, height = video.height - 400;

  return <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
    <LineChart width={width} height={height} source={ingameBenchmarkResult} 
      transition={false} dark={true} primaryColor="#FFEE58" label="基准测试" />
  </AbsoluteFill>
}