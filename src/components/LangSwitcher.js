import { useContext } from "react";
import LangContext from "../LangContext";
import strings from "../strings";

import style from "./components.module.css";

function LangSwitcher() {
  const { setLang, lang } = useContext(LangContext);
  const { OTHER_LANG, OTHER_LANG_CODE } = strings;

  return (
    <button
      type="button"
      className={style.langButton}
      onClick={() => {
        setLang(OTHER_LANG_CODE[lang]);
      }}
    >
      {OTHER_LANG[lang]}
    </button>
  );
}

export default LangSwitcher;
