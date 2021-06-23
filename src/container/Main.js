import { Component } from 'react';

import Board from '../components/Board'
import Rank from '../components/Rank';
import Square from '../components/Square';
import Knight from '../components/Knight';
import { getSquareName, getLegalMoves, getRankName, getFileName } from './utils';

import Panel from './Panel';


class Main extends Component {
  constructor() {
    super();

    const totalFiles = 8;
    const totalRanks = 8;
    const visitCounts = Array(totalRanks).fill(0).map(
      () => Array(totalFiles).fill(0)
    );
    visitCounts[0][0] = 1;

    this.boardEl = null;

    this.state = {
      totalRanks: totalRanks,
      totalFiles: totalFiles,
      totalRandomMoves: 1,
      visitCounts: visitCounts,
      currentRankIndex: 0,
      currentFileIndex: 0,
      squareWidth: 0,
      isResizing: false,
      isMoving: false,
      timeoutId: null
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

  checkIfLegal = (fileIndex, rankIndex) => {
    const hasLegalFile = (0 <= fileIndex) && (fileIndex <= this.state.totalFiles - 1);
    const hasLegalRank = (0 <= rankIndex) && (rankIndex <= this.state.totalRanks - 1);
    return hasLegalFile && hasLegalRank;
  }

  // state-changing methods
  moveKnight = (newFileIndex, newRankIndex) => {
    const newVisitCounts = this.state.visitCounts.map(
      (rank, i) => rank.map(
        (visitCount, j) => 
          visitCount + Number((i === newRankIndex) && (j === newFileIndex))
      )
    )
    this.setState({
      currentFileIndex: newFileIndex,
      currentRankIndex: newRankIndex,
      visitCounts: newVisitCounts
    });
  }

  makeRandomMove = () => {
    const { currentFileIndex, currentRankIndex, totalRandomMoves } = this.state;
    const possibleMoves = getLegalMoves(currentFileIndex, currentRankIndex, this.checkIfLegal);
    const nextMoveIndex = Math.floor(Math.random() * possibleMoves.length);
    this.moveKnight(...possibleMoves[nextMoveIndex]);
    this.setState({ totalRandomMoves: totalRandomMoves + 1 });
  }
  resetBoard = () => {
    const visitCounts = Array(this.state.totalRanks).fill(0).map(
      () => Array(this.state.totalFiles).fill(0)
    );
    visitCounts[0][0] = 1;
    const [currentRankIndex, currentFileIndex] = [0, 0];
    this.setState({
      visitCounts, currentFileIndex, currentRankIndex
    })
  }
  changeDimensions = () => {}

  render() {
    return (
      <main>
        <div className="wrapper">
          <Board refCallback={this.boardRefCallback}>
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
          <Panel
            makeRandomMove={this.makeRandomMove}
            resetBoard={this.resetBoard}
            setIsMoving={(newIsMoving) => { this.setState({ isMoving: newIsMoving }); }}
            isMoving={this.state.isMoving}
          />
        </div>
      </main>
    );
  }
}

export default Main;