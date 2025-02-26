import { saveWidgetStateToStorage } from "../../utils";
import { ActionTypes, WidgetContextActions, WidgetContextState } from "./types";

export class WidgetStateHandler {
  state: WidgetContextState;

  constructor(initialState: WidgetContextState) {
    this.state = initialState;
  }

  [ActionTypes.ADD_WIDGET](action: WidgetContextActions) {
    this.setState({
      [action.payload.id]: {
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
    const { [action.payload]: toRemove, ...restOfWidgets } = this.state;
    this.state = restOfWidgets;
  }

  [ActionTypes.SWAP_WIDGETS](action: WidgetContextActions) {
    const { source, destination } = action.payload;
    const sourceWidget = this.state[source];
    const destinationWidget = this.state[destination];

    this.setState({
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

  setState = (newState: Partial<WidgetContextState>) => {
    this.state = {
      ...this.state,
      ...(newState as WidgetContextState),
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
    console.error("Invalid action type");
    return state;
  }

  stateHandler[action.type](action);

  const stateUpdate = stateHandler.getState();

  saveWidgetStateToStorage(stateUpdate);

  return stateUpdate;
};
