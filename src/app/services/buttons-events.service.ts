import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BtnKey } from '../models/BtnKey';

@Injectable({
  providedIn: 'root',
})
export class ButtonsEventsService {
  buttonClick$ = new Subject<BtnKey>();

  constructor() { }
}
