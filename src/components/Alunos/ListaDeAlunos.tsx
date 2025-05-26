"use client";
import {
  AlunoDocumentosDto,
  AlunosDocumentosDto,
  AlunosDto,
} from "@/dto/alunosDto";
import { api } from "@/lib/axios";
import { Button, Pagination, useDisclosure } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { EditarAluno } from "./EditarAluno";
import { DocumentosAluno } from "./DocumentosAluno";
import { Ocorrencia } from "./Ocorrencia";

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
  {
    key: "ações",
    label: "ações",
  },
];

interface RequestAlunos {
  alunos: AlunosDocumentosDto[];
  total: number;
}

interface Props {
  search: string;
  token: string;
}

export function ListaDeAlunos({ search, token }: Props) {
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const documentosModal = useDisclosure();
  const ocorrenciaModal = useDisclosure();

  const [alunoDetalhes, setAlunoDetalhes] = useState<AlunosDto | null>(null);

  const [alunos, setAlunos] = useState<RequestAlunos>({
    alunos: [],
    total: 0,
  });

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
    data: RequestAlunos;
    isLoading: boolean;
  } = useSWR(`/alunos?page=${page}`, fetcher, {
    keepPreviousData: true,
    onSuccess: (data: RequestAlunos) => {
      setAlunos(data);
    },
  });

  const rowsPerPage = 20;

  const pages = useMemo(() => {
    return alunos?.total ? Math.ceil(alunos.total / rowsPerPage) : 0;
  }, [alunos?.total, rowsPerPage]);

  const loadingState =
    isLoading || alunos?.alunos?.length === 0 ? "loading" : "idle";

  const renderCell = useCallback(
    (
      aluno: AlunosDto,
      columKey: React.Key,
      documentos: AlunoDocumentosDto[] | undefined
    ) => {
      const columnCell = aluno[columKey as keyof AlunosDto];

      switch (columKey) {
        case "nome":
          return <p>{columnCell}</p>;
        case "sexo":
          return <p>{columnCell}</p>;
        case "nis":
          return <p>{columnCell}</p>;
        case "dataNascimento":
          return <p>{columnCell}</p>;
        case "rg":
          return <p>{columnCell}</p>;
        case "cpf":
          return <p>{columnCell}</p>;
        case "filiacaoMae":
          return <p>{columnCell}</p>;
        case "pai":
          return <p>{columnCell}</p>;
        case "responsavel":
          return <p>{columnCell}</p>;
        case "rgResponsavel":
          return <p>{columnCell}</p>;
        case "cpfResponsavel":
          return <p>{columnCell}</p>;
        case "naturalidade":
          return <p>{columnCell}</p>;
        case "estado":
          return <p>{columnCell}</p>;
        case "ultimaProcedencia":
          return <p>{columnCell}</p>;
        case "ra":
          return <p>{columnCell}</p>;
        case "escola":
          return <p>{columnCell}</p>;
        case "serieEscola":
          return <p>{columnCell}</p>;
        case "endereco":
          return <p>{columnCell}</p>;
        case "bairro":
          return <p>{columnCell}</p>;
        case "cep":
          return <p>{columnCell}</p>;
        case "contatos":
          return <p>{columnCell}</p>;

        case "ações":
          return (
            <div className="flex space-x-2">
              <Button
                onPress={() => {
                  setAlunoDetalhes(aluno);
                  onOpen();
                }}
              >
                Editar dados
              </Button>
              <Button
                onPress={() => {
                  setAlunoDetalhes(aluno);
                  documentosModal.onOpen();
                }}
              >
                documentos
              </Button>
              <Button
                onPress={() => {
                  setAlunoDetalhes(aluno);
                  ocorrenciaModal.onOpen();
                }}
              >
                Ocorrencia
              </Button>
            </div>
          );
      }
    },
    []
  );

  async function buscarAlunoNome(search: string) {
    try {
      const request = await api.get(`/alunos/${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlunos(request.data);
    } catch (error) {
      toast.error(`Ocorreu um erro ao consultar aluno ${search}`);
    }
  }

  useEffect(() => {
    const findSearch = setTimeout(() => {
      if (search.trim() !== "") {
        buscarAlunoNome(search);
      } else {
        buscarAlunoNome("vazio");
      }
    }, 1000);

    return () => clearTimeout(findSearch);
  }, [search]);

  return (
    <Fragment>
      <EditarAluno
        dadosAluno={alunoDetalhes}
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        token={token}
      />

      <DocumentosAluno
        dadosAluno={alunoDetalhes}
        isOpen={documentosModal.isOpen}
        onOpenChange={documentosModal.onOpenChange}
        token={token}
      />

      <Ocorrencia
        isOpen={ocorrenciaModal.isOpen}
        nomeAluno={alunoDetalhes?.nome ?? ""}
        alunoId={alunoDetalhes?.id ?? ""}
        onOpenChange={ocorrenciaModal.onOpenChange}
        token={token}
      />

      <Table
        aria-label="Lista dos alunos cadastrados"
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
          items={alunos?.alunos ?? []}
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {({ documentos, ...aluno }) => (
            <TableRow key={aluno.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(aluno, columnKey, documentos)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Fragment>
  );
}
