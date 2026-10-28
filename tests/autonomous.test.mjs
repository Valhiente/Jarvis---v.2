import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { AtlasMemory } from '../bridge/autonomous/memory.mjs'
import { authorizeAction } from '../bridge/autonomous/guardian.mjs'

test('memória exige consentimento, persiste e permite exclusão', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'atlas-v2-'))
  try {
    const memory = new AtlasMemory(join(dir, 'memory.json'))
    await assert.rejects(memory.remember('Preferência privada'))
    const entry = await memory.remember('Prefiro respostas curtas', { consent: true })
    assert.equal((await new AtlasMemory(memory.file).context('respostas')).length, 1)
    assert.equal(await memory.forget(entry.id), true)
    assert.deepEqual(await memory.load(), [])
  } finally { await rm(dir, { recursive: true, force: true }) }
})
test('guardian bloqueia ações críticas e ações desconhecidas', () => {
  assert.equal(authorizeAction({ action: 'test.run' }).allowed, true)
  assert.equal(authorizeAction({ action: 'payment.send' }).allowed, false)
  assert.equal(authorizeAction({ action: 'git.force_push' }).allowed, false)
  assert.equal(authorizeAction({ action: 'shell.unrestricted' }).allowed, false)
  assert.equal(authorizeAction({ action: 'test.run', environment: 'production' }).allowed, false)
})
