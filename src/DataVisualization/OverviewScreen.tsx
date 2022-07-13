import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { OItem } from "./OverviewItem";

import tdCover from "./Img/3dmark-time-spy-hero.jpg";
import tdLogo from "./Img/3dmark-logo.png";
import forza from "./Img/forza.jpg";
import cyberpunk from "./Img/cyberpunk.jpg";
import odyssey from "./Img/odyssey.jpg";
import cbLogo from "./Img/cinebench-logo.png";
import cbCover from "./Img/cinebench-cover.png";
import atto from "./Img/atto-logo.png";


export const testItems = new Array(
  {
    title: '3DMark Time Spy',
    subtitle: 'DX12 理论性能测试',
    background: '#FF6F00',
    cover: tdCover,
    icon: tdLogo,
    dark: true,
  },
  {
    title: '极限竞速：地平线4',
    subtitle: 'DX12 游戏测试',
    background: '#BF360C',
    cover: forza,
    dark: true,
  },
  {
    title: '赛博朋克2077',
    subtitle: 'DX12 游戏及光追测试',
    background: '#EEFF41',
    cover: cyberpunk,
    dark: false,
  },
  {
    title: '刺客信条：奥德赛',
    subtitle: 'DX12 游戏测试',
    background: '#5D4037',
    cover: odyssey,
    icon: '',
    dark: true,
  },
  {
    title: 'Cinebench R23',
    subtitle: 'CPU 三维渲染测试',
    background: '#673AB7',
    cover: cbCover,
    icon: cbLogo,
    dark: true,
  },
  {
    title: 'ATTO Disk Benchmark',
    subtitle: '磁盘读写性能测试',
    background: '#E53935',
    cover: '',
    icon: '',
    dark: true
  }
);


const itemsCount = 4, itemsInRow = 2, margin = 36, rows = Math.floor(itemsCount / itemsInRow);

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

    const record = testItems[i];
    elements.push(
      <div style={{ width: `${100 / itemsInRow}%`, ...marginStyle, opacity, transform: `translateY(${translateY}px)` }}>
        <OItem title={record.title} subtitle={record.subtitle}
        background={record.background} cover={record.cover}
        icon={record.icon} dark={record.dark}/>
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
