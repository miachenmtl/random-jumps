import style from "./BoardEls.module.css";

const Rank = ({ children }) => <tr className={style.rank}>{children}</tr>;

export default Rank;
