import React from "react";
import { AbsoluteFill, Audio, Sequence, useVideoConfig, Video } from "remotion";
import { TestItem } from "../../types/test";
import { stressTestResult } from "./Data/furmark";
import { cyberpunkPowerResult, forzaPowerResult, gamePracticeResult, ingameBechmarkPowerResult, ingameBenchmarkResult, tdmarkPowerResult } from "./Data/odyssey";
import { ShowAverage, Table } from "./formutils";
import { LineChart } from "./LineChart";
import { OItemBackground } from "./OItemBackground";
import { testItems } from "./OverviewScreen";
import { SwipeTransition } from "./SwipeTransition";

import flameVid from "./Media/Flame.mp4";

function showAverage(
  source: Table,
  index: number,
  unit: string,
  start: number | undefined = undefined,
  end: number | undefined = undefined
): ShowAverage {
  return new ShowAverage(
    a => `平均${a.toFixed(2)}${unit}`,
    {
      column: index,
      from: start || 0,
      to: end || source.data.length - 1
    }
  )
}

function showAverageWatt(source: Table): ShowAverage {
  return showAverage(source, 0, 'W')
}

const test1 = ingameBenchmarkResult,
  test2 = ingameBechmarkPowerResult,
  test3 = cyberpunkPowerResult,
  test4 = tdmarkPowerResult,
  test5 = forzaPowerResult,
  test6 = stressTestResult,
  test7 = gamePracticeResult,
  test8 = { ...gamePracticeResult },
  test9 = { ...gamePracticeResult };
test1.visualEffect = showAverage(test1, 2, 'fps');
test2.visualEffect = showAverageWatt(test2);
test3.visualEffect = showAverageWatt(test3);
test4.visualEffect = showAverage(test4, 0, 'W', 148, 202);
test5.visualEffect = showAverageWatt(test5);
test6.visualEffect = showAverage(test6, 0, 'W', 10);
test7.visualEffect = showAverage(test7, 2, 'fps');
test8.visualEffect = showAverage(test8, 2, 'fps', 10, 500);
test9.visualEffect = showAverage(test9, 2, 'fps', 500);

export const OdysseyCharts: React.FC<{}> = () => {
  const video = useVideoConfig();
  const width = video.width - 200, height = video.height - 400;

  const container: React.CSSProperties = { justifyContent: 'center', alignItems: 'center' };

  return <>
    <Sequence from={0} durationInFrames={280}>
      <OItemBackground record={testItems[3] as TestItem}>
        <>
        </>
        <Sequence from={0} durationInFrames={140}>
          <AbsoluteFill style={container}>
            <LineChart width={width} height={height} dark={true}
              translation={false} source={test1} framesAwait={30}
              label="基准测试" />
          </AbsoluteFill>
        </Sequence>
        <Sequence from={140} durationInFrames={70}>
          <AbsoluteFill style={container}>
            <LineChart width={width} height={height} dark={true}
              translation={true} source={test1} label="基准测试" />
          </AbsoluteFill>
        </Sequence>
        <Sequence from={210} durationInFrames={70}>
          <AbsoluteFill style={container}>
            <LineChart width={width} height={height} dark={true}
              translation={false} source={test2} label="基准测试" />
          </AbsoluteFill>
        </Sequence>
      </OItemBackground>
    </Sequence>

    <Sequence from={280}>
      <SwipeTransition startFrame={560}>
        <SwipeTransition startFrame={280} reverse={true}>
          <SwipeTransition startFrame={210} reverse={true}>
            <SwipeTransition startFrame={140} reverse={true}>
              <SwipeTransition startFrame={70} reverse={true}>
                <OItemBackground record={testItems[3] as TestItem}>
                  <AbsoluteFill style={container}>
                    <LineChart width={width} height={height} dark={true}
                      translation={true} source={test2} label="基准测试" />
                  </AbsoluteFill>
                </OItemBackground>
                <OItemBackground record={testItems[2] as TestItem}>
                  <AbsoluteFill style={container}>
                    <LineChart width={width} height={height} dark={false}
                      translation={true} source={test3} label="基准测试" />
                  </AbsoluteFill>
                </OItemBackground>
              </SwipeTransition>
              <OItemBackground record={testItems[0] as TestItem}>
                <AbsoluteFill style={container}>
                  <LineChart width={width} height={height} dark={true}
                    translation={true} source={test4} />
                </AbsoluteFill>
              </OItemBackground>
            </SwipeTransition>

            <OItemBackground record={testItems[1] as TestItem}>
              <AbsoluteFill style={container}>
                <LineChart width={width} height={height} dark={true}
                  translation={true} source={test5} label="基准测试" />
              </AbsoluteFill>
            </OItemBackground>
          </SwipeTransition>

          <>
            <AbsoluteFill style={container}>
              <LineChart width={width} height={height} dark={true}
                translation={true} source={test6} label="压力测试" />
            </AbsoluteFill>
            <Video src={flameVid}/>
          </>
        </SwipeTransition>

        <OItemBackground record={testItems[3] as TestItem}>
          <Sequence from={0} durationInFrames={90}>
            <AbsoluteFill style={container}>
              <LineChart width={width} height={height} dark={true}
                translation={true} source={test1} label="基准测试" />
            </AbsoluteFill>
          </Sequence>
          <Sequence from={90} durationInFrames={90}>
            <AbsoluteFill style={container}>
              <LineChart width={width} height={height} dark={true}
                translation={false} source={test7} label="实际操作" />
            </AbsoluteFill>
          </Sequence>
          <Sequence from={180} durationInFrames={70}>
            <AbsoluteFill style={container}>
              <LineChart width={width} height={height} dark={true}
                translation={true} source={test7} label="实际操作" />
            </AbsoluteFill>
          </Sequence>
          <Sequence from={250} durationInFrames={70}>
            <AbsoluteFill style={container}>
              <LineChart width={width} height={height} dark={true}
                translation={true} source={test8} label="探索" />
            </AbsoluteFill>
          </Sequence>
          <Sequence from={320}>
            <AbsoluteFill style={container}>
              <LineChart width={width} height={height} dark={true}
                translation={true} source={test9} label="室内战斗" />
            </AbsoluteFill>
          </Sequence>
        </OItemBackground>
      </SwipeTransition>
    </Sequence>
  </>
}