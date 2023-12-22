import { Component } from '@angular/core';
import { Game } from '../models/game';
import { Router } from '@angular/router';

@Component({
  selector: 'app-end-screen',
  templateUrl: './end-screen.component.html',
  styleUrl: './end-screen.component.scss'
})
export class EndScreenComponent {

  game: Game;

  constructor(private router: Router) { };

  newGame() {
    this.router.navigateByUrl('/game')
  }

}
