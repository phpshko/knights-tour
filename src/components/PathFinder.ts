import {Board} from "./Board";
import {Cell} from "./Cell";
import {Coords} from "./Coords";
import {Step} from "./Step";

export class PathFinder {
  static getSteps(size: number, startCoords: Coords, countAttempts: number = 1000): Step[] {
    let bestResult: Step[] = [];

    for (let i = 0; i < countAttempts; i++) {
      let result = this.findPath(size, startCoords);

      if (result.length > bestResult.length) {
        bestResult = result;
      }

      console.log('Attempt: ' + i + '; count = ' + bestResult.length);

      if (bestResult.length === size ** 2 - 1) {
        return bestResult;
      }
    }

    return bestResult;
  }

  private static findPath(size: number, startCoords: Coords): Step[] {
    let board = new Board(size);

    let countSteps = size ** 2;

    let steps: Step[] = [];
    let currentCoords = startCoords;

    board.cells[currentCoords.x][currentCoords.y].isVisited = true;

    for (let i = 0; i < countSteps; i++) {
      let possibleCells = this.getPossibleCells(board, currentCoords);

      let bestCells: Cell[] = [];
      let bestScore: any = null;

      possibleCells.forEach(possibleCell => {
        let possibleNextCells = this.getPossibleCells(board, possibleCell.coords);

        if (possibleNextCells.length < bestScore) {
          bestCells = [];
        }

        if (bestScore === null || possibleNextCells.length <= bestScore) {
          bestCells.push(possibleCell);
        }

        bestScore = possibleNextCells.length;
      });

      if (bestCells.length === 0) {
        break;
      }

      let nextCell = bestCells[Math.floor(Math.random() * bestCells.length)];

      let nextStep = new Step(currentCoords, nextCell.coords, possibleCells.map((cell: Cell) => {
        return cell.coords;
      }));

      currentCoords = nextCell.coords;
      nextCell.isVisited = true;

      steps.push(nextStep);
    }

    return steps;
  }

  private static getPossibleCells(board: Board, coords: Coords): Cell[] {
    let possibleCells: Cell[] = [];

    this
      .getRealCoordinates(coords, board.size)
      .forEach(possibleCoords => {
        let possibleCell = board.cells[possibleCoords.x][possibleCoords.y];
        if (!possibleCell.isVisited) {
          possibleCells.push(possibleCell);
        }
      });

    return possibleCells;
  }

  private static getRealCoordinates(coords: Coords, size: number): Coords[] {
    let mapping = [
      {x: -1, y: -2},
      {x: -1, y: 2},
      {x: -2, y: -1},
      {x: -2, y: 1},

      {x: 1, y: -2},
      {x: 1, y: 2},
      {x: 2, y: -1},
      {x: 2, y: 1},
    ];

    let results: Coords[] = [];

    mapping.forEach(offsets => {
      let x = coords.x + offsets.x;
      let y = coords.y + offsets.y;

      if (x >= 0 && x < size && y >= 0 && y < size) {
        results.push(new Coords(x, y));
      }
    });

    return results;
  }
}
