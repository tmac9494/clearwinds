import React from "react";
import "./App.scss";
import { WidgetContextProvider } from "./hooks/use-widget-context/";
import { WidgetGrid } from "./components/widget-grid/";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

const App = () => {
  return (
    <div className="App">
      <WidgetContextProvider>
        <DndProvider backend={HTML5Backend}>
          <WidgetGrid />
        </DndProvider>
      </WidgetContextProvider>
    </div>
  );
};

export default App;
