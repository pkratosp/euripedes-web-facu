"use client";

import { Button, Input } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type SignInType = {
  username: string;
  password: string;
};

export default function AuthSignIn() {
  const { refresh } = useRouter();

  const { handleSubmit, register } = useForm<SignInType>();
  const [isLoadingButtonSignIn, setIsLoadingButtonSignIn] =
    useState<boolean>(false);

  async function handleSignIn(data: SignInType) {
    setIsLoadingButtonSignIn(true);

    const login = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    setIsLoadingButtonSignIn(false);

    if (login?.error) {
      return toast.error("Credenciais invalidas");
    }

    refresh();
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/3 h-1/2 bg-gray-200 shadow-2xl rounded-2xl">
        <h2 className="text-2xl text-center font-bold">Logar</h2>
        <form className="space-y-6 p-4" onSubmit={handleSubmit(handleSignIn)}>
          <Input
            {...register("username")}
            label="username"
            placeholder="Digite o user name"
            required
          />
          <Input
            {...register("password")}
            label="senha"
            type="password"
            placeholder="Digite sua senha"
            required
          />
          <Button
            isLoading={isLoadingButtonSignIn}
            type="submit"
            className="bg-blue-600 text-white w-full"
          >
            Logar
          </Button>
        </form>
      </div>
    </div>
  );
}
