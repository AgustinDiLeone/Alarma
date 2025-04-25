import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private activo = false;

  mostrar() {
    this.activo = true;
    setTimeout(() => this.ocultar(), 1500); // Oculta en 3 segundos
  }

  ocultar() {
    this.activo = false;
  }

  isActivo() {
    return this.activo;
  }
}
