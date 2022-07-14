import React from "react";
import { AbsoluteFill, Easing, Sequence, useVideoConfig } from "remotion";
import { BarChart } from "./BarChart";
import { buildForm, ShowMaximun, ShowTrend } from "./formutils";
import { LineChart, XAxisLabel } from "./LineChart";


const test1 = buildForm({
  cols: ['I/O Size', '读取（GiB/s）', '写入（GiB/s）'],
  rows: [
    ['0.5', '0.029443', '0.0571'],
    ['1', '0.060557', '0.111104'],
    ['2', '0.124453', '0.226494'],
    ['4', '0.396865', '0.452178'],
    ['8', '0.622422', '0.900684'],
    ['16', '0.812822', '1.35'],
    ['32', '1.41', '2.62'],
    ['64', '2.01', '3.09'],
    ['128', '2.4', '2.93'],
    ['256', '3.46', '2.89'],
    ['512', '4.57', '2.82'],
    ['1', '3.9', '3.23'],
    ['2', '4.76', '3.53'],
    ['4', '4.04', '3.45'],
    ['8', '3.13', '3.47'],
    ['16', '3.44', '3.45'],
    ['32', '4.19', '2.85'],
    ['48', '3.84', '3.55'],
    ['64', '0.954658', '1.07']
  ]
}),
test2 = { ...test1 },
test3 = buildForm({
  cols: ['I/O Size', '读取（GiB/s）', '写入（GiB/s）'],
  rows: [
    ['48MiB', '5.85', '3.55'],
    ['64MiB', '5.88', '3.53']
  ]
});
const config0 = (v: number) => `${v.toFixed(2)}GiB/s`,
  config1 = {
  column: 1,
  from: test1.data.length - 2,
  to: test1.data.length - 1
};
test1.visualEffect = new ShowMaximun(config0, config1);
test2.visualEffect = new ShowTrend(config0, config1);

export const ATTOCharts: React.FC<{}> = () => {
  const video = useVideoConfig();
  const width = video.width - 200, height = video.height - 400;

  const container: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const label = <XAxisLabel>I/O大小（MiB）</XAxisLabel>;

  return <>
    <Sequence from={0} durationInFrames={90}>
      <AbsoluteFill style={container}>
        <LineChart width={width} height={height}
          translation={false} source={test1} dark={true}
          reference="header" label={label}/>
      </AbsoluteFill>
    </Sequence>
    <Sequence from={90} durationInFrames={60}>
      <AbsoluteFill style={container}>
        <LineChart width={width} height={height}
          translation={true} translationDuration={60}
          source={test1} dark={true}
          reference="header" label={label}/>
      </AbsoluteFill>
    </Sequence>
    <Sequence from={150} durationInFrames={50}>
      <AbsoluteFill style={container}>
        <LineChart width={width} height={height}
          translation={true} source={test2} dark={true}
          easing={Easing.linear} reference="header"
          label={label}/>
      </AbsoluteFill>
    </Sequence>
    <Sequence from={200}>
      <AbsoluteFill style={container}>
        <BarChart width={width} height={height}
          translation={false} source={test3} dark={true}/>
      </AbsoluteFill>
    </Sequence>
  </>
}