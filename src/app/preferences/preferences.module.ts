import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesComponent } from './preferences.component';



@NgModule({
  declarations: [
    PreferencesComponent
  ],
  exports: [
    PreferencesComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PreferencesModule { }
