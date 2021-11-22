import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  disableBlur$ = new BehaviorSubject<boolean>(
    JSON.parse(window.localStorage.getItem('blur') || 'false'));
  openSettings$ = new BehaviorSubject(false);

  constructor() { }

  toggleBlur() {
    const newVal = !this.disableBlur$.getValue();
    this.disableBlur$.next(newVal);
    window.localStorage.setItem('blur', JSON.stringify(newVal));
  }

  setSettingsPanelBoolean(bool: boolean) {
    this.openSettings$.next(bool);
  }
}
