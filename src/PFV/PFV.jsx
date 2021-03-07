import React, { useState, useEffect } from "react";
import "./PFV.css";
import Node from "../Node/Node";
//import algorithms
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";

const START_NODE_ROW = 10;
const START_NODE_COL = 10;
const FINISH_NODE_ROW = 15;
const FINISH_NODE_COL = 35;

function PFV() {
  const [gridState, setGridState] = useState({
    grid: [],
    mouseIsPressed: false,
  });
  //refresh grid state
  const getRefreshedGrid = () => {
    const refreshedGrid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }

      refreshedGrid.push(currentRow);
    }
    setGridState((prevState) => {
      return { ...prevState, grid: refreshedGrid };
    });
    refreshAnimations();
    return refreshedGrid;
  };
  const refreshAnimations = () => {
    gridState.grid.forEach((row) => {
      row.forEach((node) => {
        if (node.isStart) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-start";
          return;
        } else if (node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-finish";
          return;
        }
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node";
      });
    });
  };
  //defining getInitial Grid
  const getInitialGrid = () => {
    const initGrid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }

      initGrid.push(currentRow);
    }
    setGridState((prevState) => {
      return { ...prevState, grid: initGrid };
    });
    return initGrid;
  };

  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      //fix shortest path bug here
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
      }
      {
        visitedNodesInOrder[i] &&
          setTimeout(() => {
            const node = visitedNodesInOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-visited";
          }, 10 * i);
      }
    }
  };

  function animateShortestPath(nodesInShortestPathOrder) {
    if (nodesInShortestPathOrder) {
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }, 50 * i);
      }
    }
  }

  //Mouse Handling

  const handleMouseDown = (row, col) => {
    const newGrid = getNewGridWithWallToggled(gridState.grid, row, col);
    setGridState((prevState) => {
      return { grid: newGrid, mouseIsPressed: true };
    });
  };

  const handleMouseEnter = (row, col) => {
    if (!gridState.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(gridState.grid, row, col);
    setGridState((prevState) => {
      return { ...prevState, grid: newGrid };
    });
  };

  const handleMouseUp = () => {
    setGridState((prevState) => {
      return { ...prevState, mouseIsPressed: !prevState.mouseIsPressed };
    });
  };

  // visualize button function logic

  const visualizeDijkstra = () => {
    const { grid } = gridState;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  //useEffect on mount. population: getInitialGrid
  useEffect(() => {
    getInitialGrid();
    //
  }, []);
  return (
    <div className="section">
      <button
        onClick={() => {
          getRefreshedGrid();
        }}
      >
        clear
      </button>
      <button onClick={visualizeDijkstra}>
        Visualize Dijkstra's Algorithm
      </button>
      <h1>{`mouseIsPressed is ${gridState.mouseIsPressed}`}</h1>
      <div className="grid">
        {gridState.grid &&
          gridState.grid.map((row, rowIdx) => {
            return (
              <div className="row" key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {
                    row,
                    col,
                    isStart,
                    isFinish,
                    isWall,
                    isVisited,
                  } = node;
                  return (
                    <Node
                      row={row}
                      col={col}
                      key={nodeIdx}
                      isStart={isStart}
                      isFinish={isFinish}
                      isVisited={isVisited}
                      isWall={isWall}
                      onMouseDown={() => handleMouseDown(row, col)}
                      onMouseEnter={() => handleMouseEnter(row, col)}
                      onMouseUp={() => handleMouseUp()}
                    />
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
}

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  //breaks out of function if we entered the start node or finish node
  if (grid[row][col].isStart || grid[row][col].isFinish) {
    return grid;
  }
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

export default PFV;
