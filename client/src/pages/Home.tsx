import { useState, useEffect, useMemo } from "react";
import { Calendar, Filter, Search, MapPin, Briefcase } from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Holiday {
  date: string;
  name: string;
  type: string;
  state?: string;
  city?: string;
}

interface HolidaysData {
  [year: string]: {
    national: Holiday[];
    state: Holiday[];
    judiciary: Holiday[];
    municipal: Holiday[];
  };
}

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

export default function Home() {
  const [holidays, setHolidays] = useState<HolidaysData | null>(null);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [todayHolidays, setTodayHolidays] = useState<Holiday[]>([]);

  // Load holidays data
  useEffect(() => {
    fetch("/holidays.json")
      .then((res) => res.json())
      .then((data) => setHolidays(data))
      .catch((err) => console.error("Error loading holidays:", err));
  }, []);

  // Get today's holidays - always show national and judiciary holidays
  useEffect(() => {
    if (!holidays) return;

    const today = new Date().toISOString().split("T")[0];
    const year = today.split("-")[0];
    const yearData = holidays[year];

    if (yearData) {
      const todayHols: Holiday[] = [];

      // National holidays - always show
      const national = yearData.national.find((h) => h.date === today);
      if (national) todayHols.push(national);

      // State holidays - only if state is selected
      if (selectedState && selectedState !== "all") {
        const state = yearData.state.find(
          (h) => h.date === today && h.state === selectedState
        );
        if (state) todayHols.push(state);
      }

      // Judiciary holidays - always show
      const judiciary = yearData.judiciary.find((h) => h.date === today);
      if (judiciary) todayHols.push(judiciary);

      // Municipal holidays - only if city is selected
      if (selectedCity && selectedCity !== "all") {
        const municipal = yearData.municipal.find(
          (h) => h.date === today && h.city === selectedCity
        );
        if (municipal) todayHols.push(municipal);
      }

      setTodayHolidays(todayHols);
    }
  }, [holidays, selectedState, selectedCity]);

  // Filter holidays based on search and filters
  const filteredHolidays = useMemo(() => {
    if (!holidays) return [];

    const yearData = holidays[selectedYear];
    if (!yearData) return [];

    let allHolidays: Holiday[] = [];

    // Add holidays based on filter type
    if (filterType === "all" || filterType === "national") {
      allHolidays = [...allHolidays, ...yearData.national];
    }
    if (filterType === "all" || filterType === "state") {
      const stateHols = selectedState && selectedState !== "all"
        ? yearData.state.filter((h) => h.state === selectedState)
        : yearData.state;
      allHolidays = [...allHolidays, ...stateHols];
    }
    if (filterType === "all" || filterType === "judiciary") {
      allHolidays = [...allHolidays, ...yearData.judiciary];
    }
    if (filterType === "all" || filterType === "municipal") {
      const munHols = selectedCity && selectedCity !== "all"
        ? yearData.municipal.filter((h) => h.city === selectedCity)
        : yearData.municipal;
      allHolidays = [...allHolidays, ...munHols];
    }

    // Filter by search term
    if (searchTerm) {
      allHolidays = allHolidays.filter(
        (h) =>
          h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          h.date.includes(searchTerm)
      );
    }

    // Sort by date
    return allHolidays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [holidays, selectedYear, selectedState, selectedCity, searchTerm, filterType]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTypeIcon = (type: string) => {
    if (type.includes("Judiciário")) return <Briefcase className="w-4 h-4" />;
    if (type.includes("Estadual")) return <MapPin className="w-4 h-4" />;
    if (type.includes("Municipal")) return <MapPin className="w-4 h-4" />;
    return <Calendar className="w-4 h-4" />;
  };

  const getTypeColor = (type: string) => {
    if (type.includes("Nacional")) return "bg-blue-100 text-blue-800";
    if (type.includes("Estadual")) return "bg-green-100 text-green-800";
    if (type.includes("Judiciário")) return "bg-purple-100 text-purple-800";
    if (type.includes("Municipal")) return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Calendário de Feriados Brasil</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Consulte todos os feriados nacionais, estaduais, municipais e do poder judiciário
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Today's Holidays - Always visible on load */}
        <Card className={`mb-8 border-2 ${
          todayHolidays.length > 0
            ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
            : "border-gray-200 bg-gray-50"
        }`}>
          <CardHeader>
            <CardTitle className={todayHolidays.length > 0 ? "text-green-800" : "text-gray-800"}>
              Feriados de Hoje
            </CardTitle>
            <CardDescription className={todayHolidays.length > 0 ? "text-green-700" : "text-gray-600"}>
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayHolidays.length > 0 ? (
              <div className="space-y-3">
                {todayHolidays.map((holiday, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white p-4 rounded-lg border border-green-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${getTypeColor(holiday.type)}`}>
                        {getTypeIcon(holiday.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{holiday.name}</p>
                        <p className="text-sm text-gray-600">{holiday.type}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      {holiday.date}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Nenhum feriado hoje</p>
                <p className="text-sm text-gray-500 mt-1">
                  Selecione um estado ou cidade para ver feriados especificos
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros de Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Year Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Ano
                </label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* State Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Estado
                </label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os estados</SelectItem>
                    {STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Cidade
                </label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                    {CAPITALS.map((cap) => (
                      <SelectItem key={cap.city} value={cap.city}>
                        {cap.city} ({cap.state})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Tipo de Feriado
                </label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="national">Nacionais</SelectItem>
                    <SelectItem value="state">Estaduais</SelectItem>
                    <SelectItem value="judiciary">Judiciário</SelectItem>
                    <SelectItem value="municipal">Municipais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search */}
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Buscar por nome ou data
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Ex: Natal, 2026-12-25"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Feriados encontrados: {filteredHolidays.length}
            </h2>
            {filteredHolidays.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setSelectedState("all");
                  setSelectedCity("all");
                }}
              >
                Limpar Filtros
              </Button>
            )}
          </div>

          {filteredHolidays.length === 0 ? (
            <Card className="bg-gray-50">
              <CardContent className="pt-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  Nenhum feriado encontrado com os filtros selecionados.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredHolidays.map((holiday, idx) => (
                <Card key={idx} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${getTypeColor(holiday.type)}`}>
                            {getTypeIcon(holiday.type)}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">
                              {holiday.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formatDate(holiday.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap mt-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(holiday.type)}`}>
                            {holiday.type}
                          </span>
                          {holiday.state && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {holiday.state}
                            </span>
                          )}
                          {holiday.city && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {holiday.city}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {holiday.date}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <Card className="mt-12 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Sobre este calendário</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-2">
            <p>
              Este calendário contém informações sobre feriados brasileiros para os anos 2026 e 2027, incluindo:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Feriados Nacionais:</strong> Feriados oficiais em todo o Brasil</li>
              <li><strong>Feriados Estaduais:</strong> Datas Magnas e feriados específicos de cada estado</li>
              <li><strong>Feriados Municipais:</strong> Aniversários das capitais brasileiras</li>
              <li><strong>Feriados do Judiciário:</strong> Feriados observados pelo STF, CNJ, TRFs e TRTs</li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              Última atualização: {new Date().toLocaleDateString("pt-BR")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
