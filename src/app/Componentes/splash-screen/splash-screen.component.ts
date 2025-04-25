import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  standalone: true,
})
export class SplashScreenComponent implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const elements = this.el.nativeElement.querySelectorAll(
      '.smoke-text h1, .smoke-text h2'
    );
    elements.forEach((el: HTMLElement) => {
      const text = el.innerText;
      el.innerText = '';
      Array.from(text).forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.animationDelay = `${i * 0.1}s`;
        el.appendChild(span);
      });
    });
  }
}
