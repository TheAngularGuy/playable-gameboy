import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { ButtonsEventsService } from "./services/buttons-events.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  constructor(private buttonsEventsService: ButtonsEventsService) { }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.preventDefault();
    switch (event.code) {
      case 'Escape':
        return this.buttonsEventsService.buttonClick.next('B');
      case 'Enter':
        return this.buttonsEventsService.buttonClick.next('A');

      case 'KeyW':
      case 'ArrowUp':
        return this.buttonsEventsService.buttonClick.next('TOP');
      case 'KeyD':
      case 'ArrowRight':
        return this.buttonsEventsService.buttonClick.next('RIGHT');
      case 'KeyS':
      case 'ArrowDown':
        return this.buttonsEventsService.buttonClick.next('BOTTOM');
      case 'KeyA':
      case 'ArrowLeft':
        return this.buttonsEventsService.buttonClick.next('LEFT');
    }
  }
}
