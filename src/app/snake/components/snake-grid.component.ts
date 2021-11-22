import { Component, OnInit, ChangeDetectionStrategy, Input, TrackByFunction } from '@angular/core';
import { CellModel } from '../models/Cell';
import { SnakeCell } from '../models/SnakeCell';

@Component({
  selector: 'app-snake-grid',
  templateUrl: './snake-grid.component.html',
  styleUrls: ['./snake-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnakeGridComponent implements OnInit {
  @Input() apple: [number, number] | undefined | null;
  @Input() grid: CellModel[][] | undefined | null;
  @Input() set snake(s: SnakeCell[] | undefined | null) {
    if (!s) {
      return;
    }
    this.snakeHashmap.clear();
    for (const cell of s) {
      let type: 'HEAD' | 'TAIL' | 'BODY' = 'BODY';
      if (cell.tail) {
        type = 'TAIL';
      } else if (cell.head) {
        type = 'HEAD';
      }
      this.snakeHashmap.set(`${cell.x},${cell.y}`, type);
    }
  }

  snakeHashmap = new Map<string, 'HEAD' | 'TAIL' | 'BODY'>();

  constructor() { }

  ngOnInit(): void {
  }

  trackByFn: TrackByFunction<CellModel> = (index: number, cell: CellModel) => {
    return cell.id;
  };

}
