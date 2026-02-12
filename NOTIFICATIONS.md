# Sistema de Notificações de Feriados

## Visão Geral

O Calendário de Feriados Brasil inclui um sistema completo de notificações por e-mail que permite aos usuários se inscreverem para receber lembretes sobre feriados futuros.

## Funcionalidades

### 1. Inscrição em Notificações
Os usuários podem se inscrever através do modal "Receber Notificações" na página principal. O modal oferece:

- **E-mail**: Campo obrigatório para receber as notificações
- **Tipo de Feriado**: Filtro para escolher quais tipos de feriados notificar
  - Todos os feriados
  - Apenas nacionais
  - Apenas estaduais
  - Apenas municipais
  - Apenas judiciário
- **Antecedência**: Escolher com quantos dias antes da data do feriado receber a notificação (1 a 30 dias)
- **Estados**: Seleção opcional de estados (quando aplicável)
- **Cidades**: Seleção opcional de cidades capitais (quando aplicável)

### 2. Gerenciamento de Inscrições
Os usuários podem:
- **Criar nova inscrição**: Ao fornecer um novo e-mail
- **Atualizar inscrição**: Se o e-mail já existe, a inscrição é atualizada com as novas preferências
- **Cancelar inscrição**: Através da API de desinscrição

### 3. Histórico de Notificações
O sistema mantém um log de todas as notificações enviadas, rastreando:
- Data e hora do envio
- Feriado notificado
- Status da entrega (enviado, falha, devolvido)

## Arquitetura

### Backend

#### Banco de Dados
Duas tabelas principais:

**emailSubscriptions**
```
- id: int (PK)
- email: varchar (UNIQUE)
- states: text (JSON array)
- cities: text (JSON array)
- notificationType: enum
- daysBeforeNotification: int
- isActive: int (1=ativo, 0=inativo)
- createdAt: timestamp
- updatedAt: timestamp
```

**notificationLogs**
```
- id: int (PK)
- subscriptionId: int (FK)
- holidayDate: varchar (YYYY-MM-DD)
- holidayName: varchar
- sentAt: timestamp
- status: enum (sent, failed, bounced)
```

#### API Routes (tRPC)

**subscriptions.subscribe**
- Tipo: Mutation
- Entrada: Email, estados, cidades, tipo de feriado, dias de antecedência
- Saída: { success, message, isNew }
- Descrição: Cria ou atualiza uma inscrição

**subscriptions.unsubscribe**
- Tipo: Mutation
- Entrada: Email
- Saída: { success, message }
- Descrição: Desativa uma inscrição

**subscriptions.checkStatus**
- Tipo: Query
- Entrada: Email
- Saída: { isSubscribed, subscription }
- Descrição: Verifica o status de uma inscrição

**subscriptions.getActive**
- Tipo: Query
- Entrada: Nenhuma
- Saída: Array de inscrições ativas
- Descrição: Retorna todas as inscrições ativas (para processamento de notificações)

**subscriptions.logNotification**
- Tipo: Mutation
- Entrada: subscriptionId, holidayDate, holidayName, status
- Saída: { success }
- Descrição: Registra uma notificação enviada

### Frontend

#### Componente NotificationSubscriptionModal
Localizado em: `client/src/components/NotificationSubscriptionModal.tsx`

Características:
- Dialog modal com formulário de inscrição
- Validação de e-mail em tempo real
- Seleção múltipla de estados e cidades
- Integração com tRPC para enviar dados
- Notificações toast para feedback do usuário
- Responsivo para mobile e desktop

## Fluxo de Uso

1. **Usuário clica em "Receber Notificações"**
   - Modal abre com formulário vazio

2. **Usuário preenche o formulário**
   - E-mail obrigatório
   - Tipo de feriado (padrão: todos)
   - Antecedência (padrão: 7 dias)
   - Estados/Cidades (opcional)

3. **Usuário clica em "Inscrever-se"**
   - Frontend valida o e-mail
   - Envia dados via tRPC para o backend
   - Backend verifica se e-mail já existe
   - Se novo: cria inscrição
   - Se existe: atualiza preferências
   - Retorna mensagem de sucesso

4. **Usuário recebe confirmação**
   - Toast exibe mensagem de sucesso
   - Modal fecha automaticamente

## Próximas Etapas para Implementação Completa

### 1. Integração com Serviço de E-mail
Implementar envio real de e-mails usando:
- SendGrid, Mailgun, ou AWS SES
- Template de e-mail HTML personalizado
- Agendador de tarefas (cron job)

### 2. Agendador de Notificações
Criar job que:
- Executa diariamente
- Busca todas as inscrições ativas
- Identifica feriados que ocorrem em X dias
- Filtra por preferências do usuário
- Envia e-mails
- Registra no log

### 3. Página de Gerenciamento
Criar página onde usuários podem:
- Ver suas inscrições ativas
- Editar preferências
- Ver histórico de notificações
- Gerenciar múltiplas inscrições

### 4. Confirmação de E-mail
Implementar:
- E-mail de confirmação ao se inscrever
- Link de verificação
- Reenvio de confirmação

### 5. Desinscrição por E-mail
Adicionar link de desinscrição no rodapé de cada e-mail

## Testes

Os testes unitários estão em: `server/routers/subscriptions.test.ts`

Executar testes:
```bash
pnpm test
```

Cobertura de testes:
- ✅ Criar nova inscrição
- ✅ Validação de e-mail
- ✅ Atualizar inscrição existente
- ✅ Validação de daysBeforeNotification
- ✅ Validação de notificationType
- ✅ Desinscrever usuário
- ✅ Verificar status
- ✅ Registrar notificação

## Variáveis de Ambiente Necessárias

Para implementação completa, adicionar:
```
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SENDGRID_API_KEY= (alternativa)
NOTIFICATION_FROM_EMAIL=
NOTIFICATION_FROM_NAME=
```

## Exemplos de Uso da API

### Inscrever-se
```typescript
const result = await trpc.subscriptions.subscribe.mutate({
  email: "usuario@example.com",
  states: ["SP", "RJ"],
  cities: ["São Paulo"],
  notificationType: "all",
  daysBeforeNotification: 7
});
```

### Verificar Status
```typescript
const status = await trpc.subscriptions.checkStatus.query({
  email: "usuario@example.com"
});
```

### Desinscrever
```typescript
const result = await trpc.subscriptions.unsubscribe.mutate({
  email: "usuario@example.com"
});
```

## Segurança

- E-mails são validados antes de armazenar
- Senhas e tokens sensíveis não são armazenados
- Inscrições inativas não recebem notificações
- Logs mantêm auditoria de envios
- API é pública mas com rate limiting recomendado

## Suporte

Para dúvidas ou problemas com o sistema de notificações, consulte a documentação do projeto ou abra uma issue.
