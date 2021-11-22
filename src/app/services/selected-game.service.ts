import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GAMES } from '../constants/games.constant';
import { Game } from '../models/Game';

@Injectable({
  providedIn: 'root',
})
export class SelectedGameService {
  selectedGame$ = new BehaviorSubject<Game>(
    JSON.parse(window.localStorage.getItem('selectedGame') || JSON.stringify(GAMES[0])));

  constructor() {
  }

  changeGame(direction: 'LEFT' | 'RIGHT' = 'RIGHT') {
    const game = this.selectedGame$.getValue();
    const index = GAMES.findIndex(el => el.id === game.id);

    if (direction === 'RIGHT') {
      if (index === GAMES.length - 1) {
        this.setGame(GAMES[0]);
        return;
      }
      this.setGame(GAMES[index + 1]);
    } else {
      if (index === 0) {
        this.setGame(GAMES[GAMES.length - 1]);
        return;
      }
      this.setGame(GAMES[index - 1]);
    }
  }

  private setGame(game: Game) {
    this.selectedGame$.next(game);

    window.localStorage.setItem('selectedGame', JSON.stringify(game));
  }
}
