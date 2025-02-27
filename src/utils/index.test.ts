import {
  getWidgetStateFromStorage,
  saveWidgetStateToStorage,
  getWidgetGridColumns,
  getWidgetGridRows,
} from ".";
import { WidgetContextState } from "../hooks/use-widget-context";

describe("Utils", () => {
  describe("getWidgetStateFromStorage", () => {
    it("should return default state if no state in storage", () => {
      const state = getWidgetStateFromStorage();
      expect(state).toEqual({ widgets: {}, counters: {}, pieCounters: {} });
    });

    it("should return state from storage", () => {
      const mockState = {
        widgets: { test: "test" },
        counters: {},
        pieCounters: {},
      };
      localStorage.setItem("widgets", JSON.stringify(mockState));
      const state = getWidgetStateFromStorage();
      expect(state).toEqual(mockState);
    });
  });

  describe("saveWidgetStateToStorage", () => {
    it("should save state to storage", () => {
      const mockState = {
        widgets: { test: "test" },
        counters: {},
        pieCounters: {},
      } as unknown as WidgetContextState;
      saveWidgetStateToStorage(mockState);
      const state = localStorage.getItem("widgets");
      expect(state).toEqual(JSON.stringify(mockState));
    });
  });

  describe("getWidgetGridColumns", () => {
    it("should return 5 columns for container width >= 1000", () => {
      const columns = getWidgetGridColumns(1000);
      expect(columns).toEqual(5);
    });

    it("should return 3 columns for container width >= 600", () => {
      const columns = getWidgetGridColumns(600);
      expect(columns).toEqual(3);
    });

    it("should return 2 columns for container width < 600", () => {
      const columns = getWidgetGridColumns(500);
      expect(columns).toEqual(2);
    });
  });

  describe("getWidgetGridRows", () => {
    it("should return number of rows based on window height", () => {
      const rows = getWidgetGridRows();
      expect(rows).toBeGreaterThan(0);
    });
  });
});
