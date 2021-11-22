import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonsEventsService } from '../services/buttons-events.service';
import { Subscription, tap } from 'rxjs';
import { BtnKey } from '../models/BtnKey';
import { PreferencesService } from './preferences.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferencesComponent implements OnInit, OnDestroy {
  sub: Subscription | undefined;

  constructor(
    public buttonsEventsService: ButtonsEventsService,
    public preferencesService: PreferencesService,
  ) {
  }

  ngOnInit() {
    this.sub = this.buttonsEventsService.buttonClick$.pipe(
      tap((key: BtnKey) => {
        if (key === 'LEFT' || key === 'RIGHT') {
          this.toggleBlur();
        }
      }),
    ).subscribe();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  toggleBlur() {
    this.preferencesService.toggleBlur();
  }

}
