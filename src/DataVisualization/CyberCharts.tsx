import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { BarChart } from "./BarChart";
import { qualityResult, basicResult, performanceResult } from "./Data/cyberpunk";
import { buildForm, insertRow, ShowAverage, Table } from "./formutils";
import { LineChart } from "./LineChart";

const test1 = basicResult,
  test2 = qualityResult,
  test3 = performanceResult;

const quality1 = buildForm({
  cols: ['画质', '帧率'],
  rows: [['最高画质', '51.43']]
}),
quality2 = insertRow(quality1, 1, ['高画质', '52.86']),
quality3 = insertRow(quality2, 2, ['中画质', '52.54']),
quality4 = insertRow(quality3, 3, ['低画质', '52.49']),
qualityFin = insertRow(quality4, 4, ['1080p最高', '66.92']);

const comparsion = buildForm({
  cols: ['画质', '帧率'],
  rows: [
    ['最高画质', '51.43'],
    ['光线追踪<p style="font-size: 30px; color: grey; margin: auto">DLSS性能</p>', '46.01']
  ]
})

function showAverage(source: Table) {
  return new ShowAverage(
    (v) => `平均${v.toFixed(2)}fps`,
    {
      column: 2,
      from: 0,
      to: source.data.length - 1
    }
  )
}

test1.visualEffect = showAverage(test1);
test2.visualEffect = showAverage(test2);
test3.visualEffect = showAverage(test3);

export const CyberCharts: React.FC<{}> = () => {
  const video = useVideoConfig();
  const width = video.width - 200, height = video.height - 400, max = parseFloat(qualityFin.data[4].cols[1].value);
  const color = "#6A1B9A";

  const container: React.CSSProperties = { justifyContent: 'center', alignItems: 'center' };

  return <>
  <Sequence from={0} durationInFrames={100}>
    <AbsoluteFill style={container}>
      <LineChart width={width} height={height} source={test1}
        translation={false} dark={false} framesAwait={30} primaryColor={color}
        label="基准测试"/>
    </AbsoluteFill>
  </Sequence>
  <Sequence from={100} durationInFrames={70}>
    <AbsoluteFill style={container}>
      <LineChart width={width} height={height} source={test1}
        translation={true} dark={false} primaryColor={color}
        label="基准测试"/>
      </AbsoluteFill>
  </Sequence>
  <Sequence from={170} durationInFrames={70}>
    <AbsoluteFill style={container}>
      <BarChart width={width} height={height} source={quality2}
        translation={true} dark={false} primaryBarColor={color}
        maxData={max}/>
      </AbsoluteFill>
  </Sequence>
  <Sequence from={240} durationInFrames={70}>
    <AbsoluteFill style={container}>
      <BarChart width={width} height={height} source={quality3}
        translation={true} dark={false} primaryBarColor={color}
        maxData={max}/>
      </AbsoluteFill>
  </Sequence>
  <Sequence from={310} durationInFrames={70}>
    <AbsoluteFill style={container}>
      <BarChart width={width} height={height} source={quality4}
        translation={true} dark={false} primaryBarColor={color}
        maxData={max}/>
      </AbsoluteFill>
  </Sequence>
  <Sequence from={380} durationInFrames={70}>
    <AbsoluteFill style={container}>
      <BarChart width={width} height={height} source={qualityFin}
        translation={true} dark={false} primaryBarColor={color}/>
      </AbsoluteFill>
  </Sequence>
  <Sequence from={450} durationInFrames={70}>
    <AbsoluteFill style={container}>
      <LineChart width={width} height={height} source={test2}
        translation={true} dark={false} framesAwait={30} primaryColor={color}
        label="基准测试@DLSS质量"/>
      </AbsoluteFill>
  </Sequence>
  <Sequence from={520} durationInFrames={70}>
    <AbsoluteFill style={container}>
      <LineChart width={width} height={height} source={test3}
        translation={true} dark={false} primaryColor={color}
        label="基准测试@DLSS性能"/>
      </AbsoluteFill>
  </Sequence>
  <Sequence from={590}>
    <AbsoluteFill style={container}>
      <BarChart width={width} height={height} source={comparsion}
        translation={false} dark={false} primaryBarColor={color}/>
      </AbsoluteFill>
  </Sequence>
  </>
}