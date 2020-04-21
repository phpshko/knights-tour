<template>
  <div>
    <div class="settings">
      <div class="container text-right">
        <div class="row">
          <div class="col-8">
            <label for="size">
              Size:
            </label>
          </div>
          <div class="col-4">
            <select class="form-control" v-model="size" v-on:change="initCells" :disabled="isPlaying" id="size">
              <option v-for="n in Number(maxSize)" v-if="n >= minSize" :value="n">{{ n }}</option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col-8">
            <label for="speed">
              Speed:
            </label>
          </div>
          <div class="col-4 form-group">
            <select class="form-control" v-model="speed" id="speed">
              <option v-for="n in Number(maxSpeed)" v-if="n >= minSpeed" :value="n">{{ n }}</option>
            </select>
          </div>
        </div>

        <div class="button-container">
          <button v-on:click="start()" :disabled="isPlaying" class="btn btn-success">Start</button>
          <button v-on:click="stop()" :disabled="!isPlaying" class="btn btn-danger">Stop</button>
          <button v-on:click="initCells()" :disabled="isPlaying" class="btn btn-outline-danger">Reset</button>
        </div>
      </div>
    </div>

    <div class="board" :class="{playing: isPlaying}">
      <h1>Knight's Tour</h1>
      <p class="text-center"><a href="https://en.wikipedia.org/wiki/Knight%27s_tour" target="_blank">Wikipedia</a> (using "Warnsdorff's rule")</p>

      <span v-show="selectedCoords">
          <i class="knight fas fa-chess-knight"></i>
        </span>

      <div class="progress" :style="{visibility: progress ? 'visible' : 'hidden'}">
        <div class="progress-bar bg-success" :style="{width: progress+'%'}" role="progressbar" aria-valuenow="0"
             aria-valuemin="0"
             aria-valuemax="100">
          {{ progress }}%
        </div>
      </div>

      <table>
        <tr v-for="row in board.cells">
          <td v-for="cell in row"
              v-on:click="select(cell)"
              :class="{
              visited: cell.isVisited,
              'next': cell.isNext,
              black: cell.color === 'black',
              white: cell.color === 'white'
          }"
              :data-coords="cell.coords.x + '/' + cell.coords.y"
          >
            <span v-show="cell.isVisited || cell.isNext" class="number">{{ cell.number }}</span>
            <span class="count-possible">{{ cell.countPossible }}</span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import {PathFinder} from "./PathFinder.ts";
import {Coords} from "./Coords.ts";
import {Board} from "@/components/Board";

export default {
  name: 'Board',
  components: {},
  data: function () {
    return {
      size: 8,
      minSize: 6,
      maxSize: 12,
      speed: 5,
      minSpeed: 1,
      maxSpeed: 10,
      showAvailable: true,
      showCountPossible: true,
      board: [],
      selectedCoords: null,
      isPlaying: false,
      progress: 0,
      currentStep: 1,
    }
  },
  created: function () {
    this.initCells();
  },
  methods: {
    initCells() {
      this.board = new Board(this.size);
      this.progress = 0;
    },
    select(cell) {
      this.initCells();

      this.progress = 0;

      this.selectedCoords = new Coords(cell.coords.x, cell.coords.y);
      this.board.cells[this.selectedCoords.x][this.selectedCoords.y].number = 1;
      this.board.cells[this.selectedCoords.x][this.selectedCoords.y].isVisited = true;

      this.moveKnight(this.selectedCoords);
    },
    moveKnight(coords, timeout = 0) {
      let knight = document.querySelector('.knight');
      let cellCoordinates = this.getKnightCoordsByCell(coords);

      knight.style.transition = 'all ' + timeout + 'ms cubic-bezier(0.985, 0.050, 0.700, 1)';
      knight.style.top = cellCoordinates.y;
      knight.style.left = cellCoordinates.x;
    },
    getKnightCoordsByCell(coords) {
      let container = document
        .querySelector('.board')
        .getBoundingClientRect();

      let cell = document
        .querySelector('.board [data-coords="' + coords.x + '/' + coords.y + '"]')
        .getBoundingClientRect();

      return new Coords(
        cell.x - container.x + 20,
        cell.y - container.y + 10,
      )
    },
    start(isFirstCall = true) {
      if (!this.selectedCoords) {
        alert('Select some start cell');
        return;
      }

      this.initCells();

      this.board.cells[this.selectedCoords.x][this.selectedCoords.y].number = 1;
      this.board.cells[this.selectedCoords.x][this.selectedCoords.y].isVisited = true;

      if (isFirstCall) {
        this.isPlaying = true;
        this.currentStep = 1;
      }

      if (!this.isPlaying) {
        return;
      }

      let steps = PathFinder.getSteps(this.size, this.selectedCoords);

      let promise = Promise.resolve();

      steps.forEach(step => {
        let targetCell = this.board.cells[step.targetCell.x][step.targetCell.y];
        let currentStep = ++this.currentStep;
        promise = promise
          .then(() => {
            return new Promise(resolve => {
              if (!this.isPlaying) {
                throw 'cancel';
              }

              let timeout = (this.maxSpeed - this.speed) * 100 + 100;

              targetCell.isNext = true;

              this.moveKnight(targetCell.coords, timeout);
              targetCell.number = currentStep;

              this.progress = Math.round(currentStep / (this.size ** 2) * 100);

              resolve(timeout);
            })
          })
          .then((timeout) => {
            return new Promise(resolve => {
              setTimeout(function () {
                resolve(true);
              }, timeout);
            })
          })
          .then(() => {
            targetCell.isVisited = true;
            this.selectedCoords = targetCell.coords;
          })
      })

      promise.then(() => {
        this.isPlaying = false;
      });
    },
    stop() {
      this.isPlaying = false;
    },
  },
}
</script>


<style scoped lang="scss">
table {
  border: 1px solid black;
  border-collapse: collapse;

  td {
    border: 1px solid black;
    width: 75px;
    height: 75px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    font-size: 24px;
  }

  .black {
    background-color: #000;
  }

  .white {
    background-color: #fff;
  }

  .next {
    background-color: #5099c4;
  }

  .visited {
    background-color: #59d866;
  }
}

.settings {
  width: 300px;
  vertical-align: top;
  margin-top: 92px;

  label {
    line-height: 36px;
  }

  .button-container {
    margin-top: 20px;

    button {
      margin-left: 5px;
    }
  }
}

.settings, .board {
  display: inline-block !important;
}

.board {
  position: relative;
}

.progress {
  height: 26px;
  margin-bottom: 10px;
}

.knight {
  position: absolute;
  color: #fd7e14;
  font-size: 50px;
}

.board.playing {
  cursor: not-allowed;
}

.board.playing:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
