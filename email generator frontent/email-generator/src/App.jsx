import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import EmailApp from "./EmailApp";

const App = () => {
  // ✅ Initialize from localStorage directly
  const getInitialMode = () => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? savedTheme === "true" : false;
  };

  const [darkMode, setDarkMode] = useState(getInitialMode);

  // ✅ Save theme whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ display: "flex", justifyContent: "flex-end", padding: 16 }}>
        <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </div>
      <EmailApp />
    </ThemeProvider>
  );
};

export default App;
