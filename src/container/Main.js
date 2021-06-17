import { Component } from 'react';

import Board from '../components/Board'
import Rank from '../components/Rank';
import Square from '../components/Square';
import Knight from '../components/Knight';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const getRankName = rankIndex => (rankIndex + 1).toString();
const getFileName = fileIndex => ALPHABET[fileIndex];
const getSquareName = ({ fileIndex, rankIndex }) =>
  getFileName(fileIndex) + getRankName(rankIndex);

/*
const parseSquareName = (squareName) => ({
  fileIndex: ALPHABET.findIndex(squareName[0]),
  rankIndex: parseInt(squareName[1], 10) - 1
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

    const [currentRankIndex, currentFileIndex] = [0, 0];
    const squareWidth = 0;

    const isResizing = false;
    const timeoutId = null;

    this.boardEl = null;


    this.state = {
      totalRanks,
      totalFiles,
      visitCounts,
      currentRankIndex,
      currentFileIndex,
      squareWidth,
      isResizing,
      timeoutId
    };
  }

  // lifecycle methods
  componentDidMount() {
    this.resizeObserver = new ResizeObserver(this.resizeCallback);
    if (this.boardEl) {
      this.resizeObserver.observe(this.boardEl);
    }
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect();
    if (this.state.timeoutId) window.clearTimeout(this.state.timeoutId);
  }

  // callbacks for accessing DOM node information
  boardRefCallback = (element) => {
    if (element) {
      if (!this.boardEl) this.boardEl = element;
      const squareWidth = element.clientWidth / this.state.totalFiles;
      this.setState({ squareWidth });
    }
  }

  resizeCallback = ([{ contentRect }]) => {
    if (this.state.timeoutId) {
      window.clearTimeout(this.state.timeoutId);
    }
    const newId = window.setTimeout(() => {
      this.setState({
        isResizing: false,
        timeoutId: null
      });
    }, 200);

    this.setState({
      squareWidth: contentRect.width / this.state.totalFiles,
      isResizing: true,
      timeoutId: newId
    })
  }

  // logic utils for manipulating squares
  // visually and in html, first row of table is last logical rank array
  reverseRankIndex = rankIndex => this.state.totalRanks - rankIndex - 1
  getCurrentSquareName = () => getSquareName({
    fileIndex: this.state.currentFileIndex,
    rankIndex: this.state.currentRankIndex
  });


  getLegalMoves = () => {}
  moveKnight = (newRankIndex, newFileIndex) => {
    this.setState({
      currentRankIndex: newRankIndex,
      currentFileIndex: newFileIndex
    });
  }
  resetBoard = () => {}
  changeDimensions = () => {}

  render() {
    return (
      <main>
        <div className="board-wrapper" ref={this.boardRefCallback}>
          <Board>
            {
              this.state.visitCounts.reverse().map((rankVisits, visualRankIndex) => {
                const logicalRankIndex = this.reverseRankIndex(visualRankIndex);
                const isCurrentRank = logicalRankIndex === this.state.currentRankIndex;
                const rankName = getRankName(logicalRankIndex);

                return (
                  <Rank key={logicalRankIndex} isCurrent={isCurrentRank} rankName={rankName}>
                    {
                      rankVisits.map((visitCount, logicalFileIndex) => (
                        <Square
                          key={getFileName(logicalFileIndex) + rankName}
                          visitCount={visitCount}
                          squareName={getFileName(logicalFileIndex) + rankName}
                          isCurrent={isCurrentRank && (logicalFileIndex === this.state.currentFileIndex)}
                        />
                      ))
                    }
                  </Rank>
                );
              })
            }
          </Board>
          <Knight
            squareWidth={this.state.squareWidth}
            visualRankIndex={this.reverseRankIndex(this.state.currentRankIndex)}
            fileIndex={this.state.currentFileIndex}
            isResizing={this.state.isResizing}
          />
        </div>
        {/* UI */}
      </main>
    );
  }
}

export default Main;