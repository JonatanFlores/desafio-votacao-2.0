export abstract class AgendaData {
  abstract save(input: {
    description: string;
    durationInSeconds: number;
  }): Promise<void>;

  abstract getAgendas(): Promise<
    Array<{
      id: string;
      description: string;
      duration: number;
    }>
  >;

  abstract getDetails(input: { agendaId: string }): Promise<{
    agenda: {
      id: string;
      description: string;
      duration: number;
      passed: boolean;
      endDate: Date;
    };
    votes: {
      YES: number;
      NO: number;
      totalCount: number;
    };
  } | null>;
}
