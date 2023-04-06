import { Injectable } from '@angular/core';
import {GameService} from "../services/game.service";

@Injectable({
  providedIn: 'root'
})
export class GhostService {

  wall: number = 0;
  gameMap!: Array<Array<number>>;
  gameFinished: boolean = false;

  // Ghost Properties
  initGhostX!: number;
  initGhostY!: number;
  ghostMove: number = 2;
  isGhostMoving: boolean = false;
  slowMovementIntervalG:any;
  ghostSpeed: number = 100;

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
    if (nextCells == this.wall) {
      // Hit a wall, change movement randomly;
      this.changeGhostDirection(randomNum);
    } else {
      // Move ghost to next cell
      this.initGhostX = nextX;
      this.initGhostY = nextY;
      this.ghostMoved(nextX, nextY, oldX, oldY);
    }
  }

  ghostMoved(nextX: any, nextY: any, oldX: any, oldY: any) {
    // const nextCellValue = this.gameMap[nextX][nextY];
    // this.gameMap[nextX][nextY] = 3;
    // this.gameMap[oldX][oldY] = nextCellValue;

    const nextCellValue = this.gameMap[nextX][nextY];
    if (nextCellValue === 1 || nextCellValue === 4) {
      // If the next cell is a small coin (1) or a big coin (4), move the ghost to that cell
      this.gameMap[nextX][nextY] = 3;
      this.gameMap[oldX][oldY] = nextCellValue;
    } else if (nextCellValue === 2) {
      // If the next cell is a road (2), move the ghost to that cell
      this.gameMap[nextX][nextY] = 3;
      this.gameMap[oldX][oldY] = 2;
    }  else if (nextCellValue === 5) {
      // If the next cell is a Pac-Man (5), stop the game
      this.gameMap[nextX][nextY] = 3;
      this.gameMap[oldX][oldY] = 2;
      this.gameFinished = true;
    } else {
      // If the next cell is not an empty cell or a coin cell or a road cell, do not move the ghost
      // and leave the old cell as it is
      this.gameMap[oldX][oldY] = 3;
    }
  }

  // Start slow movement interval
  startGhostMovement() {
    if (!this.isGhostMoving) {
      this.isGhostMoving = true;
      this.slowMovementIntervalG = setInterval(() => {
        this.moveGhostRandomly();
      }, this.ghostSpeed);
    }
  }

  // Change ghost direction and start slow movement interval
  changeGhostDirection(direction: number) {
    this.ghostMove = direction;
    this.startGhostMovement();
  }

}