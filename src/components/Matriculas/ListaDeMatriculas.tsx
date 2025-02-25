"use client";

import { api } from "@/lib/axios";
import { Button, Pagination, useDisclosure } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";
import { Fragment, useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { MatriculasDto } from "@/dto/matriculasDto";
import { InformacoesAluno } from "./InformacoesAluno";
import { EditarMatricula } from "./EditarMatricula";
import { Desmatricular } from "./Desmatricular";
import { Rematricular } from "./Rematricular";

interface Props {
  token: string;
}

const columns = [
  {
    key: "nomeAluno",
    label: "Nome do aluno",
  },
  {
    key: "atendido",
    label: "atendido",
  },
  {
    key: "telefoneMae",
    label: "telefone da Mãe",
  },
  {
    key: "telefonePai",
    label: "telefone do pai",
  },
  {
    key: "telefoneRecado",
    label: "telefone recado",
  },
  {
    key: "responsavelLegal",
    label: "resposavel legal",
  },
  {
    key: "anoMatricula",
    label: "ano matricula",
  },
  {
    key: "ações",
    label: "ações",
  },
];

export function ListaDeMatriculas({ token }: Props) {
  const informacoesAluno = useDisclosure();
  const editarMatricula = useDisclosure();
  const desmatricular = useDisclosure();
  const rematricular = useDisclosure();

  const [matricula, setMatricula] = useState<Omit<
    MatriculasDto,
    "aluno"
  > | null>(null);
  const [aluno, setAluno] = useState<{ nome: string; id: string } | null>(null);

  const [page, setPage] = useState<number>(1);

  const fetcher = (url: string) =>
    api
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.data)
      .catch(() => toast.error("Ocorreu um erro ao listar dados"));

  const {
    data,
    isLoading,
  }: {
    data: {
      matriculas: MatriculasDto[];
      total: number;
    };
    isLoading: boolean;
  } = useSWR(`${api.defaults.baseURL}/matriculas?page=${page}`, fetcher, {
    keepPreviousData: true,
  });

  const rowsPerPage = 20;

  const pages = useMemo(() => {
    return data?.total ? Math.ceil(data.total / rowsPerPage) : 0;
  }, [data?.total, rowsPerPage]);

  const loadingState =
    isLoading || data?.matriculas?.length === 0 ? "loading" : "idle";

  const renderCell = useCallback(
    (
      matricula: Omit<MatriculasDto, "aluno">,
      columKey: React.Key,
      aluno: { nome: string; id: string }
    ) => {
      const cellValue =
        matricula[columKey as keyof Omit<MatriculasDto, "aluno">];

      switch (columKey) {
        case "nomeAluno":
          return <p>{aluno.nome}</p>;
        case "atendido":
          return <p>{cellValue}</p>;

        case "telefoneMae":
          return <p>{cellValue}</p>;

        case "telefonePai":
          return <p>{cellValue}</p>;

        case "telefoneRecado":
          return <p>{cellValue}</p>;

        case "responsavelLegal":
          return <p>{cellValue}</p>;

        case "anoMatricula":
          return <p>{cellValue}</p>;

        case "ações":
          return (
            <div className="flex-1 space-x-1">
              <Button
                className="w-1/4"
                onPress={() => {
                  setMatricula(matricula);
                  setAluno(aluno);
                  informacoesAluno.onOpen();
                }}
              >
                Informações
              </Button>

              <Button
                className="w-1/4"
                onPress={() => {
                  setMatricula(matricula);
                  setAluno(aluno);
                  editarMatricula.onOpen();
                }}
              >
                Editar matricula
              </Button>

              <Button
                className="w-1/4"
                onPress={() => {
                  setMatricula(matricula);
                  setAluno(aluno);
                  rematricular.onOpen();
                }}
              >
                Rematricular
              </Button>

              <Button
                className="w-1/4"
                onPress={() => {
                  setMatricula(matricula);
                  setAluno(aluno);
                  desmatricular.onOpen();
                }}
              >
                Desmatricular
              </Button>
            </div>
          );
      }
    },
    []
  );

  return (
    <Fragment>
      <InformacoesAluno
        isOpen={informacoesAluno.isOpen}
        onOpenChange={informacoesAluno.onOpenChange}
        token={token}
        matriculaId={matricula?.id ?? ""}
        nomeAluno={aluno?.nome ?? "Aluno não definido"}
      />

      <EditarMatricula
        isOpen={editarMatricula.isOpen}
        onOpenChange={editarMatricula.onOpenChange}
        token={token}
        aluno={aluno}
        matricula={matricula}
      />

      <Rematricular
        isOpen={rematricular.isOpen}
        onOpenChange={rematricular.onOpenChange}
        token={token}
        aluno={aluno}
        matricula={matricula}
      />

      <Desmatricular
        isOpen={desmatricular.isOpen}
        onOpenChange={desmatricular.onOpenChange}
        token={token}
        nomeAluno={aluno?.nome ?? "Aluno não definido"}
        matriculaId={matricula?.id ?? ""}
      />

      <Table
        aria-label="Lista matriculas dos alunos cadastrados"
        bottomContent={
          pages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={<span>Não há nenhum aluno cadastrado</span>}
          items={data?.matriculas ?? []}
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {(matricula) => (
            <TableRow key={matricula.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(matricula, columnKey, matricula.aluno)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Fragment>
  );
}
