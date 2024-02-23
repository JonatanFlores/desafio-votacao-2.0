export abstract class VoteData {
  abstract findUserVote(input: { cpf: string; agendaId: string }): Promise<{
    id: string;
    cpf: string;
    agendaId: string;
  } | null>;

  abstract create(input: {
    agendaId: string;
    cpf: string;
    choice: string;
  }): Promise<void>;
}
