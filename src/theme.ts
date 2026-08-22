export const colors = {
  navy: '#0b2545',
  navySoft: '#123a66',
  primary: '#0a63c9',
  primaryHover: '#0852a3',
  sky: '#e8f1fc',
  bg: '#f5f8fc',
  surface: '#ffffff',
  text: '#1f2d3d',
  muted: '#52606d',
  border: '#d9e4ef',
  green: '#1b6f45',
  greenBg: '#e3f4ea',
  amber: '#7a4d05',
  amberBg: '#fff3dc',
  red: '#b03a3a',
  redBg: '#fbe4e4',
  slate: '#9fb0c3',
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
};

export const shadows = {
  card: '0 1px 2px rgba(11, 37, 69, 0.06), 0 8px 24px rgba(11, 37, 69, 0.08)',
  pop: '0 4px 12px rgba(11, 37, 69, 0.12), 0 16px 40px rgba(11, 37, 69, 0.14)',
};

export const breakpoints = {
  md: '720px',
  lg: '1000px',
};

export const maxWidth = '1160px';

export const theme = { colors, radii, shadows, breakpoints, maxWidth };

export type Theme = typeof theme;
