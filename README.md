# Expedição Express

Sistema web de gestão de entregas: encomendas, entregadores, rotas, rastreamento e comprovantes.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Firebase Auth, Firestore e Storage

## Como começar

1. Copie `.env.example` para `.env.local` e preencha as chaves do Firebase.
2. Instale e rode:

```bash
npm install
npm run dev
```

3. Publique as regras: `firestore.rules` no console Firebase.

## Governança do projeto (Cursor)

| Tipo | Caminho |
|------|---------|
| Requisitos | [docs/requisitos.md](docs/requisitos.md) |
| Rastreabilidade | [docs/rastreabilidade.md](docs/rastreabilidade.md) |
| Rules | [.cursor/rules/](.cursor/rules/) |
| Skills | [.cursor/skills/](.cursor/skills/) |

Skills úteis: `implementar-requisito`, `nova-tela`, `modelo-firestore`, `auditar-requisitos`.

## Estrutura

```
src/app/            rotas (publico), (gestor), (entregador)
src/components/     ui/ + features
src/domain/         tipos e regras puras
src/server/         repositories e server actions
src/lib/firebase/   client e admin
```
