---
name: auditar-requisitos
description: Audita o código do Expedição Express contra RF01–RF35 e RNF01–RNF26 e regenera docs/rastreabilidade.md com status implementado, parcial ou pendente. Use when auditing requirements coverage, updating the traceability matrix, or preparing project delivery.
disable-model-invocation: true
---

# Auditar requisitos

## Objetivo

Comparar o código existente com [docs/requisitos.md](docs/requisitos.md) e regenerar [docs/rastreabilidade.md](docs/rastreabilidade.md).

## Passos

1. Leia a lista completa de RF/RNF em `docs/requisitos.md`.
2. Para cada requisito, busque evidência no código:
   - rotas em `src/app`
   - domínio em `src/domain`
   - server em `src/server`
   - UI em `src/components`
   - `firestore.rules`, Storage, Auth
3. Classifique:
   - **implementado** — comportamento atendido de ponta a ponta
   - **parcial** — existe estrutura ou UI, mas falta regra/persistência/permissão
   - **pendente** — sem evidência relevante
4. Preencha a coluna **Arquivos / notas** com caminhos reais (ex.: `src/domain/encomenda.ts`, `src/app/(gestor)/dashboard/page.tsx`).
5. Sobrescreva `docs/rastreabilidade.md` mantendo o formato de tabelas (RF e RNF separados).
6. Ao final, resuma contagens: `implementado` / `parcial` / `pendente` e os 3–5 próximos RF prioritários.

## Critérios rápidos

| Área | Sinais de “implementado” |
|------|--------------------------|
| Auth RF01/RF02 | login + logout + guard de sessão |
| Status RF15–RF18 | transições no domínio + histórico append-only + UI |
| Comprovante RF19–RF22 | registro + evidência Storage + consulta gestor |
| Rastreio RF23–RF26 | página pública `/rastreio/[codigo]` |
| RNF11 | rotas/actions checam perfil gestor vs entregador |
| RNF15 | rules `update, delete: if false` no histórico |

Não marque como implementado só porque existe um TODO ou um tipo TypeScript.
