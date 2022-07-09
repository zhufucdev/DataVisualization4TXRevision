import Color from "color";


const barColors = ['#00B0FF', '#FF3D00', '#FFD600', '#F50057', '#D500F9'];

export function baseColor(index: number, primaryBarColor: string | undefined) {
  return primaryBarColor
  ? (index == 0 ? primaryBarColor
    : Color(barColors[index - 1]).saturationl(Color(primaryBarColor).saturationl()).hex())
    : barColors[index];
}

export function barColor(index: number, primaryBarColor: string | undefined): string {
  const base = baseColor(index, primaryBarColor);
  const darkened = Color(base).darken(0.2).hex();
  return `linear-gradient(to right, ${darkened}, ${base})`
}