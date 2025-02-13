"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalBody, ModalHeader } from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  dadosAluno: any;
}

const sexo = [
  {
    key: "masculino",
    label: "masculino",
  },
  {
    key: "feminino",
    label: "feminino",
  },
];

export function EditarAluno({ isOpen, onClose, onOpenChange }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior={"inside"}
      onOpenChange={onOpenChange}
      size="5xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Cadastrar aluno
            </ModalHeader>
            <ModalBody>
              <form className="space-y-4">
                <Input label="Nome do aluno" />
                <Input label="Ra" />
                <Input label="nis" />
                <Input label="CPF" />
                <Input label="RG" />
                <Input label="data de nascimento" />
                <Input label="naturalidade" />
                <Input label="estado" />
                <Input label="endereço" />
                <Input label="bairro" />
                <Input label="cep" />
                <Input label="escola" />
                <Input label="série da escola" />
                <Input label="Ultima procedencia" />
                <Input label="Nome do responsavel" />
                <Input label="Rg do responsavel" />
                <Input label="CPF do responsavel" />
                <Input label="Filiação mãe" />
                <Input label="Pai" />
                <Input label="Contatos" />
                <Select label="Selecione o sexo">
                  {sexo.map((_sexo) => (
                    <SelectItem key={_sexo.key}>{_sexo.label}</SelectItem>
                  ))}
                </Select>

                <Button color="danger" variant="light" onPress={onClose}>
                  Fechar
                </Button>
                <Button type="submit" color="primary">
                  Cadastrar
                </Button>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
