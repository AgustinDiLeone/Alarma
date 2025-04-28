import { Component, inject } from '@angular/core';
import { Router, RouteReuseStrategy } from '@angular/router';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Flashlight } from '@awesome-cordova-plugins/flashlight/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import {
  DeviceMotion,
  DeviceMotionAccelerationData,
} from '@awesome-cordova-plugins/device-motion/ngx';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import {
  IonContent,
  IonIcon,
  IonFabButton,
  IonFab,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';
import { createClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonFab, IonFabButton, CommonModule, IonContent, IonicModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Flashlight,
    Vibration,
    DeviceMotion,
  ],
})
export class HomePage {
  alarmActivated = false;
  passwordUser = '';
  private router = inject(Router);

  accelerationX: number | null = null;
  accelerationY: number | null = null;
  accelerationZ: number | null = null;
  subscription: any;

  //Sonidos
  audioIzquierda = '../../assets/sonidos/Sonidoizquierda.m4a';
  audioDerecha = '../../assets/sonidos/Sonidoderecha.m4a';
  audioVertical = '../../assets/sonidos/audioVertical.mp3';
  audioHorizontal = '../../assets/sonidos/audioHorizontal.mp3';
  audioPass = '../../assets/sonidos/wrongPass.mp3';
  audio = new Audio();

  firstAdmission = true;
  firstAdmissionFlash = true;

  currentPositionCellPhone = 'actual';
  previousPositionCellPhone = 'anterior';

  constructor(
    private flashlight: Flashlight,
    private vibration: Vibration,
    private deviceMotion: DeviceMotion,
    public navCtrl: NavController,
    private auth: AuthService
  ) {}

  ngOnInit() {}

  logoutUser() {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }

  activarAlarma() {
    Swal.fire({
      title: '¿Quieres activar la alarma?',
      icon: 'warning',
      heightAuto: false,
      background: 'linear-gradient(to right,#D4FFEC,#57F2CC,#4596FB)',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.alarmActivated = true;
        this.alarmaActivada();
        Swal.fire({
          title: 'Alarma Activada',
          icon: 'success',
          background: 'linear-gradient(to right,#D4FFEC,#57F2CC,#4596FB)',
          heightAuto: false,
          showCloseButton: true,
          showConfirmButton: false,
          timer: 3000,
        });
      }
    });
  }

  async desactivarAlarma(redirect: boolean) {
    Swal.fire({
      title: 'Por favor, ingresá tu contraseña',
      input: 'password',
      background: 'linear-gradient(to right,#D4FFEC,#57F2CC,#4596FB)',
      heightAuto: false,
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Desactivar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: async (passInput: string) => {
        try {
          const user = await this.auth.currentUser(); // <<<<<< AQUI

          if (!user) {
            Swal.showValidationMessage('Usuario no encontrado.');
            throw new Error('Usuario no encontrado.');
          }

          const passwordCorrecta = await this.validarPassword(
            user.email!,
            passInput
          );

          if (!passwordCorrecta) {
            Swal.showValidationMessage('Contraseña incorrecta');
            this.passIncorrecta();
            throw new Error('Contraseña incorrecta');
          }

          if (!redirect) {
            Swal.fire({
              title: 'Alarma Desactivada',
              icon: 'success',
              background: 'linear-gradient(to right,#D4FFEC,#57F2CC,#4596FB)',
              heightAuto: false,
              showCloseButton: true,
              showConfirmButton: false,
              timer: 3000,
            });
            this.audio.pause();
            this.alarmActivated = false;
            this.subscription.unsubscribe();
          } else {
            await this.auth.signOut();
            this.audio.pause();
            this.alarmActivated = false;
            this.subscription.unsubscribe();
          }
        } catch (error) {
          console.error('Error al verificar contraseña', error);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

  alarmaActivada() {
    this.subscription = this.deviceMotion
      .watchAcceleration({ frequency: 300 })
      .subscribe((acceleration: DeviceMotionAccelerationData) => {
        this.accelerationX = Math.floor(acceleration.x);
        this.accelerationY = Math.floor(acceleration.y);
        this.accelerationZ = Math.floor(acceleration.z);

        if (acceleration.x > 5) {
          this.currentPositionCellPhone = 'izquierda';
          this.movimientoIzquierda();
        } else if (acceleration.x < -5) {
          this.currentPositionCellPhone = 'derecha';
          this.movimientoDerecha();
        } else if (acceleration.y >= 9) {
          this.currentPositionCellPhone = 'arriba';

          if (this.currentPositionCellPhone != this.previousPositionCellPhone) {
            this.audio.src = this.audioVertical;
            this.previousPositionCellPhone = 'arriba';
          }
          this.audio.play();
          this.movimientoVertical();
        } else if (
          acceleration.z >= 9 &&
          acceleration.y >= -1 &&
          acceleration.y <= 1 &&
          acceleration.x >= -1 &&
          acceleration.x <= 1
        ) {
          this.currentPositionCellPhone = 'plano';
          this.movimientoHorizontal();
        }
      });
  }

  passIncorrecta() {
    this.audio.src = this.audioPass;
    this.firstAdmission = false;
    this.audio.play();

    // Iniciar la vibración
    if (!this.firstAdmission) {
      this.vibration.vibrate(5000);
    }

    // Activar la linterna
    if (this.firstAdmissionFlash) {
      this.flashlight.toggle(); // Enciende la linterna
      setTimeout(() => {
        this.flashlight.switchOff(); // Apaga la linterna después de 5 segundos
      }, 5000);
    }

    // Pausar el audio después de 5 segundos
    setTimeout(() => {
      this.audio.pause();
    }, 5000);

    this.firstAdmission = true;
  }

  movimientoIzquierda() {
    this.firstAdmission = false;
    this.firstAdmissionFlash = true;
    if (this.currentPositionCellPhone != this.previousPositionCellPhone) {
      this.previousPositionCellPhone = 'izquierda';
      this.audio.src = this.audioIzquierda;
    }
    this.audio.play();
  }

  movimientoDerecha() {
    this.firstAdmission = false;
    this.firstAdmissionFlash = true;
    if (this.currentPositionCellPhone != this.previousPositionCellPhone) {
      this.previousPositionCellPhone = 'derecha';
      this.audio.src = this.audioDerecha;
    }
    this.audio.play();
  }

  movimientoVertical() {
    if (this.firstAdmissionFlash) {
      this.firstAdmissionFlash ? this.flashlight.switchOn() : false;
      setTimeout(() => {
        this.firstAdmissionFlash = false;
        this.flashlight.switchOff();
      }, 5000);
      this.firstAdmission = false;
    }
  }

  movimientoHorizontal() {
    if (this.currentPositionCellPhone != this.previousPositionCellPhone) {
      this.previousPositionCellPhone = 'plano';
      this.audio.src = this.audioHorizontal;
    }
    this.firstAdmission ? null : this.audio.play();
    this.firstAdmission ? null : this.vibration.vibrate(5000);
    this.firstAdmission = true;
    this.firstAdmissionFlash = true;
  }
  async validarPassword(email: string, password: string): Promise<boolean> {
    const supabaseTemp = createClient(
      environment.SUPABASE_URL,
      environment.SUPABASE_KEY,
      {
        auth: { persistSession: false }, // <-- No guardar sesión
      }
    );

    const { error } = await supabaseTemp.auth.signInWithPassword({
      email,
      password,
    });

    return !error;
  }
}
