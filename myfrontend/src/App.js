import React from "react";
import {
  ThemeProvider,
  unstable_createMuiStrictModeTheme as createMuiTheme,
} from "@material-ui/core";
import Home from "./Home";
import "@fontsource/mulish";

function App() {
  const theme = createMuiTheme({
    palette: {
      primary: { main: "#48CCCC" },
      secondary: { main: "#25EFA1" },
    },
    typography: {
      fontFamily: "'Mulish', 'Arial', sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>
  );
}

export default App;
