export interface OcorrenciaDto {
  id: string;
  titulo: string;
  descricao: string;
  alunoId: string;
  dataOcorrencia: string;
  User: {
    id: string;
    nome: string;
  };
}
