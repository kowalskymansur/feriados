import { useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const CAPITALS = [
  { city: "Aracaju", state: "SE" },
  { city: "Belém", state: "PA" },
  { city: "Belo Horizonte", state: "MG" },
  { city: "Boa Vista", state: "RR" },
  { city: "Brasília", state: "DF" },
  { city: "Campo Grande", state: "MS" },
  { city: "Cuiabá", state: "MT" },
  { city: "Curitiba", state: "PR" },
  { city: "Florianópolis", state: "SC" },
  { city: "Fortaleza", state: "CE" },
  { city: "Goiânia", state: "GO" },
  { city: "João Pessoa", state: "PB" },
  { city: "Macapá", state: "AP" },
  { city: "Maceió", state: "AL" },
  { city: "Manaus", state: "AM" },
  { city: "Natal", state: "RN" },
  { city: "Palmas", state: "TO" },
  { city: "Porto Alegre", state: "RS" },
  { city: "Porto Velho", state: "RO" },
  { city: "Recife", state: "PE" },
  { city: "Rio Branco", state: "AC" },
  { city: "Rio de Janeiro", state: "RJ" },
  { city: "Salvador", state: "BA" },
  { city: "São Luís", state: "MA" },
  { city: "São Paulo", state: "SP" },
  { city: "Teresina", state: "PI" },
  { city: "Vitória", state: "ES" },
];

export function NotificationSubscriptionModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [notificationType, setNotificationType] = useState("all");
  const [daysBeforeNotification, setDaysBeforeNotification] = useState("7");
  const [isLoading, setIsLoading] = useState(false);

  const subscribeMutation = trpc.subscriptions.subscribe.useMutation();

  const handleStateToggle = (state: string) => {
    setSelectedStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
    );
  };

  const handleCityToggle = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Por favor, insira um e-mail válido");
      return;
    }

    setIsLoading(true);
    try {
      const result = await subscribeMutation.mutateAsync({
        email,
        states: selectedStates,
        cities: selectedCities,
        notificationType: notificationType as any,
        daysBeforeNotification: parseInt(daysBeforeNotification),
      });

      toast.success(result.message);
      setOpen(false);
      // Reset form
      setEmail("");
      setSelectedStates([]);
      setSelectedCities([]);
      setNotificationType("all");
      setDaysBeforeNotification("7");
    } catch (error) {
      toast.error("Erro ao processar inscrição. Tente novamente.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="gap-2 border-blue-200 hover:bg-blue-50"
        >
          <Bell className="w-5 h-5 text-blue-600" />
          <span className="hidden sm:inline">Receber Notificações</span>
          <span className="sm:hidden">Notificações</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Inscrever-se em Notificações de Feriados
          </DialogTitle>
          <DialogDescription>
            Receba notificações por e-mail sobre feriados futuros. Personalize suas preferências abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              E-mail *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Notification Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Tipo de Feriado
            </Label>
            <Select value={notificationType} onValueChange={setNotificationType}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os feriados</SelectItem>
                <SelectItem value="national">Apenas nacionais</SelectItem>
                <SelectItem value="state">Apenas estaduais</SelectItem>
                <SelectItem value="municipal">Apenas municipais</SelectItem>
                <SelectItem value="judiciary">Apenas judiciário</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Days Before Notification */}
          <div className="space-y-2">
            <Label htmlFor="days" className="text-sm font-medium">
              Notificar com antecedência
            </Label>
            <Select value={daysBeforeNotification} onValueChange={setDaysBeforeNotification}>
              <SelectTrigger id="days">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 3, 5, 7, 14, 30].map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {day} dia{day > 1 ? "s" : ""} antes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* States Selection */}
          {notificationType !== "national" && notificationType !== "judiciary" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Estados (opcional)</Label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                {STATES.map((state) => (
                  <div key={state} className="flex items-center space-x-2">
                    <Checkbox
                      id={`state-${state}`}
                      checked={selectedStates.includes(state)}
                      onCheckedChange={() => handleStateToggle(state)}
                      disabled={isLoading}
                    />
                    <label
                      htmlFor={`state-${state}`}
                      className="text-xs cursor-pointer"
                    >
                      {state}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cities Selection */}
          {notificationType === "municipal" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Cidades (opcional)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                {CAPITALS.map((capital) => (
                  <div key={capital.city} className="flex items-center space-x-2">
                    <Checkbox
                      id={`city-${capital.city}`}
                      checked={selectedCities.includes(capital.city)}
                      onCheckedChange={() => handleCityToggle(capital.city)}
                      disabled={isLoading}
                    />
                    <label
                      htmlFor={`city-${capital.city}`}
                      className="text-xs cursor-pointer"
                    >
                      {capital.city}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              ℹ️ Você receberá notificações por e-mail sobre feriados futuros. Pode cancelar sua inscrição a qualquer momento.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubscribe}
            disabled={isLoading || !email}
            className="gap-2"
          >
            {isLoading ? "Processando..." : "Inscrever-se"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
