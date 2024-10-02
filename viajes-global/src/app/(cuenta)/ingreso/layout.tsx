import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


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
    
    <Card className="mx-auto w-[400px] mt-20">
      <CardHeader>
        <CardTitle>{children}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Ingresar</TabsTrigger>
            <TabsTrigger value="registro">Registrarse</TabsTrigger>
          </TabsList>
          <TabsContent value="login">{login}</TabsContent>
          <TabsContent value="registro">{registro}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
