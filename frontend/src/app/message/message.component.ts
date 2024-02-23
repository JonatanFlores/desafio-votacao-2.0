import { Component, Input, OnInit } from '@angular/core';
import { ResponseMessage } from '../../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent implements OnInit {
  @Input() message: ResponseMessage | null = null;

  constructor() {}

  ngOnInit(): void {}
}
