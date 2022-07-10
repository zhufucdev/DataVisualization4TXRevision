# Data Visualization for TX3 Revision

## Getting Started

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm start
```

**Render video**

```console
npm run build
```

**DO NOT** upgrade remotion as will, or you may
break some features.

## Charts

There are two categories of charts implemented:

- BarChart
- LineChart

To get started, construct a table.

```tsx
import { Table, buildForm } from "./formutils";
const test1: Table = buildForm({
  cols: ['Model', 'Time Spy'],
  rows: [
    ['TX3', '8990'],
    ['RTX 3070 (140W)', '10200'],
    ['RTX 3090', '18159']
  ]
})
```

Render a BarChart using the Remotion API.

```tsx
import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";

// --- snip ---

export const BenchmarkResults: React.FC<{}> = () => {
  const video = useVideoConfig();
  const height = video.height - 400, width = video.width - 200;
  const color = "#FFCC80";

  const container: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  return (
    <Sequence from={0} durationInFrames={100}>
      <AbsoluteFill style={container}>
        <BarChart height={height} width={width} source={test1} dark={true} translation={false} primaryBarColor={color}/>
      </AbsoluteFill>
    </Sequence>
  )
}
```

You should have a perfect animation like so.

![BarChart Sample](/sample/sample_barchart.gif)

## Remotion Docs

Learn more about Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).
