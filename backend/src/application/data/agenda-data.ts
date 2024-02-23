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
}
