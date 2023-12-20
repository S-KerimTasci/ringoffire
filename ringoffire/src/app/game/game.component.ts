import { Component, OnInit } from '@angular/core';
import { Game } from '../models/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  game : Game;
  currentCard : string = '';

  constructor() {};

  ngOnInit(): void {
    this.newGame();
  }

  newGame(){
    this.game = new Game();
    console.log(this.game)
  }

  takeCard(){
    if (!this.pickCardAnimation) {
      
    this.currentCard = this.game.stack.pop();
    this.pickCardAnimation = true;

    

    setTimeout(() => {
      this.game.playedCards.push(this.currentCard)
      this.pickCardAnimation = false;
    }, 1250);
  }

}

}
