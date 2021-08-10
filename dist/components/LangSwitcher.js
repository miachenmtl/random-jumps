import { useContext } from "react";
import LangContext from "../LangContext";
import strings from "../strings";

function LangSwitcher() {
  const {
    setLang,
    lang
  } = useContext(LangContext);
  const {
    OTHER_LANG,
    OTHER_LANG_CODE
  } = strings;
  return /*#__PURE__*/React.createElement("div", {
    className: "lang-switcher"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "button-link lang",
    onClick: () => {
      setLang(OTHER_LANG_CODE[lang]);
    }
  }, OTHER_LANG[lang]));
}

export default LangSwitcher;