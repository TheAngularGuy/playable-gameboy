import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { BtnKey } from '../models/BtnKey';
import { ButtonsEventsService } from '../services/buttons-events.service';
import { PreferencesModule } from '../preferences/preferences.module';
import { PreferencesService } from '../preferences/preferences.service';
import {SelectedGameService} from '../services/selected-game.service';

@Component({
  templateUrl: './gameboy.component.html',
  styleUrls: ['./gameboy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameboyComponent implements OnInit, OnDestroy {
  sub: Subscription | undefined;

  get isGameOpen(): boolean {
    return this.router.url.includes('play');
  }
  get isSettingsOpen(): boolean {
    return this.preferencesService.openSettings$.getValue();
  }

  constructor(
    public buttonsEventsService: ButtonsEventsService,
    public preferencesService: PreferencesService,
    public selectedGame: SelectedGameService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.sub = this.buttonsEventsService.buttonClick$.pipe(
      tap((key: BtnKey) => {
        switch (key) {
          case 'A':
          case 'START':
            this.startGame();
            break;
          case 'B':
            this.closeSettings();
            break;
          case 'SELECT':
            this.openSettings();
            break;
          case 'LEFT':
            this.changeGame('LEFT');
            break;
          case 'RIGHT':
            this.changeGame('RIGHT');
            break;
        }
      }),
    ).subscribe();
  }

  startGame() {
    if (!this.isGameOpen && !this.isSettingsOpen) {
      const selectedGame = this.selectedGame.selectedGame$.getValue();
      this.router.navigate(['play', selectedGame.path]);
    }
  }

  changeGame(direction: 'LEFT' | 'RIGHT') {
    this.selectedGame.changeGame(direction);
  }

  closeSettings() {
    this.preferencesService.setSettingsPanelBoolean(false);
  }
  openSettings() {
    if (!this.isGameOpen) {
      this.preferencesService.setSettingsPanelBoolean(true);
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}

@NgModule({
  declarations: [
    GameboyComponent,
  ],
  imports: [
    CommonModule,
    PreferencesModule,

    // Routes
    RouterModule.forChild([{
      path: '',
      component: GameboyComponent,
      children: [{
        path: '',
        loadChildren: () => import('../home/home.component').then(m => m.HomeModule),
      }, {
        path: 'play',
        children: [{
          path: 'maze',
          loadChildren: () => import('../maze/maze.component').then(m => m.MazeModule),
        }, {
          path: 'snake',
          loadChildren: () => import('../snake/snake.component').then(m => m.SnakeModule),
        }],
      }],
    }]),
  ],
})
export class GameboyModule {}
