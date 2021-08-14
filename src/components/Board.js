import style from "./BoardEls.module.css";

const Board = ({ refCallback, children }) => (
  <div className={style.boardWrapper}>
    <table className={style.board} ref={refCallback}>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export default Board;
