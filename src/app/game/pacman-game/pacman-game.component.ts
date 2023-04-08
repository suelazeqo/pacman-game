import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {GameService} from "../../services/game.service";
import {GhostService} from "../ghost.service";
import {Subscription} from "rxjs";
import {PopupDialogComponent} from "../../popup/popup-dialog/popup-dialog.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pacman-game',
  templateUrl: './pacman-game.component.html',
  styleUrls: ['./pacman-game.component.css']
})
export class PacmanGameComponent implements OnInit{

  title = 'Pacman Game';
  totalScore: number = 0;
  gameMap!: Array<Array<number>>;
  gameStarted: boolean = false;
  eatCoin: number = 10;
  eatBigCoin = 40;
  lives = 3;
  secondLive: boolean = false;
  thirdLive: boolean = false;
  gameOver: boolean = false;
  // username: string = '';

  //Members of map
  wall: number = 0;
  coin: number = 1;
  road: number = 2;
  ghost: number = 3 || 6;
  bigCoin: number = 4;
  pacman: number = 5;

  // Pacman properties
  pacmanMove: number = 2; // 1 ==> up, 2==>right, 3==>down, 4==>left
  initPacmanX!: number;
  initPacmanY!: number;
  firstMovementInterval: any;
  secondMovementInterval: any;
  isMoving: boolean = false;
  slowMovementSpeed: number = 500;

  //Ghost eat Pocman, receive information form ghost service
  isLevelFinished!: boolean;
  levelFinishedSubscription!: Subscription;

  @ViewChild('modal') modal!: PopupDialogComponent;
  username: string = '';

  constructor(private services: GameService,
              private ghostService: GhostService,
              private router: Router) {
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

    //Init ghost random movement
    this.ghostService.moveGhostRandomly();
    this.ghostService.moveBlueGhostRandomly();

    //Ghost eat Pocman, receive information form ghost service
    this.isLevelFinished = this.ghostService.getIsGameFinished();
    this.levelFinishedSubscription = this.ghostService.gameFinished$.subscribe(
      (value) => {
        this.isLevelFinished = value;
        this.gameStarted = false;
        this.pacmanDies();
        setTimeout(()=>{
          this.showModal();
        },1000)
      }
    );
  }

  // Return the pink ghost move
  getGhostNumber(): number {
    return this.ghostService.getGhostNumber();
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
      // } else if (nextCell == 3 || nextCell == 6) {
      //   this.pacmanDies();
    } else {
      // Move pacman to next cell
      this.initPacmanX = nextX;
      this.initPacmanY = nextY;
      this.pacmanMoved(nextX, nextY, oldX, oldY);
      this.scoreUpdate(nextCell);
    }
  }

  // Start slow movement interval
  startPocmanMovement() {
    if (!this.isMoving) {
      this.isMoving = true;
      this.firstMovementInterval = setInterval(() => {
        this.movePacman();
      }, this.slowMovementSpeed);

      if (this.secondLive) {
        console.log('second interval started')
        this.secondMovementInterval = setInterval(() => {
          this.movePacman();
        }, this.slowMovementSpeed);
      }
    }
  }

  // Change pacman direction and start slow movement interval
  changeDirection(direction: number) {
    this.pacmanMove = direction;
    this.stopPacman();
    this.startPocmanMovement();
  }

  // Stop all movement intervals
  stopPacman() {
    clearInterval(this.firstMovementInterval);
    this.isMoving = false;
  }

  // Handle keyboard events
  @HostListener('window:keydown', ['$event'])
  controlKeyboardEvent(event: { keyCode: number; }) {
    switch (event.keyCode) {
      case 37: // Left Arrow Key
        this.changeDirection(4);
        this.gameStarted = true;
        this.ghostService.moveGhostRandomly();
        this.ghostService.moveBlueGhostRandomly();
        break;
      case 38: // Up Arrow Key
        this.changeDirection(1);
        this.gameStarted = true;
        this.ghostService.moveGhostRandomly();
        this.ghostService.moveBlueGhostRandomly();
        break;
      case 39: // Right Arrow Key
        this.changeDirection(2);
        this.gameStarted = true;
        this.ghostService.moveGhostRandomly();
        this.ghostService.moveBlueGhostRandomly();
        break;
      case 40: // Down Arrow Key
        this.changeDirection(3);
        this.gameStarted = true;
        this.ghostService.moveGhostRandomly();
        this.ghostService.moveBlueGhostRandomly();
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
    console.log('Pocman Dies', this.lives, 'second live : ', this.secondLive, "Game Started", this.gameStarted)
    // Pacman Die for first time
    this.pacmanMove = 5;
    // this.stopPacman();
    // Remove one live from pacman lives
    // this.lives -= 1;
    // // Check if there are more lives, if yes restart the game
    // if(this.lives = 2){
    //   this.secondLive = true;
    // }else if(this.lives = 1){
    //   this.thirdLive = true;
    // }
    // else{
    //   this.gameOver = true;
    // }
    // console.log('Pocman Dies', this.lives, 'second live : ', this.secondLive)
  }

  //update the score by adding points for any coin and big coin
  scoreUpdate(step: any) {
    if (step == this.coin) {
      this.totalScore = this.totalScore + this.eatCoin;
    } else if (step == this.bigCoin) {
      this.totalScore = this.totalScore + this.eatBigCoin;
    }
  }

  showModal() {
    this.modal.show();
  }

  submit() {
    this.modal.hide();
    console.log(this.username)
    this.router.navigate(['/'])
  }

}
