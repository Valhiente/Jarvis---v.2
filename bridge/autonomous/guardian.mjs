export const CRITICAL_ACTIONS = new Set([
  'production.deploy', 'data.delete', 'payment.send', 'message.send',
  'credentials.read', 'permissions.change', 'git.force_push', 'git.merge_main'
])
export const SAFE_ACTIONS = new Set([
  'code.read', 'code.analyze', 'test.run', 'git.branch_create',
  'git.commit_experiment', 'memory.read', 'web.read'
])
export function authorizeAction({ action, environment = 'sandbox', approved = false }) {
  if (!action || typeof action !== 'string') return { allowed: false, reason: 'Ação inválida' }
  if (CRITICAL_ACTIONS.has(action)) return approved
    ? { allowed: true, reason: 'Aprovação explícita fornecida' }
    : { allowed: false, reason: 'Exige aprovação explícita' }
  if (environment !== 'sandbox') return { allowed: false, reason: 'Ambiente fora do sandbox' }
  if (!SAFE_ACTIONS.has(action)) return { allowed: false, reason: 'Ação não permitida pela política' }
  return { allowed: true, reason: 'Permitida no ambiente isolado' }
}
