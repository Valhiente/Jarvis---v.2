# Atlas Autonomous V1 — experimento

Esta versão preserva a interface e o backend do Atlas 0.2.0. Os módulos iniciais em `bridge/autonomous/` são **experimentais** e ainda não estão ligados ao fluxo de conversa nem às ferramentas reais.

## Componentes
- `memory.mjs`: armazenamento local JSON com consentimento explícito, busca simples e exclusão por ID.
- `guardian.mjs`: política de negação por padrão; ações críticas requerem aprovação.
- `tests/autonomous.test.mjs`: testes unitários dos dois módulos.

## Próximas integrações necessárias
1. Criar tela de consentimento e gestão de memórias; não importar conversas automaticamente.
2. Integrar recuperação contextual ao `CodexSession`, com isolamento de conteúdo não confiável.
3. Integrar Guardian ao despachante de ferramentas, com aprovação vinculada à ação concreta.
4. Criar executor em sandbox com limites de rede, recursos, duração e diretórios.
5. Implementar fila de objetivos, agendamento, auditoria e botão de interrupção.
6. Validar com `npm ci && npm test && npm run lint && npm run typecheck && npm run build`.
7. Testar login e conversa reais via `npm run doctor -- --ask`.

**Atenção:** este commit não concede autonomia operacional. Não usar o parâmetro `approved` como autorização proveniente do modelo; aprovações devem ser verificadas fora do modelo e vinculadas ao usuário, ação e prazo.
