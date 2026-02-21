# 📅 Calendário de Feriados Brasil

Um calendário web interativo e completo com todos os feriados brasileiros para os anos 2026 e 2027. Consulte feriados nacionais, estaduais, municipais e do poder judiciário com filtros avançados e busca por data.

**🌐 Acesse o site:** [Calendário de Feriados Brasil](https://kowalskymansur.github.io/feriados/client/index.html)

---

## ✨ Funcionalidades

### 📊 Base de Dados Completa
- **8.549 feriados** catalogados para 2026 e 2027
- **Feriados Nacionais**: Todos os feriados oficiais do Brasil
- **Feriados Estaduais**: Datas Magnas e feriados específicos de cada um dos 27 estados
- **Feriados Municipais**: Feriados de todos os ~5.570 municípios brasileiros
- **Feriados do Judiciário**: Feriados observados pelo STF, CNJ, TRFs, TRTs e Recesso Forense

### 🔍 Filtros Avançados
- **Filtro por Ano**: Selecione entre 2026 e 2027
- **Filtro por Estado**: Escolha qualquer um dos 27 estados brasileiros
- **Filtro por Cidade**: Acesso a feriados municipais de qualquer município
- **Filtro por Tipo**: Feriados Nacionais, Estaduais, Municipais ou do Judiciário
- **Busca por Nome**: Procure feriados pelo nome (ex: "Natal", "Páscoa")
- **Busca por Data**: Busque por data no formato DD/MM/AAAA com máscara automática

### 📱 Interface Intuitiva
- **Exibição de Feriados de Hoje**: Mostra automaticamente os feriados do dia vigente
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Tema Moderno**: Interface com gradientes azuis, tipografia elegante e componentes de alta qualidade
- **Botão Limpar Filtros**: Reseta todos os filtros com um clique

### ⚡ Desempenho
- **Carregamento Rápido**: Dados otimizados e compactados
- **Busca em Tempo Real**: Resultados instantâneos conforme você digita
- **Interface Responsiva**: Transições suaves e animações fluidas

---

## 🚀 Como Usar

### Acessar o Site
1. Abra o navegador e acesse: [Calendário de Feriados Brasil](https://kowalskymansur.github.io/feriados/client/index.html)
2. A página abre vazia - nenhum feriado é exibido até você aplicar um filtro

### Buscar Feriados por Data
1. Clique no campo **"Buscar por nome ou data"**
2. Digite apenas números no formato DD/MM/AAAA (ex: `25122026` para 25/12/2026)
3. A máscara automática formatará para `25/12/2026`
4. Os resultados aparecem instantaneamente

**Exemplo de busca:**
- Digite `01012026` → Exibe todos os feriados de 1º de janeiro de 2026
- Digite `natal` → Exibe todos os feriados com "Natal" no nome

### Filtrar por Estado
1. Clique no dropdown **"Estado"**
2. Selecione um estado (ex: SP, RJ, MG)
3. Os feriados nacionais, estaduais e municipais do estado selecionado serão exibidos

### Filtrar por Cidade
1. Clique no dropdown **"Cidade"**
2. Selecione uma cidade
3. Exibe feriados municipais específicos da cidade

### Combinar Filtros
Você pode combinar múltiplos filtros:
- Selecione um **Estado** + uma **Cidade** para ver feriados específicos
- Selecione um **Tipo de Feriado** para filtrar por categoria
- Use a **Busca por Data** junto com outros filtros

### Limpar Filtros
Clique no botão **"Limpar Filtros"** para resetar todos os filtros e voltar à exibição vazia.

---

## 📋 Estrutura de Dados

### Tipos de Feriados

#### Feriados Nacionais
Feriados oficiais em todo o Brasil, como:
- Confraternização Universal (1º de janeiro)
- Tiradentes (21 de abril)
- Dia do Trabalho (1º de maio)
- Independência (7 de setembro)
- Nossa Senhora Aparecida (12 de outubro)
- Finados (2 de novembro)
- Proclamação da República (15 de novembro)
- Consciência Negra (20 de novembro)
- Natal (25 de dezembro)

#### Feriados Estaduais
Datas Magnas e feriados específicos de cada estado, como:
- Instalação de Tocantins (TO)
- Criação do Estado de Alagoas (AL)
- Zumbi dos Palmares (AL)
- E muitos outros...

#### Feriados Municipais
Aniversários e datas comemorativas de todos os municípios brasileiros, incluindo:
- Aniversários das capitais estaduais
- Datas de fundação de cidades
- Festas padroeiras
- E feriados específicos de cada município

#### Feriados do Judiciário
Feriados observados pelo poder judiciário:
- **STF** (Supremo Tribunal Federal)
- **CNJ** (Conselho Nacional de Justiça)
- **TRFs** (Tribunais Regionais Federais)
- **TRTs** (Tribunais Regionais do Trabalho)
- **Recesso Forense**: Período de recesso do poder judiciário

---

## 🛠️ Instalação e Configuração Local

### Pré-requisitos
- Node.js 22.13.0 ou superior
- pnpm 10.4.1 ou superior
- Git

### Clonar o Repositório
```bash
git clone https://github.com/kowalskymansur/feriados.git
cd feriados
```

### Instalar Dependências
```bash
pnpm install
```

### Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:
```bash
DATABASE_URL=your_database_url_here
JWT_SECRET=your_jwt_secret_here
VITE_APP_ID=your_app_id_here
OAUTH_SERVER_URL=your_oauth_server_url_here
VITE_OAUTH_PORTAL_URL=your_oauth_portal_url_here
```

### Executar em Desenvolvimento
```bash
pnpm dev
```

O site estará disponível em `http://localhost:3000`

### Build para Produção
```bash
pnpm build
```

### Iniciar em Produção
```bash
pnpm start
```

---

## 📁 Estrutura do Projeto

```
feriados/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   │   └── Home.tsx            # Página principal do calendário
│   │   ├── components/             # Componentes reutilizáveis
│   │   ├── lib/
│   │   │   └── trpc.ts             # Cliente tRPC
│   │   ├── App.tsx                 # Configuração de rotas
│   │   ├── main.tsx                # Entrada da aplicação
│   │   └── index.css               # Estilos globais
│   ├── public/
│   │   └── holidays.json           # Base de dados de feriados
│   └── index.html
├── server/                          # Backend Express
│   ├── routers.ts                  # Definição de rotas tRPC
│   ├── db.ts                       # Helpers de banco de dados
│   └── _core/                      # Núcleo do servidor
├── drizzle/                        # Migrações do banco de dados
│   └── schema.ts                   # Schema do banco de dados
├── shared/                         # Código compartilhado
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🗄️ Base de Dados de Feriados

### Arquivo: `client/public/holidays.json`

A base de dados é um arquivo JSON estruturado por ano e categoria:

```json
{
  "2026": {
    "national": [
      {
        "date": "2026-01-01",
        "name": "Confraternização Universal",
        "type": "Nacional"
      }
    ],
    "state": [
      {
        "date": "2026-01-01",
        "name": "Instalação de Tocantins",
        "type": "Estadual",
        "state": "TO"
      }
    ],
    "judiciary": [
      {
        "date": "2026-01-01",
        "name": "Recesso Forense",
        "type": "Judiciário"
      }
    ],
    "municipal": [
      {
        "date": "2026-01-02",
        "name": "Feriado Municipal",
        "type": "Feriado Municipal",
        "state": "SP",
        "city": "São Paulo",
        "codigo_ibge": 3550308
      }
    ]
  }
}
```

---

## 🔧 Tecnologias Utilizadas

### Frontend
- **React 19**: Framework JavaScript moderno
- **TypeScript**: Tipagem estática para JavaScript
- **Tailwind CSS 4**: Framework CSS utilitário
- **shadcn/ui**: Componentes UI de alta qualidade
- **Vite**: Bundler e dev server rápido
- **Lucide React**: Ícones modernos

### Backend
- **Express 4**: Framework web minimalista
- **tRPC 11**: RPC type-safe end-to-end
- **Drizzle ORM**: ORM type-safe para TypeScript
- **MySQL 2**: Driver MySQL para Node.js

### Desenvolvimento
- **Vitest**: Framework de testes unitários
- **Prettier**: Formatador de código
- **TypeScript**: Verificação de tipos estática

---

## 📊 Estatísticas

| Métrica | Valor |
|---------|-------|
| Total de Feriados (2026) | 8.549 |
| Total de Feriados (2027) | 44 |
| Estados Cobertos | 27 |
| Municípios Cobertos | ~5.570 |
| Tipos de Feriados | 4 (Nacional, Estadual, Municipal, Judiciário) |
| Tamanho do Arquivo JSON | 1.7 MB |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Se você encontrou um erro nos dados de feriados ou tem sugestões de melhorias, sinta-se à vontade para:

1. Abrir uma **Issue** descrevendo o problema
2. Fazer um **Fork** do repositório
3. Criar uma **Branch** para sua feature (`git checkout -b feature/AmazingFeature`)
4. Fazer **Commit** das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
5. Fazer **Push** para a branch (`git push origin feature/AmazingFeature`)
6. Abrir um **Pull Request**

---

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 📞 Suporte

Se você tiver dúvidas ou encontrar problemas ao usar o calendário, abra uma **Issue** no repositório GitHub:
[Issues - Calendário de Feriados Brasil](https://github.com/kowalskymansur/feriados/issues)

---

## 🙏 Agradecimentos

- Dados de feriados municipais fornecidos pelo repositório [feriados-brasil](https://github.com/joaopbini/feriados-brasil)
- Ícones por [Lucide React](https://lucide.dev)
- Componentes UI por [shadcn/ui](https://ui.shadcn.com)
- Framework CSS por [Tailwind CSS](https://tailwindcss.com)

---

## 📅 Últimas Atualizações

- **21/02/2026**: Lançamento inicial com 8.549 feriados
- **21/02/2026**: Implementação de máscara de data DD/MM/AAAA
- **21/02/2026**: Adição de filtros avançados por estado, cidade e tipo
- **21/02/2026**: Exibição automática de feriados de hoje

---
