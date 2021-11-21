import { CellModel } from './Cell';
import { PlayerLocation } from './PlayerLocation';

export interface Room {
  id: string;
  depth: number;
  mazeGrid: CellModel[][];
  state: {
    finished: boolean;
    paused: boolean;
  };
  userLocation: PlayerLocation;
}
