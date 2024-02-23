import { Routes } from '@angular/router';
import { ListAgendaComponent } from './agenda/list-agenda/list-agenda.component';
import { AddAgendaComponent } from './agenda/add-agenda/add-agenda.component';
import { AddVoteComponent } from './vote/add-vote/add-vote.component';
import { ShowAgendaComponent } from './agenda/show-agenda/show-agenda.component';

export const routes: Routes = [
  { path: '', component: ListAgendaComponent },
  { path: 'view/agenda/:agendaId', component: ShowAgendaComponent },
  { path: 'add/agenda', component: AddAgendaComponent },
  { path: 'add/vote/:agendaId', component: AddVoteComponent },
];
