import React from "react";
import { ToolbarProvider, useToolbar } from "./components/ToolbarContext";
import MainApp from "./MainApp";

function App() {
  return (
    <ToolbarProvider>
      <MainApp />
    </ToolbarProvider>
  );
}

export default App;