# Matriz de rastreabilidade — Expedição Express

Status possíveis: `pendente` | `parcial` | `implementado`

Atualize esta matriz ao concluir um requisito (skill `implementar-requisito` ou `auditar-requisitos`).

## Requisitos Funcionais

| Código | Título | Status | Arquivos / notas |
|--------|--------|--------|------------------|
| RF01 | Autenticação | implementado | `src/components/auth/formulario-login.tsx`, `src/server/actions/auth-actions.ts`, `src/server/auth/sessao.ts`, `src/app/(publico)/login/page.tsx` |
| RF02 | Encerramento de sessão | implementado | `src/components/auth/botao-sair.tsx`, `src/components/ui/cabecalho-area.tsx` (em `(gestor)/layout.tsx` e `(entregador)/layout.tsx`), `src/server/actions/auth-actions.ts` (`encerrarSessaoAction`), `src/server/auth/sessao.ts` (`encerrarSessao`), `src/app/(publico)/login/page.tsx` (confirmação `?saiu=1`) |
| RF03 | Cadastro de entregadores | implementado | `src/domain/entregador.ts` (tipos, `validarNovoEntregador`), `src/server/repositories/entregadores-repository.ts` (batch `entregadores/{uid}` + `usuarios/{uid}`), `src/server/services/entregadores-service.ts` (cria conta no Firebase Auth; desfaz se o Firestore falhar), `src/server/actions/entregadores-actions.ts`, `src/components/entregadores/formulario-entregador.tsx`, `src/app/(gestor)/entregadores/novo/page.tsx`; id do entregador = uid do Auth |
| RF04 | Consulta de entregadores | pendente | |
| RF05 | Situação do entregador | pendente | |
| RF06 | Cadastro de encomendas | pendente | |
| RF07 | Código de rastreamento | pendente | |
| RF08 | Consulta de encomendas | pendente | |
| RF09 | Detalhes da encomenda | pendente | |
| RF10 | Edição de encomendas | pendente | |
| RF11 | Busca de encomendas | pendente | |
| RF12 | Filtro de encomendas | pendente | |
| RF13 | Atribuição de entregador | pendente | |
| RF14 | Visualização das entregas atribuídas | pendente | |
| RF15 | Atualização de status | pendente | |
| RF16 | Status da encomenda | pendente | |
| RF17 | Motivo de entrega não realizada | pendente | |
| RF18 | Histórico da encomenda | pendente | |
| RF19 | Registro do comprovante | pendente | |
| RF20 | Dados do comprovante | pendente | |
| RF21 | Evidência de entrega | pendente | |
| RF22 | Consulta do comprovante | pendente | |
| RF23 | Rastreamento da encomenda | pendente | |
| RF24 | Exibição do histórico de rastreamento | pendente | |
| RF25 | Status atual no rastreamento | pendente | |
| RF26 | Consulta pelo cliente | pendente | |
| RF27 | Organização das coletas | pendente | |
| RF28 | Organização das entregas | pendente | |
| RF29 | Visualização de endereços | pendente | |
| RF30 | Organização da rota | pendente | |
| RF31 | Visualização da rota | pendente | |
| RF32 | Dashboard | pendente | |
| RF33 | Indicadores de encomendas | pendente | |
| RF34 | Entregas recentes | pendente | |
| RF35 | Consulta por período | pendente | |

## Requisitos Não Funcionais

| Código | Título | Status | Arquivos / notas |
|--------|--------|--------|------------------|
| RNF01 | Responsividade | pendente | |
| RNF02 | Facilidade de navegação | pendente | |
| RNF03 | Consistência visual | pendente | |
| RNF04 | Feedback ao usuário | parcial | login, logout (`?saiu=1`) e cadastro de entregador com mensagens de sucesso/erro |
| RNF05 | Identificação dos status | pendente | |
| RNF06 | Facilidade de operação | pendente | |
| RNF07 | Tempo de resposta | pendente | |
| RNF08 | Atualização das informações | pendente | |
| RNF09 | Carregamento das páginas | pendente | |
| RNF10 | Controle de acesso | parcial | layouts `(gestor)` e `(entregador)` exigem sessão |
| RNF11 | Perfis de acesso | parcial | redirect por `perfil` após login; guards nos layouts |
| RNF12 | Proteção de credenciais | implementado | senha só no Firebase Auth; nunca armazenada no app |
| RNF13 | Proteção das informações | pendente | |
| RNF14 | Sessão do usuário | implementado | cookie httpOnly `ee_sessao` verificado com checagem de revogação; logout revoga refresh tokens, remove cookie, faz `signOut` no Firebase client e redireciona; layouts de gestor/entregador bloqueiam sem sessão |
| RNF15 | Integridade do histórico | pendente | |
| RNF16 | Integridade do comprovante | pendente | |
| RNF17 | Identificação única | pendente | |
| RNF18 | Persistência dos dados | pendente | |
| RNF19 | Disponibilidade | pendente | |
| RNF20 | Compatibilidade com navegadores | pendente | |
| RNF21 | Acesso móvel | pendente | |
| RNF22 | Legibilidade | pendente | |
| RNF23 | Identificação além das cores | pendente | |
| RNF24 | Formulários | parcial | login e cadastro de entregador: `<label>` em todos os campos, erros por campo via `aria-describedby`/`aria-invalid` |
| RNF25 | Organização do sistema | pendente | |
| RNF26 | Padronização | pendente | |
