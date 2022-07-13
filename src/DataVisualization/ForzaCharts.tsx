import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { gamePracticeResult, ingameBenchmarkResult } from "./Data/forza";
import { ShowAverage, ShowMaximun, Table } from "./formutils";
import { LineChart } from "./LineChart";

const test1 = ingameBenchmarkResult,
  test2 = gamePracticeResult,
  test3 = { ...gamePracticeResult },
  test4 = { ...gamePracticeResult },
  test5 = { ...gamePracticeResult };

function showAverageFPS(dataset: Table) {
  return new ShowAverage(
    (a) => `平均${a.toFixed(2)}fps`,
    {
      column: 2,
      from: 2,
      to: dataset.data.length - 1
    }
  );
}

function showAverageTemp(dataset: Table, colIndex: number): ShowAverage {
  return new ShowAverage(
    (a) => `平均${a.toFixed(0)}℃`,
    {
      column: colIndex,
      from: 0,
      to: test3.data.length - 1
    }
  )
}

test1.visualEffect = showAverageFPS(test1);
test2.visualEffect = new ShowMaximun(
  (a) => `最高${a.toFixed(0)}%`,
  {
    column: 1,
    from: 0,
    to: test2.data.length - 1
  }
)
test3.visualEffect = showAverageFPS(test3);
test4.visualEffect = showAverageTemp(test4, 4);
test5.visualEffect = showAverageTemp(test5, 3);


export const ForzaCharts: React.FC<{}> = () => {
  const video = useVideoConfig();
  const width = video.width - 200, height = video.height - 400;
  const color = "#FF9100";

  const container: React.CSSProperties = { justifyContent: 'center', alignItems: 'center' };

  return <>
    <Sequence from={0} durationInFrames={140}>
      <AbsoluteFill style={container}>
        <LineChart width={width} height={height} source={test1} framesAwait={50}
          translation={false} dark={true} primaryColor={color} label="基准测试" />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={140} durationInFrames={90}>
      <AbsoluteFill style={container}>
        <LineChart width={width} height={height} source={test1}
          translation={true} dark={true} primaryColor={color} label="基准测试" />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={230} durationInFrames={90}>
      <AbsoluteFill style={container}>
        <LineChart width={width} height={height} source={test2}
          translation={false} dark={true} primaryColor={color} label="实际操作" />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={320} durationInFrames={50}>
      <AbsoluteFill style={container}>
        <LineChart width={width} height={height} source={test2}
          translation={true} dark={true} primaryColor={color} label="实际操作" />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={370} durationInFrames={50}>
      <AbsoluteFill style={container}>
        <LineChart width={width} height={height} source={test3}
          translation={true} dark={true} primaryColor={color} label="实际操作" />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={420} durationInFrames={50}>
      <AbsoluteFill style={container}>
        <LineChart width={width} height={height} source={test4}
          translation={true} dark={true} primaryColor={color} label="实际操作" />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={470}>
      <AbsoluteFill style={container}>
        <LineChart width={width} height={height} source={test5}
          translation={true} dark={true} primaryColor={color} label="实际操作" />
      </AbsoluteFill>
    </Sequence>
  </>
}