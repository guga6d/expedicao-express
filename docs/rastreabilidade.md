# Matriz de rastreabilidade — Expedição Express

Status possíveis: `pendente` | `parcial` | `implementado`

Atualize esta matriz ao concluir um requisito (skill `implementar-requisito` ou `auditar-requisitos`).

## Requisitos Funcionais

| Código | Título | Status | Arquivos / notas |
|--------|--------|--------|------------------|
| RF01 | Autenticação | implementado | `src/components/auth/formulario-login.tsx`, `src/server/actions/auth-actions.ts`, `src/server/auth/sessao.ts`, `src/app/(publico)/login/page.tsx` |
| RF02 | Encerramento de sessão | implementado | `src/components/auth/botao-sair.tsx`, `src/components/ui/cabecalho-area.tsx` (em `(gestor)/layout.tsx` e `(entregador)/layout.tsx`), `src/server/actions/auth-actions.ts` (`encerrarSessaoAction`), `src/server/auth/sessao.ts` (`encerrarSessao`), `src/app/(publico)/login/page.tsx` (confirmação `?saiu=1`) |
| RF03 | Cadastro de entregadores | implementado | `src/domain/entregador.ts` (tipos, `validarNovoEntregador`), `src/server/repositories/entregadores-repository.ts` (batch `entregadores/{uid}` + `usuarios/{uid}`), `src/server/services/entregadores-service.ts` (cria conta no Firebase Auth; desfaz se o Firestore falhar), `src/server/actions/entregadores-actions.ts`, `src/components/entregadores/formulario-entregador.tsx`, `src/app/(gestor)/entregadores/novo/page.tsx`; id do entregador = uid do Auth |
| RF04 | Consulta de entregadores | implementado | `src/domain/entregador.ts` (`ordenarEntregadoresPorNome`, `filtrarEntregadores`), `src/server/repositories/entregadores-repository.ts` (`listarEntregadores`, `buscarEntregadorPorId`), `src/server/services/entregadores-service.ts` (`consultarEntregadores`, `obterEntregador`), `src/components/entregadores/lista-entregadores.tsx` (tabela no desktop / cartões no mobile), `src/components/entregadores/badge-situacao-entregador.tsx`, `src/app/(gestor)/entregadores/page.tsx` (lista + busca `?busca=` por nome, telefone ou e-mail), `src/app/(gestor)/entregadores/[id]/page.tsx` (detalhes; 404 se não existir), link no dashboard |
| RF05 | Situação do entregador | implementado | Definida no cadastro (RF03) e alterável depois: `src/server/repositories/entregadores-repository.ts` (`atualizarSituacaoEntregador`, grava `atualizadoEm`), `src/server/services/entregadores-service.ts` (`definirSituacaoEntregador`, `EntregadorNaoEncontradoError`), `src/server/actions/entregadores-actions.ts` (`definirSituacaoEntregadorAction`, só gestor, `revalidatePath` da lista e do detalhe), `src/components/entregadores/formulario-situacao-entregador.tsx`, seção "Alterar situação" em `src/app/(gestor)/entregadores/[id]/page.tsx`; situação exibida com ícone + texto (`badge-situacao-entregador.tsx`) |
| RF06 | Cadastro de encomendas | implementado | `src/domain/encomenda.ts` (`Contato`, `CAMPOS_NOVA_ENCOMENDA`, `validarNovaEncomenda`: descrição opcional, remetente/destinatário com nome e telefone, endereços de coleta e entrega com CEP/UF validados), `src/server/repositories/encomendas-repository.ts` (`salvarNovaEncomenda`, batch atômico), `src/server/services/encomendas-service.ts` (`cadastrarEncomenda`), `src/server/actions/encomendas-actions.ts` (só gestor), `src/components/encomendas/formulario-encomenda.tsx`, `src/app/(gestor)/encomendas/nova/page.tsx`, link no dashboard; status inicial "Aguardando coleta" |
| RF07 | Código de rastreamento | implementado | Gerado automaticamente no cadastro: `gerarCodigoRastreamento` (`EE` + 10 caracteres sem 0/O/1/I, a partir de `crypto.randomBytes`), `isCodigoRastreamento`, `normalizarCodigoRastreamento` em `src/domain/encomenda.ts`; unicidade garantida pela reserva `codigosRastreamento/{codigo}` criada no mesmo batch (nova tentativa em caso de colisão); código exibido ao gestor após o cadastro |
| RF08 | Consulta de encomendas | implementado | `src/domain/encomenda.ts` (`isStatusEncomenda`, `ItemListaEncomenda`), `src/server/repositories/encomendas-repository.ts` (`listarEncomendas`, ordem `criadaEm` desc — índice de campo único automático), `src/server/repositories/entregadores-repository.ts` (`buscarEntregadoresPorIds`), `src/server/repositories/conversores.ts`, `src/server/services/encomendas-service.ts` (`consultarEncomendas`, resolve o nome do entregador), `src/components/encomendas/lista-encomendas.tsx` (código, destinatário, destino, entregador, status com ícone + texto, data; tabela no desktop / cartões no mobile), `src/app/(gestor)/encomendas/page.tsx`, link no dashboard; link para os detalhes virá com RF09 |
| RF09 | Detalhes da encomenda | implementado | `src/domain/encomenda.ts` (`DetalhesEncomenda`), `src/domain/formatacao.ts` (`formatarDataHora`), `src/server/repositories/encomendas-repository.ts` (`buscarEncomendaPorId`, `listarHistoricoEncomenda` em ordem de `registradoEm`), `src/server/services/encomendas-service.ts` (`obterDetalhesEncomenda`: encomenda + entregador + histórico com nome de quem registrou), `src/components/encomendas/historico-encomenda.tsx`, `src/app/(gestor)/encomendas/[id]/page.tsx` (status atual, conteúdo, remetente/destinatário com endereços, entregador responsável, histórico; 404 se não existir); linhas da lista (RF08) levam aos detalhes |
| RF10 | Edição de encomendas | implementado | `src/domain/encomenda.ts` (`podeEditarEncomenda` — bloqueia após "Entregue"; `valoresFormularioDeEncomenda`), `src/server/repositories/encomendas-repository.ts` (`atualizarDadosEncomenda` em transação que confere o status no momento da gravação; não altera status, código nem entregador), `src/server/services/encomendas-service.ts` (`editarEncomenda`, `obterEncomenda`), `src/server/actions/encomendas-actions.ts` (`editarEncomendaAction`, só gestor, redireciona com `?editada=1`), `src/components/encomendas/formulario-encomenda.tsx` (modos cadastro/edição), `src/app/(gestor)/encomendas/[id]/editar/page.tsx`, botão "Editar dados" e confirmação em `src/app/(gestor)/encomendas/[id]/page.tsx` |
| RF11 | Busca de encomendas | pendente | |
| RF12 | Filtro de encomendas | pendente | |
| RF13 | Atribuição de entregador | pendente | |
| RF14 | Visualização das entregas atribuídas | pendente | |
| RF15 | Atualização de status | pendente | |
| RF16 | Status da encomenda | pendente | |
| RF17 | Motivo de entrega não realizada | pendente | |
| RF18 | Histórico da encomenda | parcial | primeiro evento ("Aguardando coleta", `usuarioId`, `registradoEm`) gravado em `encomendas/{id}/historico` no cadastro (RF06); histórico exibido nos detalhes (RF09); falta registrar as mudanças de status (RF15) |
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
| RNF04 | Feedback ao usuário | parcial | login, logout (`?saiu=1`), cadastro de entregador, alteração de situação do entregador e cadastro de encomenda (exibe o código gerado) e edição de encomenda com mensagens de sucesso/erro |
| RNF05 | Identificação dos status | parcial | `badge-status.tsx` (ícone + rótulo por status) usado na lista (RF08), nos detalhes e no histórico (RF09) |
| RNF06 | Facilidade de operação | pendente | |
| RNF07 | Tempo de resposta | pendente | |
| RNF08 | Atualização das informações | pendente | |
| RNF09 | Carregamento das páginas | pendente | |
| RNF10 | Controle de acesso | parcial | layouts `(gestor)` e `(entregador)` exigem sessão; páginas que leem dados chamam `exigirSessaoNaPagina` (`src/server/auth/sessao.ts`), pois layout e página renderizam em paralelo |
| RNF11 | Perfis de acesso | parcial | redirect por `perfil` após login; guards nos layouts |
| RNF12 | Proteção de credenciais | implementado | senha só no Firebase Auth; nunca armazenada no app |
| RNF13 | Proteção das informações | pendente | |
| RNF14 | Sessão do usuário | implementado | cookie httpOnly `ee_sessao` verificado com checagem de revogação; logout revoga refresh tokens, remove cookie, faz `signOut` no Firebase client e redireciona; layouts de gestor/entregador bloqueiam sem sessão |
| RNF15 | Integridade do histórico | pendente | |
| RNF16 | Integridade do comprovante | pendente | |
| RNF17 | Identificação única | implementado | id do documento Firestore + código de rastreamento reservado em `codigosRastreamento/{codigo}` via `create()` (falha se já existir); coleção bloqueada ao client em `firestore.rules` |
| RNF18 | Persistência dos dados | pendente | |
| RNF19 | Disponibilidade | pendente | |
| RNF20 | Compatibilidade com navegadores | pendente | |
| RNF21 | Acesso móvel | pendente | |
| RNF22 | Legibilidade | pendente | |
| RNF23 | Identificação além das cores | parcial | situação do entregador com ícone + texto (`badge-situacao-entregador.tsx`); status da encomenda com ícone + texto (`badge-status.tsx`) na lista de encomendas |
| RNF24 | Formulários | parcial | login, cadastro de entregador, busca de entregadores e cadastro de encomenda (campos opcionais identificados): `<label>` em todos os campos, erros por campo via `aria-describedby`/`aria-invalid` |
| RNF25 | Organização do sistema | pendente | |
| RNF26 | Padronização | pendente | |
