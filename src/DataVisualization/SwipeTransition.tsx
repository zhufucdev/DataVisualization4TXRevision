import React, { ReactElement } from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";

const duration = 50;

export const SwipeTransition: React.FC<{
  children: [ReactElement, ReactElement],
  startFrame: number
}> = ({children, startFrame}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const scale = interpolate(
    frame,
    [startFrame, startFrame + 10, startFrame + duration - 20, startFrame + duration - 10],
    [1, 0.9, 0.9, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  )
  const translateX = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, -width],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  )

  const a: React.CSSProperties = {
    transform: `translateX(${translateX}px) scale(${scale})`
  }
  const b: React.CSSProperties = {
    transform: `translateX(${width + translateX}px) scale(${scale})`
  }

  return <>
  <AbsoluteFill style={a}>
    <Sequence from={0} durationInFrames={startFrame + duration} name="A">
      {children[0]}
    </Sequence>
  </AbsoluteFill>
  <AbsoluteFill style={b}>
    <Sequence from={startFrame} name="B">
      {children[1]}
    </Sequence>
  </AbsoluteFill>
  </>
}