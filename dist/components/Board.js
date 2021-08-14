import style from "./BoardEls.module.css";

const Board = ({
  refCallback,
  children
}) => /*#__PURE__*/React.createElement("div", {
  className: style.boardWrapper
}, /*#__PURE__*/React.createElement("table", {
  className: style.board,
  ref: refCallback
}, /*#__PURE__*/React.createElement("tbody", null, children)));

export default Board;