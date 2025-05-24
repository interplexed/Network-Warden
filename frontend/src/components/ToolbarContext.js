import React, { createContext, useContext, useState } from "react";

const ToolbarContext = createContext();

export function useToolbar() {
  return useContext(ToolbarContext);
}

export function ToolbarProvider({ children }) {
  const [controls, setControls] = useState(null);

  const registerControls = (controlsComponent) => {
    setControls(controlsComponent);
  };

  const clearControls = () => {
    setControls(null);
  };

  return (
    <ToolbarContext.Provider value={{ controls, registerControls, clearControls }}>
      {children}
    </ToolbarContext.Provider>
  );
}
