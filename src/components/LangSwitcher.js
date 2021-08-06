import { useContext } from "react";
import LangContext from "../LangContext";
import strings from "../strings";

function LangSwitcher() {
  const { setLang, lang } = useContext(LangContext);
  const { OTHER_LANG, OTHER_LANG_CODE } = strings;

  return (
    <div className="lang-switcher">
      <button
        type="button"
        className="button-link lang"
        onClick={() => {
          setLang(OTHER_LANG_CODE[lang]);
        }}
      >
        {OTHER_LANG[lang]}
      </button>
    </div>
  );
}

export default LangSwitcher;
