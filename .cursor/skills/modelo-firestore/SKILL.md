---
name: modelo-firestore
description: Cria ou altera coleções Firestore do Expedição Express (tipos de domínio, repository, firestore.rules, índices e seed). Use when modeling data, adding a collection, writing firestore.rules, indexes, or seed data for encomendas, entregadores, historico, or comprovante.
disable-model-invocation: true
---

# Modelo Firestore

## Workflow

```
Task Progress:
- [ ] 1. Tipo em src/domain (português, sem Firebase)
- [ ] 2. Converter documento ↔ domínio
- [ ] 3. Repository em src/server/repositories com funções nomeadas
- [ ] 4. Atualizar firestore.rules por perfil
- [ ] 5. Índices compostos se houver filtro/ordenação
- [ ] 6. Seed de demonstração (opcional)
```

## Coleções canônicas

- `usuarios` — `{ perfil: 'gestor' | 'entregador', ... }`
- `entregadores` — nome, telefone, situação
- `encomendas` — dados + `statusAtual`, `codigoRastreamento` (único), `entregadorId`
- `encomendas/{id}/historico` — create-only, `serverTimestamp()`
- `encomendas/{id}/comprovante` — recebedor, data, `evidenciaUrl`

## Regras (mínimo)

- Gestor: leitura/escrita administrativa
- Entregador: leitura das atribuídas; write limitado a status/histórico/comprovante
- Histórico: `allow create: if ...; allow update, delete: if false` (RNF15)
- Cliente anônimo: só leitura pública necessária ao rastreio por código (RF26)

## Índices típicos (RF11 / RF12 / RF35)

- `encomendas`: `statusAtual` + `criadaEm`
- `encomendas`: `entregadorId` + `statusAtual`
- `encomendas`: `codigoRastreamento` (único)
- Período: campo de data + `statusAtual == ENTREGUE`

## Acesso

Nunca importe Firestore em `src/app` ou `src/components`. Só `src/server/**` e `src/lib/firebase/**`.
