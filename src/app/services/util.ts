import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor() {}
  router = inject(Router);
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }
}
