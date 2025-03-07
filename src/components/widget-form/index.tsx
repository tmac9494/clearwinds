import React, { useCallback, useEffect } from "react";
import {
  ActionTypes,
  useWidgetContextDispatch,
} from "../../hooks/use-widget-context/";
import { WidgetFormInput } from "../widget-form-input/";
import "./styles.scss";
import { WidgetTypes } from "../../utils/types";

const widgetTypeTitles = {
  [WidgetTypes.dataTable]: "Data Table",
  [WidgetTypes.counter]: "Counter",
  [WidgetTypes.chart]: "Chart",
};

export const WidgetForm = ({
  closeForm,
  newIndex,
  createNewCounter,
}: {
  closeForm?: () => void;
  newIndex: number;
  createNewCounter: (id: string) => void;
}) => {
  const [title, setTitle] = React.useState<string>("");
  const [width, setWidth] = React.useState<number>(1);
  const [height, setHeight] = React.useState<number>(1);
  const [type, setType] = React.useState<WidgetTypes | "">("");
  const [refetchInterval, setRefetchInterval] = React.useState<number>(0);

  const [validationMessage, setValidationMessage] = React.useState<
    string | null
  >(null);

  const widgetDispatch = useWidgetContextDispatch();

  const resetFormState = () => {
    setTitle("");
    setWidth(1);
    setHeight(1);
    setType("");
    setRefetchInterval(0);
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      setValidationMessage("Please fill out all fields");
      return;
    }
    const id = Date.now().toString();

    widgetDispatch({
      type: ActionTypes.ADD_WIDGET,
      payload: {
        id,
        position: {
          width,
          height,
          index: newIndex,
        },
        config: {
          title,
        },
        type,
        refetchInterval,
      },
    });
    closeForm && closeForm();
    resetFormState();
    createNewCounter(id);
  };

  const handleWidth = (value: number) => {
    if (value > 0 && value <= 5) {
      setWidth(value);
    }
  };

  const handleHeight = (value: number) => {
    if (value > 0 && value <= 2) {
      setHeight(value);
    }
  };

  const handleRefetchInterval = (value: number) => {
    if (value >= 0) {
      setRefetchInterval(value);
    }
  };

  // validation
  const isFormValid = useCallback(
    () => title !== "" && width > 0 && height > 0 && type !== "",
    [title, width, height, type]
  );

  useEffect(() => {
    if (isFormValid() && validationMessage) {
      setValidationMessage(null);
    }
  }, [validationMessage, isFormValid]);

  return (
    <div data-testid="widget-form">
      {validationMessage && (
        <p className="validation-message">{validationMessage}</p>
      )}
      <form
        className="widget-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <WidgetFormInput label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Title"
          />
        </WidgetFormInput>

        <WidgetFormInput label="Type">
          <select
            data-testid="form-type-input"
            onChange={(e) => setType(e.target.value as WidgetTypes)}
            value={type}
          >
            <option value="">Select a widget type</option>
            {Object.values(WidgetTypes).map((type) => (
              <option key={type} value={type}>
                {widgetTypeTitles[type]}
              </option>
            ))}
          </select>
        </WidgetFormInput>

        {type === WidgetTypes.dataTable && (
          <WidgetFormInput label="Refetch(S)">
            <input
              data-testid="form-refetch-input"
              value={refetchInterval}
              type="number"
              placeholder="Refetch Interval(seconds)"
              onChange={(e) => handleRefetchInterval(parseInt(e.target.value))}
            />
          </WidgetFormInput>
        )}

        <WidgetFormInput label="Width">
          <input
            data-testid="form-width-input"
            value={width}
            onChange={(e) => handleWidth(parseInt(e.target.value))}
            type="number"
            placeholder="Width"
          />
        </WidgetFormInput>

        <WidgetFormInput label="Height">
          <input
            data-testid="form-height-input"
            value={height}
            onChange={(e) => handleHeight(parseInt(e.target.value))}
            type="number"
            placeholder="Height"
          />
        </WidgetFormInput>

        <button data-testid="form-submit" type="submit" className="form-submit">
          <span className="icon">&#43;</span> Add Widget
        </button>
      </form>
    </div>
  );
};
