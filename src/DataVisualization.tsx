import React from "react";
import { AbsoluteFill, Sequence} from "remotion";
import { TestItem } from "../types/test";
import { TDMarkCharts } from "./DataVisualization/3DMarkCharts";
import { CyberCharts } from "./DataVisualization/CyberCharts";
import { ExpandingTransition } from "./DataVisualization/ExpandingTransition";
import { ForzaCharts } from "./DataVisualization/ForzaCharts";
import { OItemBackground } from "./DataVisualization/OItemBackground";
import { OScreen, testItems } from "./DataVisualization/OverviewScreen";
import { SwipeTransition } from "./DataVisualization/SwipeTransition";

//import "./DataVisualization/Img/3dmark-time-spy-hero.jpg";

export const DataVisualization: React.FC<{}> = () => {
  
  return (
    <AbsoluteFill style={{backgroundColor: 'white'}}>
      <Sequence from={30} durationInFrames={140}>
        <OScreen />
      </Sequence>
      <Sequence from={110}>
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
      </Sequence>
    </AbsoluteFill>
  )
}
