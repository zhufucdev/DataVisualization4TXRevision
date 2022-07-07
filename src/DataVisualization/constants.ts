import { TestItem } from "../../types/test";

export const FONT_FAMILY = 'Noto Sans SC, SF Pro Text, Helvetica, Arial, sans-serif';

export const IMG_PREFIX = '/src/DataVisualization/Img';

export const TEST_ITEMS = new Array<TestItem> (
  {
    title: '3DMark Time Spy',
    subtitle: 'DX12 理论性能测试',
    background: '#FF6F00',
    cover: '3dmark-time-spy-hero.jpg',
    icon: '3dmark-logo.png',
    dark: true,
  },
  {
    title: '极限竞速 地平线4',
    subtitle: 'DX12 游戏测试',
    background: '#BF360C',
    cover: 'forza.jpg',
    icon: '',
    dark: true,
  },
  {
    title: '赛博朋克2077',
    subtitle: 'DX12 游戏及光追测试',
    background: '#EEFF41',
    cover: 'cyberpunk.jpg',
    icon: '',
    dark: false,
  },
  {
    title: '刺客信条：奥德赛',
    subtitle: 'DX12 游戏测试',
    background: '#5D4037',
    cover: 'odyssey.jpg',
    icon: '',
    dark: true,
  },
  {
    title: 'Cinebench R23',
    subtitle: 'CPU渲染测试',
    background: '',
    cover: '',
    icon: '',
    dark: false,
  }
);
