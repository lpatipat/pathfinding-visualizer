import React, { useRef } from "react";
import "./Node.css";

function Node({
  row,
  col,
  isWall,
  isStart,
  isFinish,
  isVisited,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) {
  const idRef = useRef();
  const extraClassName = isVisited
    ? "node-visited"
    : isWall
    ? "node-wall"
    : isFinish
    ? "node-finish"
    : isStart
    ? "node-start"
    : isVisited
    ? "node-visited"
    : "";
  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
}

export default Node;

export const DEFAULT_NODE = {
  row: 0,
  col: 0,
};
