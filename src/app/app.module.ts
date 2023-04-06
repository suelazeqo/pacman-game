import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PacmanGameComponent } from './game/pacman-game/pacman-game.component';
import { HomeComponent } from './home/home/home.component';
import { LeaderboardComponent } from './home/leaderboard/leaderboard.component';

@NgModule({
  declarations: [
    AppComponent,
    PacmanGameComponent,
    HomeComponent,
    LeaderboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
