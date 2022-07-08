import React, { Children, ReactElement } from "react";
import { OItem } from "./OverviewItem";
import { interpolate, useCurrentFrame, Easing, useVideoConfig, Sequence } from "remotion";
import { TestItem } from "../../types/test";

export const ExpandingTransition: React.FC<{
  children: ReactElement;
  top: number;
  left: number;
  width: number;
  height: number;
  record: TestItem;
}> = ({children, top, left, width, height, record}) => {
  const frame = useCurrentFrame();
  const video = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, 15],
    [0, 1],
    {
      extrapolateRight: 'clamp'
    }
  )
  const eProgress = interpolate(
    frame,
    [15, 75],
    [0, 1],
    {
      easing: Easing.inOut(Easing.exp),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  )

  const transition = {
    top: interpolate(
      eProgress,
      [0, 1],
      [top, 0]
    ),
    left: interpolate(
      eProgress,
      [0, 1],
      [left, 0]
    ),
    width: interpolate(
      eProgress,
      [0, 1],
      [width, video.width]
    ),
    height: interpolate(
      eProgress,
      [0, 1],
      [height, video.height]
    )
  }

  const style: React.CSSProperties = {
    ...transition,
    position: 'absolute',
    opacity
  }

  return <>
  <div style={style}>
    <OItem title={record.title} subtitle={record.subtitle} icon={record.icon}
        background={record.background} cover={record.cover} dark={record.dark}
        expandingProgress={eProgress}/>
  </div>
  <Sequence from={30}>
    {children}
  </Sequence>
  </>
}