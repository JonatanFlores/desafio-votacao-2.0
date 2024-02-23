export interface AgendaDetails {
  agenda: {
    id: string;
    description: string;
    duration: number;
    end_date: string;
    passed: boolean;
  };
  vote: {
    count: 0;
  };
  session: {
    active: boolean;
  };
}
