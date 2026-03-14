#!/usr/bin/env node
/**
 * Stream Coolify runtime + deployment logs to your local terminal.
 *
 * Usage:
 *   COOLIFY_TOKEN=<token> node scripts/coolify-logs.mjs
 *   COOLIFY_TOKEN=<token> node scripts/coolify-logs.mjs <app-uuid>
 */

const BASE_URL = 'https://coolify.nobodies.team/api/v1'
const TOKEN = process.env.COOLIFY_TOKEN

if (!TOKEN) {
  console.error('Error: set COOLIFY_TOKEN environment variable')
  process.exit(1)
}

const headers = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }

async function api(path) {
  const res = await fetch(`${BASE_URL}${path}`, { headers })
  if (!res.ok) throw new Error(`API ${path} → ${res.status} ${await res.text()}`)
  return res.json()
}

function formatLog(raw, prefix) {
  try {
    const obj = JSON.parse(raw)
    const time = obj.time?.$date ? new Date(obj.time.$date).toISOString() : ''
    const level = (obj.level || 'info').toUpperCase().padEnd(5)
    const msg = obj.message || raw
    console.log(`${prefix} ${time} [${level}] ${msg}`)
  } catch {
    if (raw.trim()) console.log(`${prefix} ${raw}`)
  }
}

async function listApps() {
  const apps = await api('/applications')
  console.log('\nAvailable applications:')
  for (const app of apps) {
    console.log(`  ${app.name.padEnd(30)} uuid: ${app.uuid}  status: ${app.status}`)
  }
  console.log('\nRe-run with: COOLIFY_TOKEN=... node scripts/coolify-logs.mjs <uuid>\n')
}

async function pollRuntimeLogs(uuid) {
  let seenLines = new Set()

  async function check() {
    try {
      const data = await api(`/applications/${uuid}/logs`)
      const raw = data.logs || data
      const text = typeof raw === 'string' ? raw : JSON.stringify(raw)
      const lines = text.split('\n')
      for (const line of lines) {
        if (!line.trim() || seenLines.has(line)) continue
        seenLines.add(line)
        formatLog(line, '[runtime]')
      }
    } catch (err) {
      console.error(`[runtime] poll error: ${err.message}`)
    }
  }

  console.log('[runtime] Polling logs every 10s...\n')
  await check()
  setInterval(check, 10000)
}

async function pollDeploymentLogs(uuid) {
  // Try multiple possible endpoint patterns
  const endpoints = [
    `/deployments?application_uuid=${uuid}`,
    `/applications/${uuid}/deployment`,
    `/applications/${uuid}/deployments?per_page=1`,
  ]

  let workingEndpoint = null
  for (const ep of endpoints) {
    try {
      const res = await fetch(`${BASE_URL}${ep}`, { headers })
      if (res.ok) { workingEndpoint = ep; break }
    } catch {}
  }

  if (!workingEndpoint) {
    console.log('[deploy] Deployment log endpoint not found — skipping. Only runtime logs active.\n')
    return
  }

  let lastDeploymentUuid = null
  let lastLogLength = 0

  async function check() {
    try {
      const deployments = await api(workingEndpoint)
      const list = Array.isArray(deployments) ? deployments : deployments.data || []
      if (!list.length) return

      const latest = list[0]
      const depUuid = latest.deployment_uuid || latest.uuid
      const isNew = depUuid !== lastDeploymentUuid

      if (isNew) {
        lastDeploymentUuid = depUuid
        lastLogLength = 0
        console.log(`\n[deploy] Deployment ${depUuid} — status: ${latest.status}`)
      }

      try {
        const detail = await api(`/deployments/${depUuid}`)
        const logs = detail.logs || ''
        const lines = logs.split('\n')
        if (lines.length > lastLogLength) {
          for (const line of lines.slice(lastLogLength)) {
            if (line.trim()) console.log(`[deploy] ${line}`)
          }
          lastLogLength = lines.length
        }
      } catch {}
    } catch (err) {
      console.error(`[deploy] poll error: ${err.message}`)
    }
  }

  console.log(`[deploy] Polling deployment logs every 5s (${workingEndpoint})...\n`)
  await check()
  setInterval(check, 5000)
}

async function main() {
  const uuid = process.argv[2]

  if (!uuid) {
    await listApps()
    return
  }

  console.log(`Connecting to app ${uuid} on https://coolify.nobodies.team\n`)
  await Promise.all([
    pollRuntimeLogs(uuid).catch(e => console.error('[runtime]', e.message)),
    pollDeploymentLogs(uuid).catch(e => console.error('[deploy]', e.message)),
  ])
}

main().catch(err => { console.error(err); process.exit(1) })
