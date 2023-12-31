import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collectionData, collection, onSnapshot, doc, addDoc } from '@angular/fire/firestore';
import { Game } from '../models/game';
import { GameComponent } from '../game/game.component'; 

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})

export class StartScreenComponent {

  constructor(private router: Router, private injector: Injector) { }

  async newGame() {
    const gameComponent = this.injector.get(GameComponent);
    let game = new Game
    await addDoc(gameComponent.getGameRef(), game.toJSON()).then( (gameInfo) => {
      this.router.navigateByUrl('/game/' + gameInfo.id)
    })
    
  }
}
