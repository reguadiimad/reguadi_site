import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useResolvedTheme = () => {
  const theme = useSelector((state) => state.theme.theme);

  const getSystemTheme = () =>
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (theme === "dark") return true;
    if (theme === "light") return false;
    return getSystemTheme();
  });

  useEffect(() => {
    if (theme === "dark") {
      setIsDarkMode(true);
      return;
    }

    if (theme === "light") {
      setIsDarkMode(false);
      return;
    }

    // Handle "system" mode with live listener
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return isDarkMode;
};
