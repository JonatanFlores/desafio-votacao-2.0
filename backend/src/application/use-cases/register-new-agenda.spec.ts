import { RegisterNewAgenda } from '@/application/use-cases/register-new-agenda';
import { AgendaData } from '@/application/data/agenda-data';
import { AgendaDataInMemory } from '@/infra/data/in-memory/agenda-data-in-memory';

describe('Register New Agenda', () => {
  let agendaDataInMemory: AgendaData;
  let sut: RegisterNewAgenda;

  beforeEach(() => {
    agendaDataInMemory = new AgendaDataInMemory();
    sut = new RegisterNewAgenda(agendaDataInMemory);
  });

  it('should be able to register a new agenda', async () => {
    await sut.execute({
      description: 'Will we be able to deliver next week?',
      durationInSeconds: 120,
    });
    const result = await agendaDataInMemory.getAgendas();
    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        id: expect.any(String),
        description: 'Will we be able to deliver next week?',
        duration: 120,
      },
    ]);
  });
});
