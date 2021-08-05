import { createContext } from "react";

const LangContext = createContext({
  lang: "empty",
  setLang: () => {},
});

export default LangContext;
