import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SingInLayout({
  login,
  registro,
}: {
  children: React.ReactNode;
  login: React.ReactNode;
  registro: React.ReactNode;
}) {
  return (
    <>
      {/* Mobile Version */}
      <div className="md:hidden">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Autenticación</h1>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-6">
              <TabsTrigger value="login" >
                Ingresar
              </TabsTrigger>
              <TabsTrigger value="registro" >
                Registrarse
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4 pt-2">
              {login}
            </TabsContent>
            <TabsContent value="registro" className="space-y-4 pt-2">
              {registro}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle>Autenticación</CardTitle>
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
      </div>
    </>
  );
}
