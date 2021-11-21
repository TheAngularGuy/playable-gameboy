import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, TrackByFunction } from '@angular/core';
import { CellModel } from '../models/Cell';

@Component({
  selector: 'app-maze-grid',
  templateUrl: './maze-grid.component.html',
  styleUrls: ['./maze-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MazeGridComponent {
  @Input() grid: CellModel[][] | undefined | null;
  @Input() player: number | undefined | null;

  constructor() { }

  trackByFn: TrackByFunction<CellModel> = (index: number, cell: CellModel) => {
    return cell.id;
  };

}

@NgModule({
  declarations: [
    MazeGridComponent,
  ],
  exports: [
    MazeGridComponent,
  ],
  imports: [
    CommonModule,
  ],
})
export class MazeGridModule {}
