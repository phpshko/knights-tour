import {Cell} from "./Cell";
import {Coords} from "./Coords";

export class Board {
  public size: number;
  public cells: Cell[][] = [];

  public constructor(size: number) {
    this.size = size;
    this.init();
  }

  private init() {
    let x, y;

    for (x = 0; x < this.size; x++) {
      this.cells[x] = [];

      for (y = 0; y < this.size; y++) {
        this.cells[x][y] = new Cell(new Coords(x, y));
      }
    }
  }
}
