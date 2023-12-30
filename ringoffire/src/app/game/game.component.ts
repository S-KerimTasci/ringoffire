import { Component, OnInit, inject } from '@angular/core';
import { Game } from '../models/game';
import { MatDialog, } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collectionData, collection, onSnapshot, doc, addDoc } from '@angular/fire/firestore';
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

  unsubGame(){};

  items$;
  item;

  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute) {
    // const itemCollection = collection(this.firestore, 'games');
    // this.item$ = collectionData(itemCollection);

    // this.unsubGame = onSnapshot( this.getGameRef(), (list) => {
    //   list.forEach(element => {
    //     console.log('Game Update' +  element)
    //   });
    // })

    this.items$ = collectionData(this.getGameRef());
    this.item = this.items$.subscribe( (list) => {
      list.forEach(element => {
        console.log('Game Update' +  element)
      });
    })
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

        this.game.currentPlayer = element.currentPlayer,
        this.game.playedCards = element.playedCards;
        this.game.stack = element.stack;
        this.game.players = element.players;
      })

    })

  }

  async newGame() {
    this.game = new Game();
    console.log(this.game)
    //await addDoc(this.getGameRef(), this.game.toJSON())
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


