import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AlertaService } from 'src/app/services/alerta.service';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.scss'],
  imports: [CommonModule],
})
export class AlertaComponent {
  visible = false;
  mensaje = '';
  tipo: 'error' | 'success' | 'info' = 'info';

  constructor(private alertaService: AlertaService) {}

  ngOnInit() {
    this.alertaService.visible.subscribe((v) => (this.visible = v));
    this.alertaService.mensaje.subscribe((m) => (this.mensaje = m));
    this.alertaService.tipo.subscribe((t) => (this.tipo = t));
  }

  cerrar() {
    this.alertaService.ocultar();
  }
}
