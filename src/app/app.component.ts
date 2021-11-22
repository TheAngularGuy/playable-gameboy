import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { ButtonsEventsService } from './services/buttons-events.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  constructor(private buttonsEventsService: ButtonsEventsService) {
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    switch (event.code) {
      case 'Escape':
        event.preventDefault();
        return this.buttonsEventsService.buttonClick$.next('B');
      case 'Enter':
        event.preventDefault();
        return this.buttonsEventsService.buttonClick$.next('A');
      case 'KeyP':
        event.preventDefault();
        return this.buttonsEventsService.buttonClick$.next('SELECT');

      case 'KeyW':
      case 'ArrowUp':
        event.preventDefault();
        return this.buttonsEventsService.buttonClick$.next('TOP');
      case 'KeyD':
      case 'ArrowRight':
        event.preventDefault();
        return this.buttonsEventsService.buttonClick$.next('RIGHT');
      case 'KeyS':
      case 'ArrowDown':
        event.preventDefault();
        return this.buttonsEventsService.buttonClick$.next('BOTTOM');
      case 'KeyA':
      case 'ArrowLeft':
        event.preventDefault();
        return this.buttonsEventsService.buttonClick$.next('LEFT');
    }
  }
}
