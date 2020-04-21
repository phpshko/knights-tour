import {Coords} from "./Coords";

export class Step {
  public startCell: Coords;
  public targetCell: Coords;
  public possibleCells: Coords[];

  public constructor(startCell: Coords, targetCell: Coords, possibleCells: Coords[]) {
    this.startCell = startCell;
    this.targetCell = targetCell;
    this.possibleCells = possibleCells;
  }
}
