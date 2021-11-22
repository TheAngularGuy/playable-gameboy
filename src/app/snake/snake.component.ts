import { ChangeDetectionStrategy, Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SnakeGridComponent } from './components/snake-grid.component';
import { Directions } from './models/Directions';
import { SnakeService } from './services/snake.service';
import { CellModel } from './models/Cell';
import { BehaviorSubject, Subscription, tap, interval, takeUntil } from 'rxjs';
import { SnakeCell } from './models/SnakeCell';
import { BtnKey } from '../models/BtnKey';
import { ButtonsEventsService } from '../services/buttons-events.service';

@Component({
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnakeComponent implements OnInit, OnDestroy {
  static INTERVAL = 120;

  grid: CellModel[][] = [];
  snake$ = new BehaviorSubject<SnakeCell[]>([]);
  apple$ = new BehaviorSubject<[number, number]>([0, 0]);
  gameOngoing$ = new BehaviorSubject<boolean>(false);
  score$ = new BehaviorSubject<number>(0);
  bestScore$ = new BehaviorSubject<number>(
    JSON.parse(window.localStorage.getItem('bestSnakeScore') || JSON.stringify(0))
  );

  subscription: Subscription | undefined;
  direction: Directions = 'RIGHT';
  directionDemanded: Directions | undefined;

  constructor(
    private readonly snakeService: SnakeService,
    private readonly buttonsEventsService: ButtonsEventsService,
    private readonly router: Router,
  ) {
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.buttonsEventsService.buttonClick$.pipe(
      tap((key: BtnKey) => {
        if (key === 'B') {
          this.goBack();
        } else if (key === 'A') {
          this.startGame();
        }
        this.keyCodeToMovementMapper(key);
      }),
    ).subscribe();
    this.startGame();
  }

  startGame() {
    if (this.gameOngoing$.getValue()) {
      return;
    }
    this.initGame();

    const ateAppleSub = this.snakeService.ateApple$.pipe(
      tap(() => this.increaseScore()),
    ).subscribe();
    const diedSub = this.snakeService.snakeDied$.pipe(
      tap(() => this.gameOngoing$.next(false)),
    ).subscribe();
    const intervalSub = interval(SnakeComponent.INTERVAL).pipe(
      tap(() => this.direction = this.directionDemanded || this.direction),
      tap(() => this.moveSnake()),
      takeUntil(this.snakeService.snakeDied$),
    ).subscribe();
    this.subscription?.add(intervalSub);
    this.subscription?.add(diedSub);
    this.subscription?.add(ateAppleSub);
  }

  private increaseScore() {
    let bestScore = this.bestScore$.getValue();
    let score = this.score$.getValue();
    score++;
    this.score$.next(score);
    if (score > bestScore) {
      this.bestScore$.next(score);
      window.localStorage.setItem('bestSnakeScore', JSON.stringify(score));
    }
  }

  private initGame() {
    this.grid = this.snakeService.getGrid(...[20, 20]);
    this.snake$.next(this.snakeService.getSnake());
    this.apple$.next(this.snakeService.getApple());
    this.directionDemanded = undefined;
    this.direction = 'RIGHT';
    this.gameOngoing$.next(true);
    this.score$.next(0);
  }

  private moveSnake() {
    this.snakeService.move(this.direction);

    this.snake$.next(this.snakeService.getSnake());
    this.apple$.next(this.snakeService.getApple());
  }

  private goBack() {
    this.router.navigateByUrl('/');
  }

  private keyCodeToMovementMapper(code: string) {
    switch (code) {
      case 'TOP':
        if (this.direction !== 'BOTTOM') {
          this.directionDemanded = 'TOP';
        }
        return;
      case 'RIGHT':
        if (this.direction !== 'LEFT') {
          this.directionDemanded = 'RIGHT';
        }
        return;
      case 'BOTTOM':
        if (this.direction !== 'TOP') {
          this.directionDemanded = 'BOTTOM';
        }
        return;
      case 'LEFT':
        if (this.direction !== 'RIGHT') {
          this.directionDemanded = 'LEFT';
        }
        return;
    }
  }

}

@NgModule({
  declarations: [
    SnakeComponent,
    SnakeGridComponent,
  ],
  providers: [
    SnakeService,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: SnakeComponent,
    }]),
  ],
})
export class SnakeModule {
}
