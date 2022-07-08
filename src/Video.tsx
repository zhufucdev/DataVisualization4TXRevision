import { Composition } from 'remotion';
import { DataVisualization } from './DataVisualization';
import { TDMarkCharts } from './DataVisualization/3DMarkCharts';
import { OScreen } from './DataVisualization/OverviewScreen';

// Each <Composition> is an entry in the sidebar!

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.tsx <id> out/video.mp4
				id="Main"
				component={DataVisualization}
				durationInFrames={600}
				fps={60}
				width={1920}
				height={1080}
				// You can override these props for each render:
				// https://www.remotion.dev/docs/parametrized-rendering
				defaultProps={{
				}}
			/>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.tsx <id> out/video.mp4
				id="Overview"
				component={OScreen}
				durationInFrames={180}
				fps={60}
				width={1920}
				height={1080}
			/>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.tsx <id> out/video.mp4
				id="3DMarkCharts"
				component={TDMarkCharts}
				durationInFrames={180}
				fps={60}
				width={1920}
				height={1080}
			/>
		</>
	);
};
