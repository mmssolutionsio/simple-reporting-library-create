// npm create @simple-reporting@alpha <folder> [--livingdocs <pkg>|none] [--yes] [--no-install] [--no-git]
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import * as p from '@clack/prompts'

const templateDir = fileURLToPath(new URL('../template', import.meta.url))
const ownPackage = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

export function packageName(folder) {
  return basename(resolve(folder))
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^[-._]+|[-._]+$/g, '')
}

/** Writes project.livingdocs.alternative into the template srl.config.ts. */
export function setLivingdocsAlternative(configSource, alternative) {
  const value = alternative ? `'${alternative}'` : 'null'
  return configSource.replace(/alternative:\s*[^,\n}]+/, `alternative: ${value}`)
}

export function parseCliArgs(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      livingdocs: { type: 'string' },
      yes: { type: 'boolean', short: 'y' },
      install: { type: 'boolean', default: true },
      'no-install': { type: 'boolean' },
      git: { type: 'boolean', default: true },
      'no-git': { type: 'boolean' },
      // local development: use file: links to the monorepo packages
      local: { type: 'string' },
    },
  })
  return {
    folder: positionals[0],
    livingdocs: values.livingdocs,
    yes: !!values.yes,
    install: values.install && !values['no-install'],
    git: values.git && !values['no-git'],
    local: values.local,
  }
}

export async function create(options) {
  const target = resolve(options.folder)
  if (existsSync(target) && readdirSync(target).length) throw new Error(`${target} exists and is not empty.`)

  cpSync(templateDir, target, { recursive: true })
  // npm strips .gitignore from published packages
  if (existsSync(join(target, '_gitignore'))) renameSync(join(target, '_gitignore'), join(target, '.gitignore'))

  const pkgFile = join(target, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'))
  pkg.name = options.name ?? packageName(target)
  pkg.version = '0.0.1'
  const coreRange = `^${ownPackage.version}`
  pkg.dependencies['@simple-reporting/core'] = options.local ? `file:${join(options.local, 'packages/core')}` : coreRange
  pkg.dependencies['@simple-reporting/livingdocs'] = options.local ? `file:${join(options.local, 'packages/livingdocs')}` : coreRange
  if (options.livingdocs) pkg.dependencies[options.livingdocs] = 'latest'
  writeFileSync(pkgFile, `${JSON.stringify(pkg, null, 2)}\n`)

  const configFile = join(target, 'srl.config.ts')
  writeFileSync(configFile, setLivingdocsAlternative(readFileSync(configFile, 'utf8'), options.livingdocs ?? null))

  const run = (cmd, args) => execFileSync(cmd, args, { cwd: target, stdio: 'inherit' })
  if (options.install) {
    run('npm', ['install'])
    run('npx', ['srl', 'add', 'components', '--defaults'])
  }
  if (options.git) {
    run('git', ['init', '-q'])
    run('git', ['add', '-A'])
    run('git', ['commit', '-q', '-m', 'init'])
  }
  return target
}

export async function main(argv) {
  const args = parseCliArgs(argv)
  p.intro(`@simple-reporting/create ${ownPackage.version}`)
  let folder = args.folder
  if (!folder) {
    if (args.yes) throw new Error('Pass the project folder: npm create @simple-reporting@alpha <folder>')
    const answer = await p.text({ message: 'Project folder', placeholder: 'my-report' })
    if (p.isCancel(answer)) return p.cancel('Cancelled.')
    folder = answer
  }
  let livingdocs = args.livingdocs
  if (livingdocs === undefined && !args.yes) {
    const answer = await p.text({
      message: 'Alternative livingdocs package (npm name, empty for none)',
      placeholder: '@acme/livingdocs',
      defaultValue: '',
    })
    if (p.isCancel(answer)) return p.cancel('Cancelled.')
    livingdocs = answer.trim()
  }
  const target = await create({ ...args, folder, livingdocs: livingdocs && livingdocs !== 'none' ? livingdocs : null })
  p.outro(`Project created in ${target}\n\n  cd ${args.folder ?? folder}\n  npx srl data import <nswow preview zip>\n  npm run dev`)
}
