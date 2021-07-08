import { Component } from "react";

import Board from "../components/Board";
import Rank from "../components/Rank";
import Square from "../components/Square";
import Knight from "../components/Knight";
import {
  getSquareName,
  getLegalMoves,
  getRankName,
  getFileName,
  parseSquareName,
} from "../utils/boardUtils";
import { getGradientImageData, getHeatmapRGB } from "../utils/imageUtils";

import Panel from "./Panel";
import { SPEED_MAP, CANVAS_WIDTH, MIN_INTERVAL } from "../constants";

class Main extends Component {
  constructor() {
    super();

    const totalFiles = 8;
    const totalRanks = 8;
    const visitCounts = new Array(totalRanks)
      .fill(0)
      .map(() => new Array(totalFiles).fill(0));
    visitCounts[0][0] = 1;

    // fallbacks as a workaround for jsdom not doing css variables:
    // see https://github.com/jsdom/cssstyle/pull/111
    const lightSqBg =
      getComputedStyle(document.documentElement).getPropertyValue(
        "--light-square-bg-color"
      ) || "white";
    const darkSqBg =
      getComputedStyle(document.documentElement).getPropertyValue(
        "--dark-square-bg-color"
      ) || "black";
    const gradientImageData = getGradientImageData(CANVAS_WIDTH, [
      lightSqBg,
      darkSqBg,
    ]);

    this.boardEl = null;

    this.state = {
      totalRanks: totalRanks,
      totalFiles: totalFiles,
      totalRandomMoves: 1,
      maxSquareCount: 1,
      visitCounts: visitCounts,
      currentRankIndex: 0,
      currentFileIndex: 0,
      squareWidth: 0,
      speedIndex: 0,
      displaySettings: {
        showKnight: true,
        showCount: true,
        showPercent: false,
        showHeatmap: false,
        showHighlight: true,
      },
      gradientImageData: gradientImageData,
      isResizing: false,
      isMoving: false,
      isDragging: false,
      timeoutId: null,
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
  };

  resizeCallback = ([{ contentRect }]) => {
    if (this.state.timeoutId) {
      window.clearTimeout(this.state.timeoutId);
    }
    const newId = window.setTimeout(() => {
      this.setState({
        isResizing: false,
        timeoutId: null,
      });
    }, 200);

    this.setState({
      squareWidth: contentRect.width / this.state.totalFiles,
      isResizing: true,
      timeoutId: newId,
    });
  };

  // heatmap methods
  getHeatmapHexString = (heatValue) =>
    getHeatmapRGB(heatValue, this.state.gradientImageData);

  // logic utils for manipulating squares
  // visually and in html, first row of table is last logical rank array
  reverseRankIndex = (rankIndex) => this.state.totalRanks - rankIndex - 1;

  // state-changing methods
  moveKnight = (newMoves) => {
    const newSquareNames = newMoves.map((indices) => getSquareName(...indices));
    const newVisitCounts = this.state.visitCounts.map((rank, rankIndex) =>
      rank.map(
        (visitCount, fileIndex) =>
          visitCount +
          newSquareNames.filter(
            (squareName) => squareName === getSquareName(fileIndex, rankIndex)
          ).length
      )
    );
    const lastMove = newMoves.slice(-1);

    const newMaxSquareCount = newVisitCounts
      .flat()
      .reduce((acc, val) => Math.max(acc, val));
    this.setState({
      currentFileIndex: lastMove[0][0],
      currentRankIndex: lastMove[0][1],
      visitCounts: newVisitCounts,
      maxSquareCount: newMaxSquareCount,
    });
  };

  makeRandomMoves = (totalNewMoves = 1) => {
    const { currentFileIndex, currentRankIndex, totalRandomMoves } = this.state;
    let tempFileIndex = currentFileIndex;
    let tempRankIndex = currentRankIndex;
    const newMoves = [];
    for (let i = 0; i < totalNewMoves; i += 1) {
      const { totalRanks, totalFiles } = this.state;
      const possibleMoves = getLegalMoves(
        tempFileIndex,
        tempRankIndex,
        totalFiles,
        totalRanks
      );
      const nextMoveIndex = Math.floor(Math.random() * possibleMoves.length);
      const nextMove = possibleMoves[nextMoveIndex];
      newMoves.push(nextMove);
      [tempFileIndex, tempRankIndex] = nextMove;
    }

    this.moveKnight(newMoves);
    this.setState({ totalRandomMoves: totalRandomMoves + totalNewMoves });
  };

  setSpeed = (speedName) => {
    this.setState({
      speedIndex: Array.from(SPEED_MAP.keys()).indexOf(speedName),
    });
  };

  toggleDisplaySettings = (settingName) => {
    const newDisplaySettings = Object.assign(this.state.displaySettings, {
      [settingName]: !this.state.displaySettings[settingName],
    });
    this.setState({
      displaySettings: newDisplaySettings,
    });
  };

  resetBoard = (initialRankIndex = 0, initialFileIndex = 0) => {
    const visitCounts = new Array(this.state.totalRanks)
      .fill(0)
      .map(() => new Array(this.state.totalFiles).fill(0));

    visitCounts[initialRankIndex][initialFileIndex] = 1;
    const [currentRankIndex, currentFileIndex] = [
      initialRankIndex,
      initialFileIndex,
    ];
    const maxSquareCount = 1;
    const totalRandomMoves = 1;
    this.setState({
      visitCounts,
      currentFileIndex,
      currentRankIndex,
      maxSquareCount,
      totalRandomMoves,
    });
  };

  changeDimensions = (newTotalFiles, newTotalRanks) => {
    document.documentElement.style.setProperty("--total-files", newTotalFiles);
    document.documentElement.style.setProperty("--total-ranks", newTotalRanks);
    let newSquareWidth = 0;
    if (this.boardEl) {
      newSquareWidth = this.boardEl.clientWidth / newTotalFiles;
    } else {
      console.error("Unable to get ref when changing dimensions.");
    }

    this.setState(
      {
        totalFiles: newTotalFiles,
        totalRanks: newTotalRanks,
        squareWidth: newSquareWidth,
      },
      () => {
        this.resetBoard();
      }
    );
  };

  setIsMoving = (bool) => {
    this.setState({ isMoving: bool });
  };

  render() {
    const interval = Array.from(SPEED_MAP.values())[this.state.speedIndex];
    const displayKnight =
      this.state.displaySettings.showKnight && interval >= MIN_INTERVAL;
    return (
      <main>
        <div className="wrapper">
          <Board refCallback={this.boardRefCallback}>
            {this.state.visitCounts
              .slice(0)
              .reverse()
              .map((rankVisits, visualRankIndex) => {
                const logicalRankIndex = this.reverseRankIndex(visualRankIndex);
                const isCurrentRank =
                  logicalRankIndex === this.state.currentRankIndex;
                const rankName = getRankName(logicalRankIndex);

                return (
                  <Rank key={logicalRankIndex} isCurrent={isCurrentRank} rankName={rankName}>
                    {
                      rankVisits.map((visitCount, logicalFileIndex) => (
                        <Square
                          key={getFileName(logicalFileIndex) + rankName}
                          visitCount={visitCount}
                          maxSquareCount={this.state.maxSquareCount}
                          squareName={getFileName(logicalFileIndex) + rankName}
                          getHeatmapHexString={this.getHeatmapHexString}
                          displaySettings={this.state.displaySettings}
                          isCurrent={isCurrentRank && (logicalFileIndex === this.state.currentFileIndex)}
                        />
                      ))
                    }
                  </Rank>
                );
              })}
          </Board>
          {
            displayKnight &&
              <Knight
                squareWidth={this.state.squareWidth}
                visualRankIndex={this.reverseRankIndex(this.state.currentRankIndex)}
                fileIndex={this.state.currentFileIndex}
                interval={interval}
                isResizing={this.state.isResizing}
              />
          }
          <Panel
            makeRandomMoves={this.makeRandomMoves}
            resetBoard={this.resetBoard}
            interval={interval}
            speedNames={Array.from(SPEED_MAP.keys())}
            speedIndex={this.state.speedIndex}
            setSpeed={this.setSpeed}
            displaySettings={this.state.displaySettings}
            toggleDisplaySettings={this.toggleDisplaySettings}
            totalFiles={this.state.totalFiles}
            totalRanks={this.state.totalRanks}
            changeDimensions={this.changeDimensions}
            setIsMoving={this.setIsMoving}
            isMoving={this.state.isMoving}
          />
        </div>
      </main>
    );
  }
}

export default Main;
