import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Subscription, tap } from 'rxjs';
import { BtnKey } from '../models/Btn';
import { ButtonsEventsService } from '../services/buttons-events.service';

@Component({
  templateUrl: './gameboy.component.html',
  styleUrls: ['./gameboy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameboyComponent implements OnInit, OnDestroy {
  sub: Subscription | undefined;
  openSettings$ = new BehaviorSubject(false);
  disableBlur$ = new BehaviorSubject(
    !!JSON.parse(window.localStorage.getItem('blur') || 'false'));

  constructor(
    public buttonsEventsService: ButtonsEventsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.sub = this.buttonsEventsService.buttonClick.pipe(
      tap((key: BtnKey) => {
        if (key === 'A' || key === 'START') {
          this.startGame();
        } else if (key === 'B') {
          this.openSettings$.next(false);
        } else if (key === 'SELECT') {
          this.openSettings();
        } else if (key === 'LEFT' || key === 'RIGHT') {
          this.toggleBlur();
        }
      }),
    ).subscribe();
  }

  startGame() {
    if (!this.openSettings$.getValue() && !this.router.url.includes('maze')) {
      this.router.navigateByUrl('maze');
    }
  }

  openSettings() {
    if (!this.router.url.includes('maze')) {
      this.openSettings$.next(true);
    }
  }

  toggleBlur() {
    if (this.openSettings$.getValue()) {
      const newVal = !this.disableBlur$.getValue();
      this.disableBlur$.next(newVal);
      window.localStorage.setItem('blur', JSON.stringify(newVal));
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
    RouterModule.forChild([{
      path: '',
      component: GameboyComponent,
      children: [{
        path: '',
        loadChildren: () => import('../home/home.component').then(m => m.HomeModule),
      }, {
        path: 'maze',
        loadChildren: () => import('../maze/maze.component').then(m => m.MazeModule),
      }],
    }]),
  ],
})
export class GameboyModule {}
