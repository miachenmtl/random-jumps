import { Component } from "react";
import classNames from "classnames";
import Board from "../components/Board";
import Rank from "../components/Rank";
import Square from "../components/Square";
import Knight from "../components/Knight";
import { getSquareName, getLegalMoves, getRankName, getFileName, parseSquareName } from "../utils/boardUtils";
import { getGradientImageData, getHeatmapRGB } from "../utils/imageUtils";
import Buttons from "./Buttons";
import DisclosureWidget from "../components/DisclosureWidget";
import Stats from "./Stats";
import Settings from "./Settings";
import { SPEED_MAP, CANVAS_WIDTH, MIN_INTERVAL } from "../constants";
import strings from "../strings";
import style from "./Main.module.css";
console.log(style);
const initialStats = {
  totalMoves: 0,
  countsForReturn: [],
  countsForTour: [],
  currentReturnCount: 0,
  currentTourCount: 0
};
const {
  SETTINGS,
  STATS
} = strings;

class Main extends Component {
  constructor() {
    super();
    const totalFiles = 8;
    const totalRanks = 8;
    const visitCounts = new Array(totalRanks).fill(0).map(() => new Array(totalFiles).fill(0)); // fallbacks as a workaround for jsdom not doing css variables:
    // see https://github.com/jsdom/cssstyle/pull/111

    const lightSqBg = getComputedStyle(document.documentElement).getPropertyValue("--light-square-bg-color") || "white";
    const darkSqBg = getComputedStyle(document.documentElement).getPropertyValue("--dark-square-bg-color") || "black";
    const gradientImageData = getGradientImageData(CANVAS_WIDTH, [lightSqBg, darkSqBg]);
    const stats = Object.assign({}, initialStats);
    this.boardEl = null;
    this.state = {
      totalRanks: totalRanks,
      totalFiles: totalFiles,
      stats: stats,
      visitedSquareNameSet: new Set(["a1"]),
      maxSquareCount: 1,
      visitCounts: visitCounts,
      startSquareName: "a1",
      currentRankIndex: 0,
      currentFileIndex: 0,
      targetSquareNames: [],
      squareWidth: 0,
      speedIndex: 0,
      displaySettings: {
        showKnight: true,
        showCount: true,
        showPercent: false,
        showHeatmap: false,
        showHighlight: true
      },
      gradientImageData: gradientImageData,
      isManual: false,
      isResizing: false,
      isDragging: false,
      isClicked: false,
      timeoutId: null
    };
  } // lifecycle methods


  componentDidMount() {
    this.resizeObserver = new ResizeObserver(this.resizeCallback);

    if (this.boardEl) {
      this.resizeObserver.observe(this.boardEl);
    }
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect();
    if (this.state.timeoutId) window.clearTimeout(this.state.timeoutId);
  } // callbacks for accessing DOM node information


