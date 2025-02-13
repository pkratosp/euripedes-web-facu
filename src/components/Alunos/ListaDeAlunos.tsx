"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";

const columns = [
  {
    key: "nome",
    label: "nome",
  },
  {
    key: "sexo",
    label: "sexo",
  },
  {
    key: "nis",
    label: "nis",
  },
  {
    key: "dataNascimento",
    label: "dataNascimento",
  },
  {
    key: "rg",
    label: "rg",
  },
  {
    key: "cpf",
    label: "cpf",
  },
  {
    key: "filiacaoMae",
    label: "filiacaoMae",
  },
  {
    key: "pai",
    label: "pai",
  },
  {
    key: "responsavel",
    label: "responsavel",
  },
  {
    key: "rgResponsavel",
    label: "rgResponsavel",
  },
  {
    key: "cpfResponsavel",
    label: "cpfResponsavel",
  },
  {
    key: "naturalidade",
    label: "naturalidade",
  },
  {
    key: "estado",
    label: "estado",
  },
  {
    key: "ultimaProcedencia",
    label: "ultimaProcedencia",
  },
  {
    key: "ra",
    label: "ra",
  },
  {
    key: "escola",
    label: "escola",
  },
  {
    key: "serieEscola",
    label: "serieEscola",
  },
  {
    key: "endereco",
    label: "endereco",
  },
  {
    key: "bairro",
    label: "bairro",
  },
  {
    key: "cep",
    label: "cep",
  },
  {
    key: "contatos",
    label: "contatos",
  },
];

const rows = [];

export function ListaDeAlunos() {
  return (
    <>
      <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={<span>Não há nenhum aluno cadastrado</span>}
          items={rows}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
