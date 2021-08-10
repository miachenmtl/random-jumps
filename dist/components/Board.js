const Board = ({
  refCallback,
  children
}) => /*#__PURE__*/React.createElement("div", {
  className: "board-wrapper"
}, /*#__PURE__*/React.createElement("table", {
  ref: refCallback
}, /*#__PURE__*/React.createElement("tbody", null, children)));

export default Board;