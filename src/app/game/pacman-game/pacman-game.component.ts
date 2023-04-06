import { Component, OnInit } from '@angular/core';
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



  // Pacman properties
  pacmanMove: number = 2; // 1 ==> up, 2==>right, 3==>down, 4==>left
  initPacmanX!:number;
  initPacmanY!:number;

  // Ghost Properties
  initGhostX!:number;
  initGhostY!:number;

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
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i]['length']; j++) {
        if (map[i][j] === 3) {
          this.initGhostX = i;
          this.initGhostY = j;
        }
      }
    }
  }
}
