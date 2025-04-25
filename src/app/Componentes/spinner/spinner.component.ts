import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SpinnerComponent implements OnInit {
  constructor(public spinner: SpinnerService) {}

  ngOnInit() {}
}
