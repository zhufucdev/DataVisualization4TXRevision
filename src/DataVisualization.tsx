import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TestItem } from "../types/test";
import { TDMarkCharts } from "./DataVisualization/3DMarkCharts";
import { ATTOCharts } from "./DataVisualization/ATTOCharts";
import { CinebenchCharts } from "./DataVisualization/CinebenchCharts";
import { CyberCharts } from "./DataVisualization/CyberCharts";
import { ExpandingTransition } from "./DataVisualization/ExpandingTransition";
import { ForzaCharts } from "./DataVisualization/ForzaCharts";
import { OdysseyCharts } from "./DataVisualization/OdysseyCharts";
import { OItemBackground } from "./DataVisualization/OItemBackground";
import { OScreen, testItems } from "./DataVisualization/OverviewScreen";
import { SwipeTransition } from "./DataVisualization/SwipeTransition";

export const DataVisualization: React.FC<{}> = () => {
  return (
    <AbsoluteFill style={{ background: 'white' }}>
      <Sequence from={30} durationInFrames={140}>
        <OScreen />
      </Sequence>
      <Sequence from={110} durationInFrames={2740}>
        <SwipeTransition startFrame={1540}>
          <SwipeTransition startFrame={850}>
            <SwipeTransition startFrame={320}>
              <ExpandingTransition
                top={36} left={36} width={907} height={503}
                record={testItems[0] as TestItem}>
                <TDMarkCharts />
              </ExpandingTransition>

              <OItemBackground record={testItems[1] as TestItem}>
                <ForzaCharts />
              </OItemBackground>
            </SwipeTransition>

            <OItemBackground record={testItems[2] as TestItem}>
              <CyberCharts />
            </OItemBackground>
          </SwipeTransition>

          <OdysseyCharts />
        </SwipeTransition>
      </Sequence>
      <Sequence from={2850} durationInFrames={400}>
        <OItemBackground record={testItems[4] as TestItem}>
          <CinebenchCharts />
        </OItemBackground>
      </Sequence>
      <Sequence from={3250}>
        <OItemBackground record={testItems[5] as TestItem}>
          <ATTOCharts />
        </OItemBackground>
      </Sequence>
    </AbsoluteFill>
  )
}
