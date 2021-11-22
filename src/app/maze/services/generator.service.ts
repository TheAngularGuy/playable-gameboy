import { Injectable } from '@angular/core';
import { CellModel } from '../models/Cell';
import { SolverService } from './solver.service';
import { UtilsService } from '../../services/utils.service';

@Injectable()
export class GeneratorService {
  private width: number = 0;
  private height: number = 0;
  private grid: CellModel[][] = [];
  private depth: number = 0;

  constructor(
    private readonly mazeSolver: SolverService,
    private readonly utils: UtilsService,
  ) {}

  getMaze(width: number = 32, height: number = 32) {
    this.width = width;
    this.height = height;

    this.initChamber();
    this.recursiveDivision();
    const end = this.mazeSolver.getMaxDepth(this.grid);
    this.grid[end.y][end.x].end = true;
    this.depth = end.depth;
    return this.grid;
  }

  getDepth() {
    return this.depth;
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
    this.grid[0][0].start = true;
  }

  private recursiveDivision() {
    if (this.utils.getRandomIntBetween(0, 1) === 1) {
      this.divideY(0, 0, this.width, this.height);
    } else {
      this.divideX(0, 0, this.width, this.height);
    }
  }

  private divideY(minx: number, miny: number, maxx: number, maxy: number) {
    if (maxy - miny <= 1 || maxx - minx <= 1) {
      return;
    }
    const y = this.utils.getRandomIntBetween(miny + 1, maxy - 1);
    const openX = this.utils.getRandomIntBetween(minx, maxx - 1);
    for (let x = minx; x < maxx; x++) {
      if (x !== openX) {
        this.grid[y][x].top = true;
        this.grid[y - 1][x].bottom = true;
      }
    }
    this.divideX(minx, miny, maxx, y), this.divideX(minx, y, maxx, maxy);
  }

  private divideX(minx: number, miny: number, maxx: number, maxy: number) {
    if (maxx - minx <= 1 || maxy - miny <= 1) {
      return;
    }
    const x = this.utils.getRandomIntBetween(minx + 1, maxx - 1);
    const openY = this.utils.getRandomIntBetween(miny, maxy - 1);
    for (let y = miny; y < maxy; y++) {
      if (y !== openY) {
        this.grid[y][x].left = true;
        this.grid[y][x - 1].right = true;
      }
    }
    this.divideY(minx, miny, x, maxy), this.divideY(x, miny, maxx, maxy);
  }
}
