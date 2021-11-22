import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UtilsService } from '../../services/utils.service';
import { CellModel } from '../models/Cell';
import { Directions } from '../models/Directions';
import { SnakeCell } from '../models/SnakeCell';

@Injectable()
export class SnakeService {
  private width: number = 0;
  private height: number = 0;
  grid: CellModel[][] = [];
  snake: SnakeCell[] = [];
  apple: [number, number] = [0, 0];
  cellToAdd: { x: number; y: number; rounds: number; }[] = [];

  ateApple$ = new Subject();
  snakeDied$ = new Subject();

  constructor(
    private utils: UtilsService,
  ) { }

  getGrid(width: number = 32, height: number = 32) {
    this.width = width;
    this.height = height;

    this.initChamber();
    return this.grid;
  }

  private initChamber() {
    this.grid = [];
    for (let y = 0; y < this.height; y++) {
      const line: CellModel[] = [];
      for (let x = 0; x < this.width; x++) {
        line.push({
          top: y === 0,
          left: x === 0,
          bottom: y === this.height - 1,
          right: x === this.width - 1,
          id: this.width * y + x,
        });
      }
      this.grid.push(line);
    }

    this.initSnake();
    this.placeRandomApple();
  }

  getApple() {
    return this.apple;
  }

  getSnake() {
    return this.snake;
  }

  private placeRandomApple(): [number, number] {
    const y = this.utils.getRandomIntBetween(0, this.grid.length - 1);
    const x = this.utils.getRandomIntBetween(0, this.grid[0].length - 1);
    if (this.snake.find(el => el.x === x && el.y === y)) {
      return this.placeRandomApple();
    }
    this.apple = [x, y];
    return this.apple;
  }

  private initSnake() {
    const snake: SnakeCell[] = [];
    for (let i = 0; i < 5; i++) {
      snake.push({
        tail: i === 0,
        id: i,
        head: i === 4,

        y: 1,
        x: i + 1,
      });
    }
    this.snake = snake.reverse();
    return snake;
  }

  move(direction: Directions) {
    switch (direction) {
      case 'TOP':
        this.moveSnakeTop();
        break;
      case 'RIGHT':
        this.moveSnakeRight();
        break;
      case 'BOTTOM':
        this.moveSnakeBottom();
        break;
      case 'LEFT':
        this.moveSnakeLeft();
        break;
    }
    this.checkIfAteApple();

    this.cellToAdd = this.cellToAdd.map(cell => {
      const newCell = {...cell};
      newCell.rounds--;
      return newCell;
    }).filter(cell => {
      return cell.rounds >= 0;
    });
  }

  private checkIfAteApple() {
    const head = this.snake[0];
    if (head.x === this.apple[0] && head.y === this.apple[1]) {
      this.cellToAdd.push({
        x: head.x,
        y: head.y,
        rounds: this.snake.length - 1,
      });
      this.placeRandomApple();
      this.ateApple$.next(true);
    }
  }

  private copyRestOfTheSnake(newSnake: SnakeCell[]): SnakeCell[] {
    for (let i = 1; i < this.snake.length; i++) {
      if (this.snake[i - 1].x === newSnake[0].x && this.snake[i - 1].y === newSnake[0].y) {
        this.snakeDied$.next(true);
        return this.snake;
      }

      newSnake[i].x = this.snake[i - 1].x;
      newSnake[i].y = this.snake[i - 1].y;
    }
    if (this.cellToAdd[0] && this.cellToAdd[0].rounds === 0) {
      newSnake.push({
        ...this.snake[this.snake.length - 1],
      });
      newSnake[newSnake.length - 2].tail = false;
    }
    return newSnake;
  }

  moveSnakeLeft() {
    const newSnake = this.snake.map((cell) => {
      return { ...cell };
    });

    newSnake[0].x -= 1;
    if (newSnake[0].x === -1) {
      newSnake[0].x = this.grid[0].length;
    }
    this.snake = this.copyRestOfTheSnake(newSnake);
    return this.snake;
  }

  moveSnakeRight() {
    const newSnake = this.snake.map((cell) => {
      return { ...cell };
    });

    newSnake[0].x += 1;
    newSnake[0].x = newSnake[0].x % this.grid[0].length;
    this.snake = this.copyRestOfTheSnake(newSnake);
    return this.snake;
  }

  moveSnakeBottom() {
    const newSnake = this.snake.map((cell) => {
      return { ...cell };
    });

    newSnake[0].y += 1;
    newSnake[0].y = newSnake[0].y % this.grid.length;
    this.snake = this.copyRestOfTheSnake(newSnake);
    return this.snake;
  }

  moveSnakeTop() {
    const newSnake = this.snake.map((cell) => {
      return { ...cell };
    });

    newSnake[0].y -= 1;
    if (newSnake[0].y === -1) {
      newSnake[0].y = this.grid.length - 1;
    }
    this.snake = this.copyRestOfTheSnake(newSnake);
    return this.snake;
  }
}
