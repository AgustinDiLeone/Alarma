import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SplashScreenComponent } from './Componentes/splash-screen/splash-screen.component';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './Componentes/spinner/spinner.component';
import { AlertaComponent } from './Componentes/alerta/alerta.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp,
    IonRouterOutlet,
    SplashScreenComponent,
    CommonModule,
    SpinnerComponent,
    AlertaComponent,
  ],
})
export class AppComponent {
  showSplash = true;
  constructor(private router: Router) {}

  ngOnInit() {
    // Oculta el splash screen nativo de Capacitor
    //SplashScreen.hide();

    // Simulación del splash screen animado por 3 segundos
    setTimeout(() => {
      this.showSplash = false;
      this.router.navigate(['/login']);
    }, 9000);
  }
}
