import { Injectable } from '@angular/core';
import { AvailableMovesModel } from '../models/AvailableMoves';
import { CellModel } from '../models/Cell';
import { MaxDepthPoint } from '../models/MaxDepthPoint';

@Injectable()
export class SolverService {
  private width: number = 0;
  private height: number = 0;
  private grid: CellModel[][] = [];
  private visitedCells: number[] = [];
  private end: {
    depth: number;
    x: number;
    y: number;
  } | undefined;

  constructor() {}

  getMaxDepth(
    grid: CellModel[][],
    startX: number = 0,
    startY: number = 0
  ): MaxDepthPoint {
    if (!grid || !grid.length) {
      throw new Error('grid.length null');
    }
    this.end = { depth: 0, x: 0, y: 0 };
    this.visitedCells = [];
    this.grid = grid;
    this.width = grid[0].length;
    this.height = grid.length;
    this.depthFirst(startX, startY, 0);
    return this.end;
  }

  private depthFirst(x: number, y: number, depth: number) {
    this.visitedCells.push(this.grid[y][x].id);
    if (depth > this.end!.depth) {
      this.end = {
        depth,
        x,
        y
      };
    }
    if (Math.floor(Math.random() * 2) === 1) {
      this.moveUp(x, y, depth);
      this.moveDown(x, y, depth);
      this.moveRight(x, y, depth);
      this.moveleft(x, y, depth);
    } else {
      this.moveleft(x, y, depth);
      this.moveRight(x, y, depth);
      this.moveDown(x, y, depth);
      this.moveUp(x, y, depth);
    }
  }

  private moveUp(x: number, y: number, depth: number) {
    const moves = this.availableMoves(x, y);
    if (moves.top) {
      this.depthFirst(x, y - 1, depth + 1);
    }
  }

  private moveRight(x: number, y: number, depth: number) {
    const moves = this.availableMoves(x, y);
    if (moves.right) {
      this.depthFirst(x + 1, y, depth + 1);
    }
  }

  private moveDown(x: number, y: number, depth: number) {
    const moves = this.availableMoves(x, y);
    if (moves.bottom) {
      this.depthFirst(x, y + 1, depth + 1);
    }
  }

  private moveleft(x: number, y: number, depth: number) {
    const moves = this.availableMoves(x, y);
    if (moves.left) {
      this.depthFirst(x - 1, y, depth + 1);
    }
  }

  private availableMoves(x: number, y: number): AvailableMovesModel {
    const moves = {
      top:
        y !== 0 &&
        !this.isVisited(this.grid[y - 1][x].id) &&
        !this.grid[y][x].top,
      left:
        x !== 0 &&
        !this.isVisited(this.grid[y][x - 1].id) &&
        !this.grid[y][x].left,
      bottom:
        y !== this.height - 1 &&
        !this.isVisited(this.grid[y + 1][x].id) &&
        !this.grid[y][x].bottom,
      right:
        x !== this.width - 1 &&
        !this.isVisited(this.grid[y][x + 1].id) &&
        !this.grid[y][x].right
    };
    return moves;
  }

  private isVisited(id: number) {
    return this.visitedCells.includes(id);
  }
}
