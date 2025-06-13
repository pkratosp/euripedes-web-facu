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
    label: "Nome",
  },
  {
    key: "sexo",
    label: "Sexo",
  },
  {
    key: "nis",
    label: "NIS",
  },
  {
    key: "dataNascimento",
    label: "Data de nascimento",
  },
  {
    key: "rg",
    label: "RG",
  },
  {
    key: "cpf",
    label: "CPF",
  },
  {
    key: "filiacaoMae",
    label: "Ficiação mãe",
  },
  {
    key: "pai",
    label: "Pai",
  },
  {
    key: "responsavel",
    label: "Responsável",
  },
  {
    key: "rgResponsavel",
    label: "Rg Responsável",
  },
  {
    key: "cpfResponsavel",
    label: "CPF Responsável",
  },
  {
    key: "naturalidade",
    label: "Naturalidade",
  },
  {
    key: "estado",
    label: "Estado",
  },
  {
    key: "ultimaProcedencia",
    label: "Ultima Procedencia",
  },
  {
    key: "ra",
    label: "RA",
  },
  {
    key: "escola",
    label: "Escola",
  },
  {
    key: "serieEscola",
    label: "Série Escola",
  },
  {
    key: "endereco",
    label: "Endereço",
  },
  {
    key: "bairro",
    label: "Bairro",
  },
  {
    key: "cep",
    label: "CEP",
  },
  {
    key: "contatos",
    label: "Contatos",
  },
  {
    key: "ações",
    label: "Ações",
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
                Documentos
              </Button>
              <Button
                onPress={() => {
                  setAlunoDetalhes(aluno);
                  ocorrenciaModal.onOpen();
                }}
              >
                Ocorrências
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
          emptyContent={<span>Não há nenhum atendido cadastrado</span>}
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
