import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {GameService} from "../../services/game.service";
import {GhostService} from "../ghost.service";
import {Subscription} from "rxjs";
import {PopupDialogComponent} from "../../popup/popup-dialog/popup-dialog.component";
import {Router} from "@angular/router";
import {FirebaseService} from "../../services/firebase.service";

@Component({
  selector: 'app-pacman-game',
  templateUrl: './pacman-game.component.html',
  styleUrls: ['./pacman-game.component.css']
})
export class PacmanGameComponent implements OnInit {

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
  slowMovementSpeed: number = 200;

  //Ghost eat Pocman, receive information form ghost service
  isLevelFinished!: boolean;
  levelFinishedSubscription!: Subscription;

  initGhostX!: number;
  initGhostY!: number;
  initGhostBlueX!: number;
  initGhostBlueY!: number;
  arrLives = [];

  @ViewChild('modal') modal!: PopupDialogComponent;
  username: string = '';

  constructor(private services: GameService,
              private ghostService: GhostService,
              private router: Router,
              private firebaseService: FirebaseService) {
    document.title = this.title;
    this.gameMap = services.map;
  }

  ngOnInit() {
    this.initializeComponent();
    this.ghostService.startGhostMovement();
    this.ghostService.startBlueGhostMovement();

  }

  initializeComponent() {
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

    //Ghost eat Pocman, receive information form ghost service
    this.isLevelFinished = this.ghostService.getIsGameFinished();
    this.levelFinishedSubscription = this.ghostService.gameFinished$.subscribe(
      (value) => {
        if (value) {
          console.log(this.lives)
          this.lives--;
          if (this.lives > 0) {
            this.pacmanMove = 5;
            this.respawnPacman();
          } else {
            setTimeout(() => {
              this.showModal();
            }, 1000)
          }
        }
      }
    );
  }

  respawnPacman() {
    this.startPocmanMovement()
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
    if (nextY > 18) {
      console.log(nextY)
      nextY = 0;
    }
    if (nextY < 0) {
      nextY = 18
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

      // if (this.secondLive) {
      //   console.log('second interval started')
      //   this.secondMovementInterval = setInterval(() => {
      //     this.movePacman();
      //   }, this.slowMovementSpeed);
      // }
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
        this.ghostService.startGhostMovement();
        this.ghostService.startBlueGhostMovement();
        break;
      case 38: // Up Arrow Key
        this.changeDirection(1);
        this.gameStarted = true;
        this.ghostService.startGhostMovement();
        this.ghostService.startBlueGhostMovement();
        break;
      case 39: // Right Arrow Key
        this.changeDirection(2);
        this.gameStarted = true;
        this.ghostService.startGhostMovement();
        this.ghostService.startBlueGhostMovement();
        ;
        break;
      case 40: // Down Arrow Key
        this.changeDirection(3);
        this.gameStarted = true;
        this.ghostService.startGhostMovement();
        this.ghostService.startBlueGhostMovement();
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
    let id = Math.random().toString();
    this.router.navigate(['/'])
    this.firebaseService.addNewUser(id, this.username, this.totalScore)
  }


}