  boardRefCallback = element => {
    if (element) {
      if (!this.boardEl) this.boardEl = element;
      const squareWidth = element.clientWidth / this.state.totalFiles;
      this.setState({
        squareWidth
      });
    }
  };
  resizeCallback = ([{
    contentRect
  }]) => {
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
    });
  }; // heatmap methods

  getHeatmapHexString = heatValue => getHeatmapRGB(heatValue, this.state.gradientImageData); // logic utils for manipulating squares
  // visually and in html, first row of table is last logical rank array

  reverseRankIndex = rankIndex => this.state.totalRanks - rankIndex - 1; // state-changing methods

  moveKnight = newMoves => {
    const newSquareNames = newMoves.map(indices => getSquareName(...indices));
    const newVisitCounts = this.state.visitCounts.map((rank, rankIndex) => rank.map((visitCount, fileIndex) => visitCount + newSquareNames.filter(squareName => squareName === getSquareName(fileIndex, rankIndex)).length));
    const lastMove = newMoves.slice(-1);
    const newMaxSquareCount = newVisitCounts.flat().reduce((acc, val) => Math.max(acc, val));
    this.setState({
      currentFileIndex: lastMove[0][0],
      currentRankIndex: lastMove[0][1],
      visitCounts: newVisitCounts,
      maxSquareCount: newMaxSquareCount
    });
  };
  makeRandomMoves = (totalNewMoves = 1) => {
    const {
      currentFileIndex,
      currentRankIndex,
      startSquareName,
      visitedSquareNameSet,
      stats: {
        totalMoves,
        countsForReturn,
        countsForTour,
        currentReturnCount,
        currentTourCount
      }
    } = this.state;
    let tempFileIndex = currentFileIndex;
    let tempRankIndex = currentRankIndex;
    let tempReturnCount = currentReturnCount;
    let tempTourCount = currentTourCount;
    let tempVisitedSquareNameSet = new Set(visitedSquareNameSet);
    const newReturnCounts = [];
    const newTourCounts = [];
    const newMoves = []; // TODO: DRY out the stat update logic

    for (let i = 0; i < totalNewMoves; i += 1) {
      const {
        totalRanks,
        totalFiles
      } = this.state;
      const possibleMoves = getLegalMoves(tempFileIndex, tempRankIndex, totalFiles, totalRanks);
      const nextMoveIndex = Math.floor(Math.random() * possibleMoves.length);
      const nextMove = possibleMoves[nextMoveIndex];
      const nextSquareName = getSquareName(...nextMove);
      tempReturnCount += 1;

      if (nextSquareName === startSquareName) {
        newReturnCounts.push(tempReturnCount);
        tempReturnCount = 0;
      }

      tempTourCount += 1;
      tempVisitedSquareNameSet.add(nextSquareName);

      if (tempVisitedSquareNameSet.size === totalFiles * totalRanks) {
        newTourCounts.push(tempTourCount);
        tempVisitedSquareNameSet = new Set([nextSquareName]);
        tempTourCount = 0;
      }

      newMoves.push(nextMove);
      [tempFileIndex, tempRankIndex] = nextMove;
    }

    this.moveKnight(newMoves);
    const newStats = {
      totalMoves: totalMoves + totalNewMoves,
      countsForReturn: countsForReturn.concat(newReturnCounts),
      countsForTour: countsForTour.concat(newTourCounts),
      currentReturnCount: tempReturnCount,
      currentTourCount: tempTourCount
    };
    this.setState({
      stats: newStats,
      visitedSquareNameSet: tempVisitedSquareNameSet
    });
  };
  makeManualMove = squareName => {
    const {
      totalFiles,
      totalRanks,
      startSquareName,
      visitedSquareNameSet,
      stats: {
        totalMoves,
        countsForReturn,
        countsForTour,
        currentReturnCount,
        currentTourCount
      }
    } = this.state;
    let newReturnCount = currentReturnCount + 1;
    const newReturnCounts = countsForReturn.slice(0);

    if (squareName === startSquareName) {
      newReturnCounts.push(newReturnCount);
      newReturnCount = 0;
    }

    let newTourCount = currentTourCount + 1;
    const newTourCounts = countsForTour.slice(0);
    let newVisitedSquareNameSet = new Set(visitedSquareNameSet);
    newVisitedSquareNameSet.add(squareName);

    if (newVisitedSquareNameSet.size === totalFiles * totalRanks) {
      newTourCounts.push(newTourCount);
      newTourCount = 0;
      newVisitedSquareNameSet = new Set([squareName]);
    }

    const {
      fileIndex,
      rankIndex
    } = parseSquareName(squareName);
    this.moveKnight([[fileIndex, rankIndex]]);
    this.setClickedSquare(fileIndex, this.reverseRankIndex(rankIndex));
    const newStats = {
      totalMoves: totalMoves + 1,
      countsForReturn: countsForReturn.concat(newReturnCounts),
      countsForTour: countsForTour.concat(newTourCounts),
      currentReturnCount: newReturnCount,
      currentTourCount: newTourCount
    };
    this.setState({
      stats: newStats,
      visitedSquareNameSet: newVisitedSquareNameSet
    });
  };
  setSpeed = ({
    target: {
      value
    }
  }) => {
    this.setState({
      speedIndex: parseInt(value, 10)
    });
  };
  toggleDisplaySettings = settingName => {
    const newDisplaySettings = Object.assign({}, this.state.displaySettings, {
      [settingName]: !this.state.displaySettings[settingName]
    });
    this.setState({
      displaySettings: newDisplaySettings
    });
  };
  resetBoard = (initialRankIndex = 0, initialFileIndex = 0) => {
    if (this.state.isClicked) {
      this.unsetClickedSquare();
    }

    const visitCounts = new Array(this.state.totalRanks).fill(0).map(() => new Array(this.state.totalFiles).fill(0));
    const [currentRankIndex, currentFileIndex] = [initialRankIndex, initialFileIndex];
    const maxSquareCount = 1;
    const startSquareName = getSquareName(initialFileIndex, initialRankIndex);
    const visitedSquareNameSet = new Set([startSquareName]);
    const stats = Object.assign({}, initialStats);
    this.setState({
      visitCounts,
      currentFileIndex,
      currentRankIndex,
      maxSquareCount,
      startSquareName,
      visitedSquareNameSet,
      stats
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

    this.setState({
      totalFiles: newTotalFiles,
      totalRanks: newTotalRanks,
      squareWidth: newSquareWidth
    }, () => {
      this.resetBoard();
    });
  };
  setIsDragging = bool => {
    this.setState({
      isDragging: bool
    });
  };
  setDropSquare = squareName => {
    const {
      fileIndex,
      rankIndex
    } = parseSquareName(squareName);
    this.resetBoard(rankIndex, fileIndex);
  };
  setMode = ({
    target: {
      value
    }
  }) => {
    if (value === "auto") {
      this.setState({
        isManual: false,
        isClicked: false,
        targetSquareNames: []
      });
    } else if (value === "manual") {
      this.setState({
        isManual: true
      });
    } else throw new Error(`Unrecognized value '${value}' in setMode.`);
  };
  setClickedSquare = (fileIndex, visualRankIndex) => {
    const logicalRankIndex = this.reverseRankIndex(visualRankIndex);
    const legalMoves = getLegalMoves(fileIndex, logicalRankIndex, this.state.totalFiles, this.state.totalRanks);
    const targetSquareNames = legalMoves.map(move => getSquareName(...move));
    this.setState({
      isClicked: true,
      targetSquareNames: targetSquareNames
    });
  };
  unsetClickedSquare = () => {
    this.setState({
      isClicked: false,
      targetSquareNames: []
    });
  };

  render() {
    const interval = Array.from(SPEED_MAP.values())[this.state.speedIndex];
    const displayKnight = this.state.displaySettings.showKnight && interval >= MIN_INTERVAL;
    return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("div", {
      className: style.wrapper
    }, /*#__PURE__*/React.createElement(Board, {
      refCallback: this.boardRefCallback
    }, this.state.visitCounts.slice(0).reverse().map((rankVisits, visualRankIndex) => {
      const logicalRankIndex = this.reverseRankIndex(visualRankIndex);
      const isCurrentRank = logicalRankIndex === this.state.currentRankIndex;
      const rankName = getRankName(logicalRankIndex);
      return /*#__PURE__*/React.createElement(Rank, {
        key: logicalRankIndex,
        isCurrent: isCurrentRank,
        rankName: rankName
      }, rankVisits.map((visitCount, logicalFileIndex) => /*#__PURE__*/React.createElement(Square, {
        key: getFileName(logicalFileIndex) + rankName,
        visitCount: visitCount,
        maxSquareCount: this.state.maxSquareCount,
        squareName: getFileName(logicalFileIndex) + rankName,
        getHeatmapHexString: this.getHeatmapHexString,
        setDropSquare: this.setDropSquare,
        makeManualMove: this.makeManualMove,
        unsetClickedSquare: this.unsetClickedSquare,
        displaySettings: this.state.displaySettings,
        isCurrent: isCurrentRank && logicalFileIndex === this.state.currentFileIndex,
        isDragging: this.state.isDragging,
        isTarget: this.state.targetSquareNames.includes(getSquareName(logicalFileIndex, logicalRankIndex)),
        isManual: this.state.isManual
      })));
    })), displayKnight && /*#__PURE__*/React.createElement(Knight, {
      squareWidth: this.state.squareWidth,
      visualRankIndex: this.reverseRankIndex(this.state.currentRankIndex),
      fileIndex: this.state.currentFileIndex,
      interval: interval,
      setIsDragging: this.setIsDragging,
      setClickedSquare: this.setClickedSquare,
      unsetClickedSquare: this.unsetClickedSquare,
      isDraggable: this.state.stats.totalMoves === 0 || this.state.isManual,
      isResizing: this.state.isResizing,
      isManual: this.state.isManual,
      isClicked: this.state.isClicked
    }), /*#__PURE__*/React.createElement("div", {
      className: classNames(style.panel, style.left)
    }, /*#__PURE__*/React.createElement(DisclosureWidget, {
      buttonText: STATS[this.props.lang]
    }, /*#__PURE__*/React.createElement(Stats, {
      stats: this.state.stats,
      visitCounts: this.state.visitCounts
    }))), /*#__PURE__*/React.createElement("div", {
      className: classNames(style.panel, style.right)
    }, /*#__PURE__*/React.createElement(Buttons, {
      makeRandomMoves: this.makeRandomMoves,
      resetBoard: this.resetBoard,
      interval: interval,
      totalFiles: this.state.totalFiles,
      totalRanks: this.state.totalRanks,
      isManual: this.state.isManual
    }), /*#__PURE__*/React.createElement(DisclosureWidget, {
      buttonText: SETTINGS[this.props.lang]
    }, /*#__PURE__*/React.createElement(Settings, {
      speedNames: Array.from(SPEED_MAP.keys()),
      speedIndex: this.state.speedIndex,
      setSpeed: this.setSpeed,
      displaySettings: this.state.displaySettings,
      toggleDisplaySettings: this.toggleDisplaySettings,
      initialTotalFiles: this.state.totalFiles,
      initialTotalRanks: this.state.totalRanks,
      changeDimensions: this.changeDimensions,
      isManual: this.state.isManual,
      setMode: this.setMode
    })))));
  }

}

export default Main;