import { Component, OnInit } from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  players:any;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.getUsers().then()
  }

  // This method takes the users form firebase and sort the players by score in descending order,
  // after take the first 10 players
  async getUsers() {
    this.players = await this.firebaseService.getAllUsers();
    this.players.sort((a:any, b:any) => b.score - a.score);
    this.players = this.players.slice(0, 10);
  }
}
