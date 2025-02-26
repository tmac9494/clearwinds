import React, { useCallback, useEffect } from "react";
import { WidgetTypes } from "../widget-container/";
import {
  ActionTypes,
  useWidgetContextDispatch,
} from "../../hooks/useWidgetContext/";
import { WidgetFormInput } from "../widget-form-input/";
import "./styles.scss";

const widgetTypeTitles = {
  [WidgetTypes.dataTable]: "Data Table",
  [WidgetTypes.counter]: "Counter",
  [WidgetTypes.chart]: "Chart",
};

export const WidgetForm = ({
  closeForm,
  newIndex,
}: {
  closeForm?: () => void;
  newIndex: number;
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
    widgetDispatch({
      type: ActionTypes.ADD_WIDGET,
      payload: {
        id: Date.now(),
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
    if (value > 0) {
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
    <div>
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
              value={refetchInterval}
              type="number"
              placeholder="Refetch Interval(seconds)"
              onChange={(e) => handleRefetchInterval(parseInt(e.target.value))}
            />
          </WidgetFormInput>
        )}

        <WidgetFormInput label="Width">
          <input
            value={width}
            onChange={(e) => handleWidth(parseInt(e.target.value))}
            type="number"
            placeholder="Width"
          />
        </WidgetFormInput>

        <WidgetFormInput label="Height">
          <input
            value={height}
            onChange={(e) => handleHeight(parseInt(e.target.value))}
            type="number"
            placeholder="Height"
          />
        </WidgetFormInput>

        <button type="submit" className="form-submit">
          Add Widget
        </button>
      </form>
    </div>
  );
};
