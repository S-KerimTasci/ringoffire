import { Component, OnInit, inject, Injectable } from '@angular/core';
import { Game } from '../models/game';
import { MatDialog, } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collectionData, collection, onSnapshot, doc, addDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  game: Game;
  firestore: Firestore = inject(Firestore);
  gameID : string;

  unsubGame(){};

  items$;
  item;

  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute) {
    // const itemCollection = collection(this.firestore, 'games');
    // this.item$ = collectionData(itemCollection);

    this.unsubGame = onSnapshot( this.getGameRef(), (list) => {
      list.forEach(element => {
        console.log(element.data())
      });
    })

    // this.items$ = collectionData(this.getGameRef());
    // this.item = this.items$.subscribe( (list) => {
    //   list.forEach(element => {
    //     console.log(element)
    //   });
    // })
  };

  ngOnDestroy() {
    this.unsubGame();
    this.item.unsubscribe();
  }


  getGameRef() {
    return collection(this.firestore, 'games');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }


  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params)
      
      this.unsubGame = onSnapshot(this.getSingleDocRef("games", params['id']), (element : any) => {
        console.log('Game ID: ' + element.id);
        this.gameID = element.id;

        this.game.currentPlayer = element.data().currentPlayer,
        this.game.playedCards = element.data().playedCards;
        this.game.stack = element.data().stack;
        this.game.players = element.data().players;
        this.game.pickCardAnimation = element.data().pickCardAnimation;
        this.game.currentCard = element.data().currentCard;
      })
    })
  }

  async newGame() {
    this.game = new Game();
    console.log(this.game)
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      if (this.game.players.length > 1) {

        this.game.currentCard = this.game.stack.pop();
        this.game.pickCardAnimation = true;

        this.game.currentPlayer++;
        this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
        this.updateGame();

        setTimeout(() => {
          this.game.playedCards.push(this.game.currentCard)
          this.game.pickCardAnimation = false;
          this.updateGame();
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
          this.updateGame();
        }

      });
    } else {
      alert('Maximum 6 players')
    }
  }

  updateGame(){
    updateDoc(this.getSingleDocRef('games', this.gameID), this.game.toJSON() ).catch((err) => {
      console.log(err);
      
    })
  }
}


