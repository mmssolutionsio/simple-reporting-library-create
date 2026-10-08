#!/usr/bin/env node
// Builds template/ from the playground (source of truth for the project skeleton) and template-base/.
//   node packages/create/sync-template.mjs [--check]
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative } from 'node:path'

const here = import.meta.dirname
const playground = join(here, '../../playground')
const FROM_PLAYGROUND = ['app', 'pdf', 'public', 'nuxt.config.ts', 'tsconfig.json', 'srl.config.ts', 'livingdocs.config.json']

function build(target) {
  rmSync(target, { recursive: true, force: true })
  cpSync(join(here, 'template-base'), target, { recursive: true })
  for (const entry of FROM_PLAYGROUND) {
    if (existsSync(join(playground, entry))) cpSync(join(playground, entry), join(target, entry), { recursive: true })
  }
}

function files(dir) {
  const result = new Map()
  const walk = (current) => {
    for (const name of readdirSync(current)) {
      const full = join(current, name)
      if (statSync(full).isDirectory()) walk(full)
      else result.set(relative(dir, full), readFileSync(full, 'utf8'))
    }
  }
  walk(dir)
  return result
}

const template = join(here, 'template')
if (process.argv.includes('--check')) {
  const fresh = mkdtempSync(join(tmpdir(), 'srl-template-'))
  build(fresh)
  const a = files(fresh)
  const b = existsSync(template) ? files(template) : new Map()
  const diff = [...new Set([...a.keys(), ...b.keys()])].filter((f) => a.get(f) !== b.get(f))
  if (diff.length) {
    console.error(`template/ is out of sync with the playground:\n  ${diff.join('\n  ')}\nRun: node packages/create/sync-template.mjs`)
    process.exit(1)
  }
  console.log('template/ is in sync.')
} else {
  build(template)
  console.log('template/ updated from playground.')
}
