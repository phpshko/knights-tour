import {Coords} from "./Coords";

export class Cell {
  coords: Coords;
  isNext: boolean = false;
  isVisited: boolean = false;
  number: number = 0;
  color: string = '';

  public constructor(coords: Coords) {
    this.coords = coords;
    this.color = (coords.x % 2 === 0 && coords.y % 2 !== 0) || (coords.x % 2 !== 0 && coords.y % 2 === 0)
      ? 'black'
      : 'white';
  }
}
