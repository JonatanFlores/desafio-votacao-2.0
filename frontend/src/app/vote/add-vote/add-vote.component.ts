import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { z } from 'zod';
import { AgendaDetails } from '../../agenda/agenda-details.model';
import { FormErros, ResponseMessage } from '../../../types';
import { CountdownService } from '../../services/countdown.service';
import { AgendaService } from '../../services/agenda.service';
import { VoteService } from '../../services/vote.service';
import { isValidCPF, transformErrors } from '../../../utils';
import { CpfMaskDirective } from '../../../directives/cpf-mask.directive';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageComponent } from '../../message/message.component';

const voteSchema = z.object({
  agendaId: z.string().uuid(),
  cpf: z.string().refine(isValidCPF, {
    message: 'O formato do CPF está incorreto. Por favor verifique',
  }),
  choice: z.string().refine((value) => value === 'YES' || value === 'NO', {
    message: "Você deve escolher entre 'Sim' ou 'Não'",
  }),
});

@Component({
  selector: 'app-add-vote',
  standalone: true,
  imports: [CommonModule, FormsModule, CpfMaskDirective, MessageComponent],
  templateUrl: './add-vote.component.html',
  styleUrl: './add-vote.component.scss',
})
export class AddVoteComponent implements OnInit, OnDestroy {
  agendaDetails!: AgendaDetails;
  formErrors: FormErros = {};
  message: ResponseMessage | null = null;
  countdown: string = '';
  private countdownSubscription!: Subscription;

  constructor(
    private countdownService: CountdownService,
    private agendaService: AgendaService,
    private voteService: VoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const agendaId = this.route.snapshot.paramMap.get('agendaId');
    if (agendaId) {
      this.agendaService.getAgenda(agendaId).subscribe({
        next: (agendaDetails) => {
          if (agendaDetails.session.active === false) {
            this.router.navigate(['/view/agenda', agendaId]);
          }
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

  registerVote(form: NgForm): void {
    try {
      this.formErrors = {};
      const agendaId = this.route.snapshot.paramMap.get('agendaId');
      const cpf = form.value.cpf;
      const choice = form.value.choice;
      const formData = { agendaId, cpf, choice };
      voteSchema.parse(formData);
      this.voteService
        .registerVote({
          cpf: cpf!,
          choice: choice,
          agendaId: agendaId!,
        })
        .subscribe({
          next: (response) => {
            console.log('Vote submitted successfully', response);
            form.reset();
            setTimeout(() => {
              this.router.navigate(['/view/agenda', agendaId]);
            }, 1500);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error submitting vote', error);
            switch (error.status) {
              case 409:
                this.message = {
                  type: 'WARNING',
                  description: 'Você já votou nesta pauta anteriormente',
                };
                break;
            }
          },
        });
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.formErrors = transformErrors(error);
      }
    }
  }
}
