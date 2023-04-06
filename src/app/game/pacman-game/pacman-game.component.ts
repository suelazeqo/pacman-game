import {Component, HostListener, OnInit} from '@angular/core';
import {GameService} from "../../services/game.service";

@Component({
  selector: 'app-pacman-game',
  templateUrl: './pacman-game.component.html',
  styleUrls: ['./pacman-game.component.css']
})
export class PacmanGameComponent implements OnInit {

  title = 'Pacman Game';
  totalScore: number = 0;
  gameMap!: Array<Array<number>>;
  gameFinished: boolean = false;
  eatCoin: number = 10;
  eatBigCoin = 40;

  //Members of map
  wall: number = 0;
  coin: number = 1;
  road: number = 2;
  ghost: number = 3;
  bigCoin: number = 4;
  pacman: number = 5;

  // Pacman properties
  pacmanMove: number = 2; // 1 ==> up, 2==>right, 3==>down, 4==>left
  initPacmanX!: number;
  initPacmanY!: number;
  slowMovementInterval: any;
  isMoving: boolean = false;
  slowMovementSpeed: number = 500;

  // Ghost Properties
  initGhostX!: number;
  initGhostY!: number;

  constructor(private services: GameService) {
    document.title = this.title;
    this.gameMap = services.map;
  }

  ngOnInit() {
    let map = this.gameMap;

    //Initial pacman coordinate (20,8)
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i]['length']; j++) {
        if (map[i][j] === 5) {
          this.initPacmanX = i;
          this.initPacmanY = j;
        }
      }
    }

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

// Move pacman based on current direction
  movePacman() {
    let nextX = this.initPacmanX;
    let nextY = this.initPacmanY;
    let oldX = this.initPacmanX;
    let oldY = this.initPacmanY;
    switch (this.pacmanMove) {
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

    let nextCell = this.gameMap[nextX][nextY];
    if (nextCell == this.wall) {
      // Hit a wall, stop movement
      this.stopPacman();
    } else if (nextCell == this.ghost) {
      this.pacmanDies();
    } else {
      // Move pacman to next cell
      this.initPacmanX = nextX;
      this.initPacmanY = nextY;
      this.pacmanMoved(nextX, nextY, oldX, oldY);
      // this.pacmanReplaced(oldX, oldY);
      this.scoreUpdate(nextCell);
    }
  }

  // Start slow movement interval
  startSlowMovement() {
    if (!this.isMoving) {
      this.isMoving = true;
      this.slowMovementInterval = setInterval(() => {
        this.movePacman();
      }, this.slowMovementSpeed);
    }
  }

  // Change pacman direction and start slow movement interval
  changeDirection(direction: number) {
    this.pacmanMove = direction;
    this.stopPacman();
    this.startSlowMovement();
  }

  // Stop all movement intervals
  stopPacman() {
    clearInterval(this.slowMovementInterval);
    this.isMoving = false;
  }

  // Handle keyboard events
  @HostListener('window:keydown', ['$event'])
  controlKeyboardEvent(event: { keyCode: number; }) {
    switch (event.keyCode) {
      case 37: // Left Arrow Key
        this.changeDirection(4);
        this.gameFinished = false;
        break;
      case 38: // Up Arrow Key
        this.changeDirection(1);
        this.gameFinished = false;
        break;
      case 39: // Right Arrow Key
        this.changeDirection(2);
        this.gameFinished = false;
        break;
      case 40: // Down Arrow Key
        this.changeDirection(3);
        this.gameFinished = false;
        break;
      default:
        // Stop all movement if any other key is pressed
        this.stopPacman();
        break;
    }
  }


  //Moving Pacman around with arrow keys and replacing any cell with coins with an empty road
  pacmanMoved(nextX: any, nextY: any, oldX: any, oldY: any) {
    this.gameMap[nextX][nextY] = 5; // Moving Pacman around with arrow keys
    this.gameMap[oldX][oldY] = 2; //Replacing the pacman with empty road
  }

  // If pacman meet a ghost he dies (not finished)
  pacmanDies() {
    this.gameFinished = true;
    this.stopPacman();
  }

  //update the score by adding points for any coin and big coin
  scoreUpdate(step: any) {
    if (step == this.coin) {
      this.totalScore = this.totalScore + this.eatCoin;
    } else if (step == this.bigCoin) {
      this.totalScore = this.totalScore + this.eatBigCoin;
    }
  }


}
