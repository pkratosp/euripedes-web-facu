import { Button, Input } from "@heroui/react";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/3 h-1/2 bg-gray-200 shadow-2xl rounded-2xl space-y-6 p-4">
        <h2 className="text-2xl text-center font-bold">Logar</h2>
        <Input label="username" placeholder="Digite o user name" />
        <Input label="senha" type="password" placeholder="Digite sua senha" />
        <Button className="bg-blue-600 text-white w-full">Logar</Button>
      </div>
    </div>
  );
}
