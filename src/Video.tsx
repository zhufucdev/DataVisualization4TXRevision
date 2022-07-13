import { Composition } from 'remotion';
import { DataVisualization } from './DataVisualization';
import { TDMarkCharts } from './DataVisualization/3DMarkCharts';
import { ATTOCharts } from './DataVisualization/ATTOCharts';
import { CinebenchCharts } from './DataVisualization/CinebenchCharts';
import { CyberCharts } from './DataVisualization/CyberCharts';
import { ForzaCharts } from './DataVisualization/ForzaCharts';
import { OdysseyCharts } from './DataVisualization/OdysseyCharts';
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
				durationInFrames={3340}
				fps={60}
				width={1920}
				height={1080}
				// You can override these props for each render:
				// https://www.remotion.dev/docs/parametrized-rendering
				defaultProps={{
				}}
			/>
			<Composition
				id="Overview"
				component={OScreen}
				durationInFrames={180}
				fps={60}
				width={1920}
				height={1080}
			/>
			<Composition
				id="3DMarkCharts"
				component={TDMarkCharts}
				durationInFrames={300}
				fps={60}
				width={1920}
				height={1080}
			/>
			<Composition
				id="ForzaCharts"
				component={ForzaCharts}
				durationInFrames={600}
				fps={60}
				width={1920}
				height={1080}
			/>
			<Composition
				id="CyberpunkCharts"
				component={CyberCharts}
				durationInFrames={1600}
				fps={60}
				width={1920}
				height={1080}
			/>
			<Composition
				id="OdysseyCharts"
				component={OdysseyCharts}
				durationInFrames={1600}
				fps={60}
				width={1920}
				height={1080}
			/>
			<Composition
				id="CinebenchCharts"
				component={CinebenchCharts}
				durationInFrames={240}
				fps={60}
				width={1920}
				height={1080}
			/>
			<Composition
				id="ATTOCharts"
				component={ATTOCharts}
				durationInFrames={240}
				fps={60}
				width={1920}
				height={1080}
			/>
		</>
	);
};
