import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Agenda } from '../agenda/agenda.model';
import { AgendaDetails } from '../agenda/agenda-details.model';

type CreateAgendaInput = {
  description: string;
  duration: number;
};

@Injectable({
  providedIn: 'root',
})
export class AgendaService {
  private apiUrl = '/v1/agenda';

  constructor(private http: HttpClient) {}

  getAgendas(): Observable<Agenda[]> {
    return this.http
      .get<{ data: { agendas: Agenda[] } }>(this.apiUrl)
      .pipe(map((response) => response.data.agendas));
  }

  getAgenda(agendaId: string): Observable<AgendaDetails> {
    return this.http
      .get<{ data: AgendaDetails }>(`${this.apiUrl}/${agendaId}`)
      .pipe(map((response) => response.data));
  }

  createAgenda({ description, duration }: CreateAgendaInput): Observable<any> {
    const durationInSeconds = duration * 60;
    return this.http.post<{ data: AgendaDetails }>(`${this.apiUrl}`, {
      description,
      duration: durationInSeconds,
    });
  }
}
