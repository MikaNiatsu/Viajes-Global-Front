import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SingInLayout({
  children,
  login,
  registro,
}: {
  children: React.ReactNode;
  login: React.ReactNode;
  registro: React.ReactNode;
}) {
  return (
    <>
      <div>{children}</div>
      <Tabs defaultValue="login">
        <TabsList>
          <TabsTrigger value="login">Ingresar</TabsTrigger>
          <TabsTrigger value="resgistro">Registrarse</TabsTrigger>
        </TabsList>
        <TabsContent value="login">{login}</TabsContent>
        <TabsContent value="resgistro">{registro}</TabsContent>
      </Tabs>
    </>
  );
}
