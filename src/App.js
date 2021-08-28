import { Component } from "react";

import Main from "./containers/Main";
import LangContext from "./LangContext";
import LangSwitcher from "./components/LangSwitcher";
import strings from "./strings";

class App extends Component {
  constructor(props) {
    super(props);

    const lang = navigator.language.slice(0, 2);

    this.setLang = (newLang) => {
      this.setState({ lang: newLang });
    };
    this.state = {
      lang: lang,
      setLang: this.setLang,
    };
  }

  render() {
    return (
      <LangContext.Provider value={this.state}>
        <div className="app">
          <header>
            <LangSwitcher />
            <h1>{strings.TITLE[this.state.lang]}</h1>
          </header>
          <Main lang={this.state.lang} />
          <footer>
            <a
              className="light"
              href="https://github.com/miachenmtl/random-jumps"
            >
              Source and ReadMe
            </a>
          </footer>
        </div>
      </LangContext.Provider>
    );
  }
}

export default App;
