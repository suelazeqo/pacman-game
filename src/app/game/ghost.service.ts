import {Injectable} from '@angular/core';
import {GameService} from "../services/game.service";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GhostService {

  wall: number = 0;
  gameMap!: Array<Array<number>>;
  isGameFinished: boolean = false;
  gameFinished$ = new Subject<boolean>();

  // Ghost Properties
  initGhostX!: number;
  initGhostY!: number;
  ghostMove: number = 2;
  isGhostMoving: boolean = false;
  slowMovementIntervalG: any;
  ghostSpeed: number = 100;

  //Blue Ghost Properties
  initGhostBlueX!: number;
  initGhostBlueY!: number;
  isBlueGhostMoving: boolean = false;
  movementIntervalForBlue: any;
  ghostBleMove: number = 2;

  storedValueBlue = 1;
  storedValuePink = 2;

  constructor(private services: GameService) {

    this.gameMap = services.map;

    let map = this.gameMap;
    //Initial ghost coordinate
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i]['length']; j++) {
        if (map[i][j] === 3) {
          this.initGhostX = i;
          this.initGhostY = j;
        }
        if (map[i][j] === 6) {
          this.initGhostBlueX = i;
          this.initGhostBlueY = j;
        }
      }
    }
  }

  // Move ghost in random direction
  moveGhostRandomly() {
    let nextX = this.initGhostX;
    let nextY = this.initGhostY;
    let oldX = this.initGhostX;
    let oldY = this.initGhostY;

    //Create a random number form 1 to 4
    let randomNum = Math.floor(Math.random() * 4) + 1;

    switch (this.ghostMove) {
      case 1: // Up
        nextX--;
        break;
      case 2: // Right
        nextY++;
        break;
      case 3: // Down
        nextX++;
        break;
      case 4: // Left
        nextY--;
        break;
    }
    let nextCells = this.gameMap[nextX][nextY];
    // Hit a wall or a ghost, change movement randomly;
    if (nextCells == this.wall ||nextCells === 6) {
      this.changeGhostDirection(randomNum);
    } else if (nextCells == 5) {
      clearInterval(this.slowMovementIntervalG);
      clearInterval(this.movementIntervalForBlue);
      this.isGhostMoving = false;
      this.isBlueGhostMoving = false;
      this.setIsGameFinished(true)
    } else {
      // Move ghost to next cell
      this.initGhostX = nextX;
      this.initGhostY = nextY;
      this.ghostMoved(nextX, nextY, oldX, oldY);
    }
  }

  // Move Blue ghost in random direction
  moveBlueGhostRandomly() {
    let nextBlueX = this.initGhostBlueX;
    let nextBlueY = this.initGhostBlueY;
    let oldBlueX = this.initGhostBlueX;
    let oldBlueY = this.initGhostBlueY;

    //Create a random number form 1 to 4
    let randomNumForBlue = Math.floor(Math.random() * 4) + 1;

    switch (this.ghostBleMove) {
      case 1: // Up
        nextBlueX--;
        break;
      case 2: // Right
        nextBlueY++;
        break;
      case 3: // Down
        nextBlueX++;
        break;
      case 4: // Left
        nextBlueY--;
        break;
    }
    let nextCellsBlue = this.gameMap[nextBlueX][nextBlueY];
    // Hit a wall or a ghost, change movement randomly;
    if (nextCellsBlue == this.wall|| nextCellsBlue === 3) {
      this.changeBlueGhostDirection(randomNumForBlue)
    } else if (nextCellsBlue == 5) {
      clearInterval(this.slowMovementIntervalG);
      clearInterval(this.movementIntervalForBlue);
      this.isGhostMoving = false;
      this.isBlueGhostMoving = false;
      this.setIsGameFinished(true)
    } else {
      // Move ghost to next cell
      this.initGhostBlueX = nextBlueX;
      this.initGhostBlueY = nextBlueY;
      this.ghostBlueMoved(nextBlueX, nextBlueY, oldBlueX, oldBlueY);
    }
  }

  // Replace the coordinate of the next cell with a Ghost
  // and keep the old cell as it was before to face a ghost
  ghostMoved(nextX: any, nextY: any, oldX: any, oldY: any) {
    this.gameMap[oldX][oldY] = this.storedValuePink;
    const nextCellValue = this.gameMap[nextX][nextY];
    this.gameMap[nextX][nextY] = 3;
    this.storedValuePink = nextCellValue;
  }

  // Replace the coordinate of the next cell with a Ghost
  // and keep the old cell as it was before to face a ghost
  ghostBlueMoved(nextX: any, nextY: any, oldX: any, oldY: any) {
    this.gameMap[oldX][oldY] = this.storedValueBlue;
    const nextCellValue = this.gameMap[nextX][nextY];
    this.gameMap[nextX][nextY] = 6;
    this.storedValueBlue = nextCellValue
  }

  // Start Pink Ghost movement interval
  startGhostMovement() {
    if (!this.isGhostMoving) {
      this.isGhostMoving = true;
      this.slowMovementIntervalG = setInterval(() => {
        this.moveGhostRandomly();
      }, this.ghostSpeed);
    }
  }

  // Start Blue Ghost movement interval
  startBlueGhostMovement() {
    if (!this.isBlueGhostMoving) {
      this.isBlueGhostMoving = true;
      this.movementIntervalForBlue = setInterval(() => {
        this.moveBlueGhostRandomly();
      }, this.ghostSpeed);
    }
  }

  // Change ghost direction and start slow movement interval
  changeGhostDirection(direction: number) {
    this.ghostMove = direction;
    this.getGhostNumber();
    this.startGhostMovement();
  }

  //Return the ghost movement
  getGhostNumber(): number {
    return this.ghostMove;
  }

  // Change ghost direction and start slow movement interval
  changeBlueGhostDirection(direction: number) {
    this.ghostBleMove = direction;
    this.startBlueGhostMovement();
  }

  setIsGameFinished(value: boolean): void {
    this.isGameFinished = value;
    this.gameFinished$.next(value);
  }

  getIsGameFinished(): boolean {
    return this.isGameFinished;
  }

}
