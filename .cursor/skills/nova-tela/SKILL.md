---
name: nova-tela
description: Scaffold de uma nova página no App Router do Expedição Express com perfil, loading/erro, layout responsivo e checklist de acessibilidade. Use when creating a new screen, page, route, or tela for gestor, entregador, or rastreio público.
disable-model-invocation: true
---

# Nova tela

## 1. Decidir rota e perfil

| Área | Grupo | Auth |
|------|-------|------|
| Rastreio público | `src/app/(publico)/rastreio/...` | nenhuma |
| Gestor | `src/app/(gestor)/...` | gestor autenticado |
| Entregador | `src/app/(entregador)/...` | entregador autenticado |

Confirme o RF relacionado em `docs/requisitos.md`.

## 2. Scaffold mínimo

```
src/app/(gestor)/encomendas/page.tsx      # Server Component
src/app/(gestor)/encomendas/loading.tsx
src/app/(gestor)/encomendas/error.tsx
src/components/encomendas/...             # UI da feature
```

- Página = Server Component; busca dados via `src/server/**`
- Client Component só para formulários, mapa, drag-and-drop
- Mutações = Server Actions + `revalidatePath`

## 3. Estados obrigatórios

- **Carregando** — `loading.tsx` ou skeleton
- **Vazio** — mensagem clara + CTA se fizer sentido
- **Erro** — `error.tsx` com retry

## 4. Checklist antes de concluir

- [ ] Responsivo (mobile-first) — RNF01/RNF21
- [ ] Item de menu / navegação se for tela principal — RNF02
- [ ] Componentes de `src/components/ui` — RNF03
- [ ] Labels + `aria-describedby` em forms — RNF24
- [ ] Status com ícone + texto — RNF05/RNF23
- [ ] Contraste adequado — RNF22
- [ ] Fluxo do entregador em poucos passos — RNF06
- [ ] Guard de sessão/perfil na rota — RNF10/RNF11/RNF14
