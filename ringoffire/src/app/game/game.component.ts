import { Component, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { MatDialog, } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  game: Game;
  currentCard: string = '';

  constructor(public dialog: MatDialog) { };


  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
    console.log(this.game)
  }

  takeCard() {


    if (!this.pickCardAnimation) {
      if (this.game.players.length > 1) {

        this.currentCard = this.game.stack.pop();
        this.pickCardAnimation = true;

        this.game.currentPlayer++;
        this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

        setTimeout(() => {
          this.game.playedCards.push(this.currentCard)
          this.pickCardAnimation = false;
        }, 1250);
      }
      
      else {
        alert('Please add 2-6 players before starting the game')
      }

    }

  }

  openDialog(): void {
    if (this.game.players.length < 6) {
      const dialogRef = this.dialog.open(DialogAddPlayerComponent, {

      });

      dialogRef.afterClosed().subscribe((name: string) => {
        if (name && name.length > 0) {
          this.game.players.push(name)
        }

      });
    } else {
      alert('Maximum 6 players')
    }

  }
}


