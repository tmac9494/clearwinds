import { WidgetTypes } from "../../utils/types";
import { WidgetContextReducer, WidgetStateHandler } from "./reducer";
import { ActionTypes, WidgetContextState } from "./types";
import * as utils from "../../utils";

describe("Widget Context State Handler", () => {
  const initialState = {
    widgets: {
      counter: {
        id: "counter",
        type: "counter",
        position: { width: 1, height: 1, index: 0 },
      },
      "data-table": {
        id: "data-table",
        type: "data-table",
        position: { width: 1, height: 1, index: 1 },
      },
      "pie-chart": {
        id: "pie-chart",
        type: "pie-chart",
        position: { width: 1, height: 1, index: 2 },
      },
    },
    pieCounters: {
      "pie-chart": ["counter"],
    },
  } as unknown as WidgetContextState;
  const stateHandler = new WidgetStateHandler(initialState);

  it("should return the initial state", () => {
    expect(stateHandler.getState()).toEqual(initialState);
  });

  it("should swap the index position on SWAP_WIDGET action", () => {
    stateHandler["SWAP_WIDGETS"]({
      type: ActionTypes.SWAP_WIDGETS,
      payload: { source: "counter", destination: "data-table" },
    });
    const newState = stateHandler.getState();
    expect(newState.widgets.counter.position.index).toEqual(
      initialState.widgets["data-table"].position.index
    );
    expect(newState.widgets["data-table"].position.index).toEqual(
      initialState.widgets.counter.position.index
    );
  });

  it("should remove the widget and pie counter on REMOVE_WIDGET action", () => {
    stateHandler["REMOVE_WIDGET"]({
      type: ActionTypes.REMOVE_WIDGET,
      payload: "counter",
    });
    const newState = stateHandler.getState();
    expect(newState.widgets.counter).toEqual(undefined);
    expect(newState.pieCounters["pie-chart"]).toEqual([]);
  });

  it("should remove the widget and the pie counter on REMOVE_WIDGET action", () => {
    stateHandler["ADD_WIDGET"]({
      type: ActionTypes.ADD_WIDGET,
      payload: {
        id: "new-pie-chart",
        type: WidgetTypes.chart,
        position: { width: 1, height: 1, index: 2 },
      },
    });
    stateHandler["ADD_COUNTER_TO_CHART"]({
      type: ActionTypes.ADD_COUNTER_TO_CHART,
      payload: { chartId: "new-pie-chart", counterId: "counter" },
    });
    stateHandler["REMOVE_WIDGET"]({
      type: ActionTypes.REMOVE_WIDGET,
      payload: "new-pie-chart",
    });
    const newState = stateHandler.getState();
    expect(newState.widgets["new-pie-chart"]).toEqual(undefined);
    expect(newState.pieCounters["new-pie-chart"]).toEqual(undefined);
  });

  it("should add the widget on ADD_WIDGET action", () => {
    stateHandler["ADD_WIDGET"]({
      type: ActionTypes.ADD_WIDGET,
      payload: {
        id: "new-widget",
        type: "counter",
        position: { width: 1, height: 1, index: 3 },
      },
    });
    const newState = stateHandler.getState();
    expect(newState.widgets["new-widget"]).toBeDefined();
  });

  it("should set the counter on SET_COUNTER action", () => {
    stateHandler["SET_COUNTER"]({
      type: ActionTypes.SET_COUNTER,
      payload: { counterId: "new-widget", value: 5 },
    });
    const newState = stateHandler.getState();
    expect(newState.counters["new-widget"]).toEqual(5);
  });

  it("should reset the counter on RESET_COUNTER action", () => {
    stateHandler["RESET_COUNTER"]({
      type: ActionTypes.RESET_COUNTER,
      payload: "new-widget",
    });
    const newState = stateHandler.getState();
    expect(newState.counters["new-widget"]).toEqual(0);
  });

  it("should reset the chart counter state on RESET_CHART action", () => {
    stateHandler["ADD_COUNTER_TO_CHART"]({
      type: ActionTypes.ADD_COUNTER_TO_CHART,
      payload: { chartId: "pie-chart", counterId: "new-widget" },
    });
    stateHandler["RESET_CHART"]({
      type: ActionTypes.RESET_CHART,
      payload: "pie-chart",
    });
    const newState = stateHandler.getState();
    expect(newState.pieCounters["pie-chart"]).toEqual([]);
  });

  it("should reset set refresh to true on RESET_DATA_TABLE action", () => {
    stateHandler["RESET_DATA_TABLE"]({
      type: ActionTypes.RESET_DATA_TABLE,
      payload: "data-table",
    });
    const newState = stateHandler.getState();
    expect(newState.widgets["data-table"].refresh).toEqual(true);
  });

  it("should set refresh to false on RESET_REFRESH action", () => {
    stateHandler["RESET_REFRESH"]({
      type: ActionTypes.RESET_REFRESH,
      payload: "data-table",
    });
    const newState = stateHandler.getState();
    expect(newState.widgets["data-table"].refresh).toEqual(false);
  });

  it("should add counter to pie chart on ADD_COUNTER_TO_CHART action", () => {
    stateHandler["ADD_COUNTER_TO_CHART"]({
      type: ActionTypes.ADD_COUNTER_TO_CHART,
      payload: { chartId: "pie-chart", counterId: "new-widget" },
    });
    const newState = stateHandler.getState();
    expect(newState.pieCounters["pie-chart"]).toContain("new-widget");
  });

  it("should remove counter from pie chart on REMOVE_COUNTER_FROM_CHART action", () => {
    stateHandler["REMOVE_COUNTER_FROM_CHART"]({
      type: ActionTypes.REMOVE_COUNTER_FROM_CHART,
      payload: { chartId: "pie-chart", counterId: "new-widget" },
    });
    const newState = stateHandler.getState();
    expect(newState.pieCounters["pie-chart"]).not.toContain("new-widget");
  });

  it("should set local storage after state handler runs", () => {
    const spy = jest.spyOn(utils, "saveWidgetStateToStorage");
    WidgetContextReducer(initialState, {
      type: ActionTypes.ADD_WIDGET,
      payload: {
        id: "new-widget2",
        type: "counter",
        position: { width: 1, height: 1, index: 3 },
      },
    });
    expect(spy).toHaveBeenCalled();
  });

  it("should throw an error if action type is not defined", () => {
    expect(() => {
      WidgetContextReducer(initialState, {
        type: "INVALID_ACTION" as ActionTypes,
        payload: {},
      });
    }).toThrow("Invalid action type");
  });
});
