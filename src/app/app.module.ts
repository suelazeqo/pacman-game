import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PacmanGameComponent } from './game/pacman-game/pacman-game.component';
import { HomeComponent } from './home/home/home.component';
import { LeaderboardComponent } from './home/leaderboard/leaderboard.component';
import { PopupDialogComponent } from './popup/popup-dialog/popup-dialog.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";

import { AngularFireModule } from "@angular/fire/compat";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import { environment } from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    PacmanGameComponent,
    HomeComponent,
    LeaderboardComponent,
    PopupDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
