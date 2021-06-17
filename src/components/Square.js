const Square = ({ visitCount, squareName, isCurrent }) => (
  <td
    className={isCurrent ? 'current' : undefined}
    title={squareName}
  >{visitCount}</td>
);

export default Square;