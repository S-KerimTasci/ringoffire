import { Component, OnInit, inject } from '@angular/core';
import { Game } from '../models/game';
import { MatDialog, } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Router } from '@angular/router';
import { Firestore, collectionData, collection, onSnapshot, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  game: Game;
  currentCard: string = '';
  firestore: Firestore = inject(Firestore);

  unsubGame;

  items$;
  item;

  constructor(public dialog: MatDialog, private router: Router) { 
    // const itemCollection = collection(this.firestore, 'games');
    // this.item$ = collectionData(itemCollection);

    this.unsubGame = onSnapshot( this.getGameRef(), (list) => {
      list.forEach(element => {
        console.log('Game Update' +  JSON.stringify(element))
      });
    })

    this.items$ = collectionData(this.getGameRef());
    this.item = this.items$.subscribe( (list) => {
      list.forEach(element => {
        console.log('Game Update' +  JSON.stringify(element))
      });
    })
  };

  ngonDestroy(){
    this.unsubGame();
    this.item.unsubscirbe();
  }
  

  getGameRef(){
    return collection(this.firestore, 'games');
  }

  getSingleDocRef(colId : string, docId: string){
    return doc(collection(this.firestore, colId), docId);
  }


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
          if (this.game.stack.length == 0) {
            this.router.navigateByUrl('/end')
          }
          console.log(this.game.stack)
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


