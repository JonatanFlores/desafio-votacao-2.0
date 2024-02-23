import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CountdownService } from '../../services/countdown.service';
import { Agenda } from '../agenda.model';
import { AgendaService } from '../../services/agenda.service';

@Component({
  selector: 'app-list-agenda',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list-agenda.component.html',
  styleUrl: './list-agenda.component.scss',
})
export class ListAgendaComponent implements OnInit, OnDestroy {
  agendas!: Agenda[];
  countdown: string = '';
  private subscriptions: Subscription = new Subscription();

  constructor(
    private countdownService: CountdownService,
    private agendaService: AgendaService
  ) {}

  ngOnInit(): void {
    this.agendaService.getAgendas().subscribe({
      next: (agendas) => {
        this.agendas = agendas;
        this.agendas.forEach((agenda) => {
          if (agenda.end_date) {
            const subscription = this.countdownService
              .startCountdown(agenda.end_date)
              .subscribe((timeLeftFormatted) => {
                agenda.countdown = timeLeftFormatted;
              });
            this.subscriptions.add(subscription);
          } else {
            agenda.countdown = 'N/A';
          }
        });
      },
      error: (error) => {
        console.error('Error fetching agenda details:', error);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
