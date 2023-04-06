import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  players=[
    {username:'Suela', score:'12555'},
    {username:'Suela', score:'12555'},
    {username:'Suela', score:'12555'},
    {username:'Suela', score:'12555'},
    {username:'Suela', score:'12555'},
    {username:'Suela', score:'12555'},
    {username:'Suela', score:'12555'},
    {username:'Suela', score:'12555'},
    {username:'Suela', score:'12555'},
    {username:'Suela', score:'12555'}
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
