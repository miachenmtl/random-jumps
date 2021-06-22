const Board = ({ refCallback, children }) => (
  <div className="board-wrapper">
    <table ref={refCallback}>
      <tbody>
        {children}
      </tbody>
    </table>
  </div>
);

export default Board;