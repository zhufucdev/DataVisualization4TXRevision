import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { IMG_PREFIX, TEST_ITEMS } from "./constants";
import { OItem } from "./OverviewItem";

import "./Img/3dmark-time-spy-hero.jpg";
import "./Img/3dmark-logo.png";
import "./Img/forza.jpg";
import "./Img/cyberpunk.jpg";
import "./Img/odyssey.jpg";

const itemsCount = 4, itemsInRow = 2, margin = 36, rows = Math.floor(itemsCount / itemsInRow);

export function getAbsImgUrl(custom: string): string {
  return custom ? `${IMG_PREFIX}/${custom}` : custom;
}

export const OScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elements = [], containers = [];
  for (let i = 0; i < itemsCount; i++) {
    const opacity = interpolate(
      frame,
      [i * 5, i * 5 + 15],
      [0, 1],
      {
        extrapolateRight: 'clamp'
      }
    );

    const translationProgress = spring({
      frame: frame - i * 5,
      fps,
      config: {
        damping: 10
      }
    });

    const translateY = interpolate(
      translationProgress,
      [0, 1],
      [150, 0]
    );

    let marginStyle: any = {
      marginTop: margin,
      marginLeft: margin
    }

    const rowIndex = Math.floor(i / itemsInRow);
    if (rowIndex + 1 === rows) {
      // in the last row
      marginStyle = {
        ...marginStyle,
        marginBottom: margin
      }
    }
    if (i + 1 - rowIndex * itemsInRow === itemsInRow) {
      // in the last column
      marginStyle = {
        ...marginStyle,
        marginRight: margin
      }
    }

    const record = TEST_ITEMS[i];
    elements.push(
      <div style={{ width: `${100 / itemsInRow}%`, ...marginStyle, opacity, transform: `translateY(${translateY}px)` }}>
        <OItem title={record.title} subtitle={record.subtitle}
        background={record.background} cover={getAbsImgUrl(record.cover)}
        icon={getAbsImgUrl(record.icon)} dark={record.dark}/>
      </div>
    )
  }

  for (let y = 0; y < rows; y++) {
    containers.push(
      <div style={{ display: 'flex', flexDirection: 'row', height: `${100 / rows}%` }}>{ elements.slice(y * itemsInRow, (y + 1) * itemsInRow) }</div>
    )
  }

  return (
    <AbsoluteFill>
      {containers}
    </AbsoluteFill>
  )
}
