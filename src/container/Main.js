import { Component } from 'react';

import Board from '../components/Board'
import Rank from '../components/Rank';
import Square from '../components/Square';

const ALPHABET = 'abcdefgh';
const getRankName = rankIndex => ALPHABET[rankIndex];

/*
const getColName = fileIndex => (fileIndex + 1).toString();
const parseSquareName = (squareName) => ({
  rankIndex: ALPHABET.findIndex(squareName[0]),
  fileIndex: parseInt(squareName[1], 10) - 1
});
*/

class Main extends Component {
  constructor() {
    super();

    const totalRanks = 8;
    const totalFiles = 8;

    const visitCounts = Array(totalRanks).fill(0).map(
      () => Array(totalFiles).fill(0)
    );
    visitCounts[0][0] = 1;

    const [
      currentPos, currentRankIndex, currentFileIndex
    ] = ['a1', 0, 0];

    this.state = {
      totalRanks,
      totalFiles,
      visitCounts,
      currentPos,
      currentRankIndex,
      currentFileIndex
    };
  }

  // visually and in html, first row of table is last logical rank array
  convertRankIndex = rankIndex => this.state.totalRanks - rankIndex - 1
  convertFileIndex = fileIndex => fileIndex + 1

  getLegalMoves = () => {}
  moveKnight = () => {}
  resetBoard = () => {}
  changeDimensions = () => {}

  render() {
    return (
      <main>
        <Board>
          {
            this.state.visitCounts.reverse().map((rankVisits, visualRankIndex) => {
              const logicalRankIndex = this.convertRankIndex(visualRankIndex);
              const isCurrentRank = logicalRankIndex === this.state.currentRankIndex;
              const rankName = getRankName(logicalRankIndex);

              return (
                <Rank key={logicalRankIndex} isCurrent={isCurrentRank} rankName={rankName}>
                  {
                    rankVisits.map((visitCount, logicalFileIndex) => (
                      <Square
                        key={rankName + logicalFileIndex.toString()}
                        visitCount={visitCount}
                        squareName={rankName + this.convertFileIndex(logicalFileIndex).toString()}
                        isDark={((logicalRankIndex + logicalFileIndex) % 2) === 0}
                        isCurrent={isCurrentRank && (logicalFileIndex === this.state.currentFileIndex)}
                      />
                    ))
                  }
                </Rank>
              );
            })
          }
        </Board>
        {/* UI */}
      </main>
    );
  }
}

export default Main;