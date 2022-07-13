import React from "react";
import { Img, interpolate } from "remotion";
import { FONT_FAMILY } from "./constants";
import * as CSS from 'csstype';

const titleContainer: React.CSSProperties = {
  position: 'absolute',
  bottom: 24,
  left: 24,
}

const titleStyle: React.CSSProperties = {
  fontSize: 74,
  fontFamily: FONT_FAMILY
}

const subtitleStyle: React.CSSProperties = {
  fontSize: 40,
  fontFamily: FONT_FAMILY,
  margin: 'auto'
}

const iconStyle: React.CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: '50%',
  margin: 5,
}

const center: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center'
}

const shadow: React.CSSProperties = {
  filter: 'drop-shadow(3px 3px 5px rgba(0, 0, 0, 0.24))'
}

export const OItem: React.FC<{
  title: string;
  subtitle?: string;
  background: CSS.DataType.Color;
  icon?: string;
  cover: string;
  dark: boolean;
  expandingProgress?: number;
}> = ({title, subtitle, background, icon, cover, dark, expandingProgress}) => {
  const surface: React.CSSProperties = {
    color: dark ? 'white' : 'black'
  }

  const maskAlpha = expandingProgress ? interpolate(
    expandingProgress,
    [0, 1],
    [0.14, 0.6]
  ) : 0.14

  const coverStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: expandingProgress ? interpolate(
      expandingProgress,
      [0, 1],
      [20, 0]
    ) : 20
  }

  return (
  <>
    {cover ? <Img src={cover} style={{...coverStyle, ...shadow, objectFit: 'cover'}} /> : undefined}
    <div style={{...coverStyle, background, opacity: maskAlpha }} />
    <div style={{
      ...coverStyle,
      background: `linear-gradient(180deg, transparent 0%, transparent 30%, ${background} 80%, ${background} 100%)`,
      opacity: 1 - (expandingProgress || 0)
    }}></div>
    <div style={titleContainer}>
      <div style={center}>
        {icon ? <Img src={icon} style={iconStyle} /> : undefined}
        <strong style={{...titleStyle, ...surface}}>{ title }</strong>
      </div>
      <p style={{...subtitleStyle, ...surface}}>{subtitle}</p>
    </div>
  </>
  )
}


