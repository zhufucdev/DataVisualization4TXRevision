import React from "react";
import { AbsoluteFill, Sequence} from "remotion";
import { TDMarkCharts } from "./DataVisualization/3DMarkCharts";
import { ExpandingTransition } from "./DataVisualization/ExpandingTransition";
import { OScreen } from "./DataVisualization/OverviewScreen";

//import "./DataVisualization/Img/3dmark-time-spy-hero.jpg";

export const DataVisualization: React.FC<{}> = () => {
  
  return (
    <AbsoluteFill style={{backgroundColor: 'white'}}>
      <Sequence from={30} durationInFrames={140}>
        <OScreen />
      </Sequence>
      <Sequence from={110}>
        <ExpandingTransition
          top={36} left={36} width={907} height={503} />
      </Sequence>
      <Sequence from={140}>
        <TDMarkCharts />
      </Sequence>
    </AbsoluteFill>
  )
}
