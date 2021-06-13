const Square = ({ visitCount, squareName, isDark, isCurrent }) => (
  <td
    style={{
      backgroundColor: isDark ? 'blue' : 'antiquewhite',
      color: isCurrent ? 'red' : 'lightseagreen'
    }}
    title={squareName}
  >{visitCount}</td>
);

export default Square;