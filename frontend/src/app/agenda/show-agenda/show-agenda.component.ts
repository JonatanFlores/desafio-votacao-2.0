import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CountdownService } from '../../services/countdown.service';
import { AgendaService } from '../../services/agenda.service';
import { AgendaDetails } from '../agenda-details.model';

@Component({
  selector: 'app-show-agenda',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './show-agenda.component.html',
  styleUrl: './show-agenda.component.scss',
})
export class ShowAgendaComponent implements OnInit, OnDestroy {
  agendaDetails!: AgendaDetails;
  countdown: string = '';
  private countdownSubscription!: Subscription;

  constructor(
    private countdownService: CountdownService,
    private agendaService: AgendaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const agendaId = this.route.snapshot.paramMap.get('agendaId');
    if (agendaId) {
      this.agendaService.getAgenda(agendaId).subscribe({
        next: (agendaDetails) => {
          this.agendaDetails = agendaDetails;
          this.countdownSubscription = this.countdownService
            .startCountdown(agendaDetails.agenda.end_date)
            .subscribe((timeLeftFormatted) => {
              this.countdown = timeLeftFormatted;
            });
        },
        error: (error) => {
          console.error('Error fetching agenda details:', error);
        },
      });
    }
  }

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
}
