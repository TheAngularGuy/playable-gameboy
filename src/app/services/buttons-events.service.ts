import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BtnKey } from '../models/Btn';

@Injectable()
export class ButtonsEventsService {
  buttonClick = new Subject<BtnKey>();
}
