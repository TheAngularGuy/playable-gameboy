import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, NgModule, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Subscription, tap } from 'rxjs';
import { BtnKey } from '../models/Btn';
import { ButtonsEventsService } from '../services/buttons-events.service';
import { MazeGridModule } from './components/maze-grid.component';
import { CellModel } from './models/Cell';
import { PlayerLocation } from './models/PlayerLocation';
import { GeneratorService } from './services/generator.service';
import { SolverService } from './services/solver.service';
import { UtilsService } from './services/utils.service';

@Component({
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MazeComponent implements OnInit, OnDestroy {
  static DELAY = 1800;

  perfect$ = new BehaviorSubject(false);
  completed$ = new BehaviorSubject(false);
  grid$ = new BehaviorSubject<CellModel[][]>([]);
  depth$ = new BehaviorSubject(0);
  playerLocation$ = new BehaviorSubject({ id: 0, x: 0, y: 0 });
  nbMovements$ = new BehaviorSubject(0);

  subscription: Subscription | undefined;

  constructor(
    private readonly mazeGenerator: GeneratorService,
    private readonly buttonsEventsService: ButtonsEventsService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.startGame();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  startGame() {
    this.subscription?.unsubscribe();

    this.playerLocation$.next({ id: 0, x: 0, y: 0 });
    this.grid$.next(this.mazeGenerator.getMaze(...[12, 12]));
    this.depth$.next(this.mazeGenerator.getDepth());
    this.completed$.next(false);
    this.nbMovements$.next(0);

    this.subscription = this.buttonsEventsService.buttonClick.pipe(
      tap((key: BtnKey) => {
        if (key === 'B') {
          this.goBack();
        }
        this.keyCodeToMovementMapper(key);
      }),
    ).subscribe();
  }

  goBack() {
    this.router.navigateByUrl('/');
  }

  movePlayerToNewLocation(newLocation: PlayerLocation) {
    this.nbMovements$.next(this.nbMovements$.getValue() + 1);
    this.playerLocation$.next({ ...newLocation });
    this.perfect$.next(this.depth$.getValue() === this.nbMovements$.getValue());

    // * checking if player has won
    const grid = this.grid$.getValue();
    if (grid[newLocation.y][newLocation.x].end) {
      this.completed$.next(true);
      setTimeout(() => this.startGame(), MazeComponent.DELAY);
    }
  }

  keyCodeToMovementMapper(code: string) {
    switch (code) {
      case 'TOP':
        return this.moveUp();
      case 'RIGHT':
        return this.moveRight();
      case 'BOTTOM':
        return this.moveDown();
      case 'LEFT':
        return this.moveLeft();
    }
  }

  moveUp() {
    const playerLocation = this.playerLocation$.getValue();
    const grid = this.grid$.getValue();
    const cell = grid[playerLocation.y][playerLocation.x];
    const newCell = grid[playerLocation.y - 1] && grid[playerLocation.y - 1][playerLocation.x];
    if (newCell && !cell.top) {
      this.movePlayerToNewLocation({
        id: newCell.id,
        x: playerLocation.x,
        y: playerLocation.y - 1,
      });
    }
  }

  moveDown() {
    const grid = this.grid$.getValue();
    const playerLocation = this.playerLocation$.getValue();
    const cell = grid[playerLocation.y][playerLocation.x];
    const newCell = grid[playerLocation.y + 1] && grid[playerLocation.y + 1][playerLocation.x];
    if (newCell && !cell.bottom) {
      this.movePlayerToNewLocation({
        id: newCell.id,
        x: playerLocation.x,
        y: playerLocation.y + 1,
      });
    }
  }

  moveRight() {
    const grid = this.grid$.getValue();
    const playerLocation = this.playerLocation$.getValue();
    const cell = grid[playerLocation.y][playerLocation.x];
    const newCell = grid[playerLocation.y][playerLocation.x + 1];
    if (newCell && !cell.right) {
      this.movePlayerToNewLocation({
        id: newCell.id,
        x: playerLocation.x + 1,
        y: playerLocation.y,
      });
    }
  }

  moveLeft() {
    const grid = this.grid$.getValue();
    const playerLocation = this.playerLocation$.getValue();
    const cell = grid[playerLocation.y][playerLocation.x];
    const newCell = grid[playerLocation.y][playerLocation.x - 1];
    if (newCell && !cell.left) {
      this.movePlayerToNewLocation({
        id: newCell.id,
        x: playerLocation.x - 1,
        y: playerLocation.y,
      });
    }
  }
}

@NgModule({
  declarations: [
    MazeComponent,
  ],
  providers: [
    UtilsService,
    GeneratorService,
    SolverService,
  ],
  imports: [
    CommonModule,
    MazeGridModule,
    RouterModule.forChild([{
      path: '',
      component: MazeComponent,
    }]),
  ],
})
export class MazeModule {}
