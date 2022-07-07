import { CSSProperties } from "react";

declare interface TestItem {
  title: string,
  subtitle: string | '',
  icon: CSSProperties.url,
  cover: CSSProperties.url,
  background: CSSProperties.Color,
  dark: boolean
}