import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  ActionTypes,
  useWidgetContext,
  useWidgetContextDispatch,
} from "../../hooks/use-widget-context/";
import { WidgetContainer, WidgetTypes } from "../widget-container/";
import { CreateNewWidget } from "../create-new-widget";
import { WidgetHeader } from "../widget-header";
import "./styles.scss";
import { WidgetContent } from "../widget-content";

export const WidgetGrid = () => {
  const widgets = useWidgetContext();
  const dispatch = useWidgetContextDispatch();
  const initialCounters = widgets.reduce(
    (acc, widget) =>
      widget.type === WidgetTypes.counter
        ? {
            ...acc,
            [widget.id]: 0,
          }
        : acc,
    {}
  );

  const [containerWidth, setContainerWidth] = React.useState(0);
  const [node, setNode] = useState<HTMLDivElement>();

  const [counters, setCounters] =
    useState<Record<string, number>>(initialCounters);
  const [pieCounters, setPieCoutners] = useState<Record<string, string[]>>({});

  const dimensionDenominator =
    containerWidth >= 1000 ? 5 : containerWidth >= 600 ? 3 : 2;

  const gridItemBaseWidth = node
    ? node.getBoundingClientRect().width / dimensionDenominator
    : containerWidth / dimensionDenominator;
  const gridItemBaseHeight = window.innerHeight / dimensionDenominator;

  const containerCallback = useCallback((node?: HTMLDivElement) => {
    if (node) {
      setNode(node);
    }
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      if (node) {
        setContainerWidth(node.getBoundingClientRect().width);
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
    };
    // ignore below to prevent overflow after update from breaking layout
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node, widgets]);

  const counterTitles = widgets.reduce(
    (acc, widget) =>
      widget.type === WidgetTypes.counter
        ? {
            ...acc,
            [widget.id]: widget.config.title,
          }
        : acc,
    {} as Record<string, string>
  );

  const removeCounterFromPieCounters = (counterId: string) => {
    const pieCounterUpdate = Object.keys(pieCounters).reduce((acc, key) => {
      if (pieCounters[key]?.includes(counterId)) {
        return {
          ...acc,
          [key]: pieCounters[key].filter((id) => id !== counterId),
        };
      }
      return acc;
    }, {} as Record<string, string[]>);

    setPieCoutners(pieCounterUpdate);
  };

  return (
    <div className="grid" ref={containerCallback as any}>
      {widgets.map((widget: any) => {
        return (
          <WidgetContainer
            key={widget.id}
            id={widget.id}
            type={widget.type}
            position={widget.position}
            config={widget.config}
            width={gridItemBaseWidth * widget.position.width}
            height={gridItemBaseHeight * widget.position.height}
          >
            <div className="content-container">
              <WidgetHeader
                onRemove={() => {
                  dispatch({
                    type: ActionTypes.REMOVE_WIDGET,
                    payload: widget.id,
                  });
                  removeCounterFromPieCounters(widget.id);
                }}
                title={widget.config.title}
              />
              <WidgetContent
                widget={widget}
                counters={counters}
                counterTitles={counterTitles}
                gridItemBaseWidth={gridItemBaseWidth - 24}
                gridItemBaseHeight={gridItemBaseHeight}
                pieCounters={pieCounters}
                setPieCoutners={setPieCoutners}
                setCounters={setCounters}
              />
            </div>
          </WidgetContainer>
        );
      })}
      <CreateNewWidget
        gridItemBaseWidth={gridItemBaseWidth}
        gridItemBaseHeight={gridItemBaseHeight}
        newIndex={widgets[widgets.length - 1]?.position.index + 1 || 0}
        createNewCounter={(id: string) =>
          setCounters((prev) => ({
            ...prev,
            [id]: 0,
          }))
        }
      />
    </div>
  );
};
