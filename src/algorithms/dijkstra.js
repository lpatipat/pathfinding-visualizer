export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];

  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }

  //start node (current is [row10][col5]) as defined starts with distance score: 0
  startNode.distance = 0;

  const unvisitedNodes = getAllNodes(grid);
  // while the length of unvisited nodes is not == 0
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    //pops off nodes as they are visited
    const closestNode = unvisitedNodes.shift();
    //Handle Walls
    if (closestNode.isWall) continue;
    //HANNDLE IMPOSSIBLE
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    //ANIMATE LATER
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }

  function sortNodesByDistance(unvisitedNodes) {
    //returns the unvisited nodes array by ascending distance score
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }

  function updateUnvisitedNeighbors(node, grid) {
    //runs get neighbor function
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    // updates each distance score for each neighbors
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
    }
  }

  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    //adds north neighbor
    if (row > 0) neighbors.push(grid[row - 1][col]);
    //adds south neighbor
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    //adds west neighbor
    if (col > 0) neighbors.push(grid[row][col - 1]);
    //adds east neighbor
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter((neighbor) => !neighbor.isVisited);
  }
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return nodesInShortestPathOrder;
}
