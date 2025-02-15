export interface MatriculasDto {
  id: string;
  atendido: string;
  telefoneMae: string;
  telefonePai: string | null;
  telefoneRecado: string | null;
  responsavelLegal: string;
  anoMatricula: number;
}
