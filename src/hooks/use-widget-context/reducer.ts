import { saveWidgetStateToStorage } from "../../utils";
import { WidgetTypes } from "../../utils/types";
import {
  ActionTypes,
  CountersState,
  PieCounterState,
  WidgetContextActions,
  WidgetContextState,
  WidgetState,
} from "./types";

export class WidgetStateHandler {
  state: WidgetContextState;

  constructor(initialState: WidgetContextState) {
    this.state = initialState;
  }

  [ActionTypes.ADD_WIDGET](action: WidgetContextActions) {
    const widgetId = action.payload.id;

    if (action.payload.type === WidgetTypes.counter) {
      this[ActionTypes.SET_COUNTER]({
        type: ActionTypes.SET_COUNTER,
        payload: { widgetId, value: 0 },
      });
    }

    this.setWidgetState({
      [widgetId]: {
        ...action.payload,
        position: {
          ...action.payload.position,
          index:
            action.payload.position.index ?? Object.keys(this.state).length,
        },
      },
    });
  }

  [ActionTypes.REMOVE_WIDGET](action: WidgetContextActions) {
    const { [action.payload]: toRemove, ...restOfWidgets } = this.state.widgets;

    if (toRemove.type === WidgetTypes.counter) {
      Object.keys(this.state.pieCounters).forEach((key) => {
        const pieCounterSet = new Set(this.state.pieCounters[key]);
        if (pieCounterSet.has(action.payload)) {
          this[ActionTypes.REMOVE_COUNTER_FROM_CHART]({
            type: ActionTypes.REMOVE_COUNTER_FROM_CHART,
            payload: { chartId: key, counterId: action.payload },
          });
        }
      });
    }

    if (toRemove.type === WidgetTypes.chart) {
      this.state.pieCounters = Object.keys(this.state.pieCounters).reduce(
        (acc, key) => {
          if (key !== action.payload) {
            acc[key] = this.state.pieCounters[key];
          }
          return acc;
        },
        {} as PieCounterState
      );
    }

    this.state = {
      widgets: restOfWidgets,
      counters: this.state.counters,
      pieCounters: this.state.pieCounters,
    };
  }

  [ActionTypes.SWAP_WIDGETS](action: WidgetContextActions) {
    const { source, destination } = action.payload;
    const sourceWidget = this.state.widgets[source];
    const destinationWidget = this.state.widgets[destination];

    this.setWidgetState({
      [source]: {
        ...sourceWidget,
        position: {
          ...sourceWidget.position,
          index: destinationWidget.position.index,
        },
      },
      [destination]: {
        ...destinationWidget,
        position: {
          ...destinationWidget.position,
          index: sourceWidget.position.index,
        },
      },
    });
  }

  [ActionTypes.SET_COUNTER](action: WidgetContextActions) {
    const { counterId, value } = action.payload;
    this.setCounterState({ [counterId]: value });
  }

  [ActionTypes.RESET_COUNTER](action: WidgetContextActions) {
    const counterId = action.payload;
    this.setCounterState({
      [counterId]: 0,
    });
  }

  [ActionTypes.RESET_CHART](action: WidgetContextActions) {
    const id = action.payload;
    this.setPieCounterState({
      [id]: [],
    });
  }

  [ActionTypes.RESET_DATA_TABLE](action: WidgetContextActions) {
    const id = action.payload;
    this.setWidgetState({
      [id]: {
        ...this.state.widgets[id],
        refresh: true,
      },
    });
  }

  [ActionTypes.RESET_REFRESH](action: WidgetContextActions) {
    const id = action.payload;
    this.setWidgetState({
      [id]: {
        ...this.state.widgets[id],
        refresh: false,
      },
    });
  }

  [ActionTypes.ADD_COUNTER_TO_CHART](action: WidgetContextActions) {
    const { chartId, counterId } = action.payload;
    this.setPieCounterState({
      [chartId]: [...(this.state.pieCounters[chartId] || []), counterId],
    });
  }

  [ActionTypes.REMOVE_COUNTER_FROM_CHART](action: WidgetContextActions) {
    const { chartId, counterId } = action.payload;
    this.setPieCounterState({
      [chartId]: (this.state.pieCounters[chartId] || []).filter(
        (id) => id !== counterId
      ),
    });
  }

  setWidgetState = (newState: Partial<WidgetState>) => {
    this.state = {
      ...this.state,
      widgets: {
        ...this.state.widgets,
        ...(newState as WidgetState),
      },
    };
  };

  setCounterState = (newState: CountersState) => {
    this.state = {
      ...this.state,
      counters: {
        ...this.state.counters,
        ...newState,
      },
    };
  };

  setPieCounterState = (newState: PieCounterState) => {
    this.state = {
      ...this.state,
      pieCounters: {
        ...this.state.pieCounters,
        ...newState,
      },
    };
  };

  // returns state outside of the class reference
  getState = () => ({ ...this.state });
}

export const WidgetContextReducer = (
  state: WidgetContextState,
  action: WidgetContextActions
) => {
  const stateHandler = new WidgetStateHandler(state);
  if (!stateHandler[action.type]) {
    throw new Error("Invalid action type");
  }

  stateHandler[action.type](action);

  const stateUpdate = stateHandler.getState();

  saveWidgetStateToStorage(stateUpdate);

  return stateUpdate;
};
