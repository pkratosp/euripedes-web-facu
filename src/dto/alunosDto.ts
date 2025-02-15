export interface AlunosDto {
  id: string;
  nome: string;
  sexo: string;
  nis: string;
  dataNascimento: string;
  rg: string;
  cpf: string;
  filiacaoMae: string;
  pai: string | null;
  responsavel: string;
  rgResponsavel: string;
  cpfResponsavel: string;
  naturalidade: string;
  estado: string;
  ultimaProcedencia: string;
  ra: string;
  escola: string;
  serieEscola: string;
  endereco: string;
  bairro: string;
  cep: string;
  contatos: string;
}
