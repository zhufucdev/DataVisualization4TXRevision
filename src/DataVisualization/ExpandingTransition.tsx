import React from "react";
import { OItem } from "./OverviewItem";
import { TEST_ITEMS } from "./constants";
import { getAbsImgUrl } from "./OverviewScreen";
import { interpolate, useCurrentFrame, Easing, useVideoConfig } from "remotion";

export const ExpandingTransition: React.FC<{
  top: number;
  left: number;
  width: number;
  height: number;
}> = ({top, left, width, height}) => {
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

  const record = TEST_ITEMS[0];
  return <div style={style}>
    <OItem title={record.title} subtitle={record.subtitle} icon={getAbsImgUrl(record.icon)}
  background={record.background} cover={getAbsImgUrl(record.cover)} dark={record.dark}
  expandingProgress={eProgress}/>
  </div>
}