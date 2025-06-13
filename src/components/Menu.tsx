"use client";

import {
  ClipboardText,
  PencilSimpleLine,
  UserPlus,
  Users,
} from "@phosphor-icons/react";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
}

export function Menu({ isOpen, onOpenChange }: Props) {
  const { push } = useRouter();
  const { data } = useSession();

  function handleSignOut(onClose: () => void) {
    onClose();
    signOut({
      redirect: true,
      callbackUrl: "/",
    });
  }

  return (
    <Drawer
      backdrop="blur"
      placement="left"
      size="xs"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">{data?.nome}</h2>
              <span className="font-normal text-xl">{data?.username}</span>
            </DrawerHeader>
            <DrawerBody>
              <Button
                onPress={() => {
                  push("/alunos");
                  onClose();
                }}
                className="flex space-x-2 items-center bg-transparent justify-start"
              >
                <Users size={32} />
                <span className="block">Atendidos</span>
              </Button>
              <Button
                onPress={() => {
                  push("/matriculas");
                  onClose();
                }}
                className="flex space-x-2 items-center bg-transparent justify-start"
              >
                <UserPlus size={32} />
                <span className="block">Matrículas</span>
              </Button>

              <Button
                onPress={() => {
                  push("/formularios");
                  onClose();
                }}
                className="flex space-x-2 items-center bg-transparent justify-start"
              >
                <ClipboardText size={32} />
                <span className="block">Formulários</span>
              </Button>
            </DrawerBody>
            <DrawerFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => handleSignOut(onClose)}
              >
                Sair
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
