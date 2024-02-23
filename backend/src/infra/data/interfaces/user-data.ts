export abstract class UserData {
  abstract findByCpf(cpf: string): Promise<{
    id: string;
    cpf: string;
    name: string;
    password: string;
  } | null>;

  abstract create(input: {
    cpf: string;
    name: string;
    password: string;
  }): Promise<void>;
}
