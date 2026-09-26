---
name: implementar-requisito
description: Implementa um requisito funcional ou não funcional do Expedição Express (RF01–RF35, RNF01–RNF26) seguindo domínio → servidor → UI → rastreabilidade. Use when the user asks to implement a requirement, RF, RNF, or feature from docs/requisitos.md.
---

# Implementar requisito

## Início

1. Identifique o código (`RF15`, `RNF08`, etc.).
2. Leia a definição verbatim em [docs/requisitos.md](docs/requisitos.md).
3. Confira o status atual em [docs/rastreabilidade.md](docs/rastreabilidade.md).
4. Liste dependências (ex.: RF15 depende de RF16 e RF18).

## Ordem de implementação (obrigatória)

```
Task Progress:
- [ ] 1. Domínio (src/domain) — tipos, transições, validações puras
- [ ] 2. Persistência (src/server/repositories) — Firestore/Storage
- [ ] 3. Serviço / Server Action (src/server) — auth, perfil, revalidatePath
- [ ] 4. UI (src/app + src/components) — feedback, a11y, mobile
- [ ] 5. firestore.rules / índices se nova coleção ou query
- [ ] 6. Checklist de aceite + RNFs transversais
- [ ] 7. Atualizar docs/rastreabilidade.md
```

Não pule camadas: UI não inventa regra de negócio.

## Checklist transversal (sempre)

- [ ] Perfil correto (gestor vs entregador) — RNF10/RNF11
- [ ] Feedback sucesso/erro — RNF04
- [ ] Status com ícone + texto — RNF05/RNF23
- [ ] Labels nos formulários — RNF24
- [ ] Mobile usável se for fluxo do entregador — RNF06/RNF21
- [ ] `revalidatePath` após mutação — RNF08
- [ ] Histórico append-only se mudar status — RNF15

## Aceite

Marque o requisito como `implementado` (ou `parcial` com o que falta) em `docs/rastreabilidade.md`, listando os arquivos tocados. Cite o código do requisito no resumo da mudança.
