import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home/home.component";
import {PacmanGameComponent} from "./game/pacman-game/pacman-game.component";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "game",
    component: PacmanGameComponent
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
