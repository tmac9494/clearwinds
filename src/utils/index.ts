import { WidgetContextState } from "../hooks/use-widget-context/types";

const WIDGET_STORAGE_KEY = "widgets";

export const getWidgetStateFromStorage = () => {
  const state = JSON.parse(
    localStorage.getItem(WIDGET_STORAGE_KEY) ||
      '{ "widgets": {}, "counters": {}, "pieCounters": {} }'
  );
  return state as WidgetContextState;
};

export const saveWidgetStateToStorage = (state: WidgetContextState) => {
  localStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(state));
};

export const getWidgetGridColumns = (containerWidth: number) => {
  const columnCount =
    containerWidth >= 1000 ? 5 : containerWidth >= 600 ? 3 : 2;

  return columnCount;
};

export const getWidgetGridRows = () => {
  const windowHeight = window.innerHeight;
  const rowCount = Math.floor(windowHeight / 200);
  return rowCount;
};

export const getContrastColor = (colorString: string) => {
  const color = "" + colorString;
  const isHEX = color.indexOf("#") === 0;
  const isRGB = color.indexOf("rgb") === 0;
  let r = 0,
    g = 0,
    b = 0;
  if (isHEX) {
    const hasFullSpec = color.length === 7;
    const m = color.substr(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g);
    if (m) {
      r = parseInt(m[0] + (hasFullSpec ? "" : m[0]), 16);
      g = parseInt(m[1] + (hasFullSpec ? "" : m[1]), 16);
      b = parseInt(m[2] + (hasFullSpec ? "" : m[2]), 16);
    }
  }
  if (isRGB) {
    const m = color.match(/(\d+){3}/g);
    if (m) {
      r = m[0] as any;
      g = m[1] as any;
      b = m[2] as any;
    }
  }
  if (typeof r != "undefined") {
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000" : "#fff";
  }
};
