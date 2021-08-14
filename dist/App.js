import { Component } from "react";
import Main from "./containers/Main";
import LangContext from "./LangContext";
import LangSwitcher from "./components/LangSwitcher";
import strings from "./strings";
import style from "./App.module.css";

class App extends Component {
  constructor(props) {
    super(props);
    const lang = navigator.language.slice(0, 2);

    this.setLang = newLang => {
      this.setState({
        lang: newLang
      });
    };

    this.state = {
      lang: lang,
      setLang: this.setLang
    };
  }

  render() {
    console.log(style);
    return /*#__PURE__*/React.createElement(LangContext.Provider, {
      value: this.state
    }, /*#__PURE__*/React.createElement("div", {
      className: style.app
    }, /*#__PURE__*/React.createElement("header", {
      className: style.header
    }, /*#__PURE__*/React.createElement(LangSwitcher, null), /*#__PURE__*/React.createElement("h1", {
      className: style.pageTitle
    }, strings.TITLE[this.state.lang])), /*#__PURE__*/React.createElement(Main, {
      lang: this.state.lang
    })));
  }

}

export default App;