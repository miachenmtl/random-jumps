import style from "./BoardEls.module.css";

const Rank = ({
  children
}) => /*#__PURE__*/React.createElement("tr", {
  className: style.rank
}, children);

export default Rank;