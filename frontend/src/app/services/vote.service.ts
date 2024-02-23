import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgendaDetails } from '../agenda/agenda-details.model';

type CreateVoteInput = {
  cpf: string;
  agendaId: string;
  choice: string;
};

@Injectable({
  providedIn: 'root',
})
export class VoteService {
  private apiUrl = '/v1/vote';

  constructor(private http: HttpClient) {}

  registerVote({ cpf, agendaId, choice }: CreateVoteInput): Observable<any> {
    return this.http.post<{ data: AgendaDetails }>(`${this.apiUrl}`, {
      cpf,
      agendaId,
      choice,
    });
  }
}
