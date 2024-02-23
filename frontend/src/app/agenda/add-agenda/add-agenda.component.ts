import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { z } from 'zod';
import { FormErros } from '../../../types';
import { AgendaService } from '../../services/agenda.service';
import { transformErrors } from '../../../utils';

const voteSchema = z.object({
  description: z
    .string()
    .min(6, { message: 'A descrição deve conter ao menos 6 letras' }),
  duration: z
    .number()
    .min(1, { message: 'A pauta deve ter um tempo limite' })
    .default(1),
});

@Component({
  selector: 'app-add-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-agenda.component.html',
  styleUrl: './add-agenda.component.scss',
})
export class AddAgendaComponent {
  formErrors: FormErros = {};
  duration: number = 1;

  constructor(private agendaService: AgendaService) {}

  ngOnInit(): void {}

  saveAgenda(form: NgForm): void {
    try {
      this.formErrors = {};
      const description = form.value.description;
      const duration = parseInt(form.value.duration || 0);
      const formData = { description, duration };
      voteSchema.parse(formData);
      this.agendaService.createAgenda(formData).subscribe({
        next: (response) => {
          console.log('Agenda submitted successfully', response);
          form.reset();
        },
        error: (error) => {
          console.error('Error submitting agenda', error);
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.formErrors = transformErrors(error);
      }
    }
  }
}
