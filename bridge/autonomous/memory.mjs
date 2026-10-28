import { mkdir, readFile, writeFile, rename } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { homedir } from 'node:os'
import { randomUUID } from 'node:crypto'

export class AtlasMemory {
  constructor(file = join(homedir(), '.atlas-v2', 'memory.json')) { this.file = file }
  async load() {
    try {
      const data = JSON.parse(await readFile(this.file, 'utf8'))
      return Array.isArray(data.entries) ? data.entries : []
    } catch (error) {
      if (error.code === 'ENOENT') return []
      throw error
    }
  }
  async save(entries) {
    await mkdir(dirname(this.file), { recursive: true, mode: 0o700 })
    const temp = this.file + '.' + randomUUID() + '.tmp'
    await writeFile(temp, JSON.stringify({ version: 1, entries }, null, 2), { mode: 0o600 })
    await rename(temp, this.file)
  }
  async remember(text, { category = 'conversation', consent = false } = {}) {
    if (!consent) throw new Error('Memória persistente exige consentimento explícito.')
    if (typeof text !== 'string' || !text.trim() || text.length > 10000) throw new Error('Memória inválida.')
    const entries = await this.load()
    const entry = { id: randomUUID(), category, text: text.trim(), createdAt: new Date().toISOString() }
    entries.push(entry)
    await this.save(entries.slice(-500))
    return entry
  }
  async forget(id) {
    const entries = await this.load()
    const filtered = entries.filter(item => item.id !== id)
    await this.save(filtered)
    return entries.length !== filtered.length
  }
  async context(query, limit = 8) {
    const words = new Set(String(query).toLocaleLowerCase('pt-BR').match(/[\\p{L}\\p{N}]{3,}/gu) || [])
    return (await this.load()).map(entry => ({
      entry, score: [...words].filter(word => entry.text.toLocaleLowerCase('pt-BR').includes(word)).length
    })).filter(x => x.score > 0).sort((a,b) => b.score - a.score).slice(0, limit).map(x => x.entry)
  }
}
