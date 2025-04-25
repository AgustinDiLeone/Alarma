import { Component } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [],
})
export class HomePage {
  alarmState: boolean = false;
  correctPassword: string = '1234'; // Aquí usas la contraseña que definas.

  activarAlarma() {
    if (this.alarmState) {
      this.askForPassword(); // Función para pedir la contraseña.
    } else {
      this.activateAlarm(); // Activa la alarma.
    }
  }

  activateAlarm() {
    this.alarmState = true;
    this.triggerAlarmSounds();
  }

  deactivateAlarm() {
    this.alarmState = false;
    this.triggerDeactivationSounds();
  }

  askForPassword() {
    // Función para mostrar el campo de contraseña y verificarlo.
  }

  triggerAlarmSounds() {
    // Aquí activas los sonidos de la alarma y la vibración/luz.
  }

  triggerDeactivationSounds() {
    // Sonidos y luz al intentar desactivar con contraseña incorrecta.
  }
}
