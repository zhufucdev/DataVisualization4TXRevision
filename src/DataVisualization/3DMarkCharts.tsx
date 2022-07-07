import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { BarChart } from "./BarChart";
import { Table, buildForm } from "./formutils";

const testResults: Table = buildForm({
  cols: ['型号', 'Time Spy'],
  rows: [
    ['天选3<p style="font-size: 30px; color: whitesmoke; margin: auto">RTX 3060 (140W)</p>', '8990'],
    ['RTX 3070 (105W)', '10200'],
    ['RTX 3090', '18159']
  ]
})

export const TDMarkCharts: React.FC<{}> = () => {
  const video = useVideoConfig();

  return <AbsoluteFill style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <BarChart height={video.height - 400} width={video.width - 200} source={testResults} dark={true} primaryBarColor="#FFCC80"/>
  </AbsoluteFill>
}