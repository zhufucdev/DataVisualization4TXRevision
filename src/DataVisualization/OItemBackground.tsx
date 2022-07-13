import React, { ReactElement } from "react";
import { AbsoluteFill } from "remotion";
import { TestItem } from "../../types/test";
import { OItem } from "./OverviewItem";

export const OItemBackground: React.FC<{
  children: ReactElement[] | ReactElement;
  record: TestItem;
}> = ({children, record}) => {
  return <>
  <AbsoluteFill>
    <OItem title={record.title} subtitle={record.subtitle} icon={record.icon}
        background={record.background} cover={record.cover} dark={record.dark}
        expandingProgress={1}/>
  </AbsoluteFill>
  {children}
  </>
}