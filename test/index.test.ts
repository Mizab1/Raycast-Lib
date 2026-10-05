import { expect, test } from 'bun:test'
import os from 'node:os'
import { sep } from 'path'

const CLI = Bun.spawn({
  cmd: ['bun', 'dev:test-build'],
  cwd: import.meta.dirname,
  stdout: 'pipe',
  windowsHide: true,
  windowsVerbatimArguments: true,
})

const reader = CLI.stdout.getReader()

const decoder = new TextDecoder()

class ShellLine {
  constructor(public rawLine: string, public i: number, public chunkI: number, public lines: number) { }

  get line() {
    return this.rawLine.replace(/\u001b\[.*?m/g, '')
  }
}

const rawLines: string[] = []

async function* shell() {
  let done = false

  let globalI = 0

  while (!done) {
    const chunk = await reader.read()

    if (chunk.done) {
      done = true
    } else {
      let lines = decoder.decode(chunk.value, { stream: true }).split('\n')

      for (let i = 0; i < lines.length; i++) {
        rawLines.push(lines[i])
        yield new ShellLine(lines[i], globalI++, i, lines.length)
      }
    }
  }
}

const pathLineRegex = new RegExp(/^Path: ([\w\/\\\.]+)$/)

let resourcesStarted = false

let currentResourcePath = ''

let firstResource = true

let currentResource: string[] = []

const tests: Promise<void>[] = []

async function runTest(path: string, lines: string[]) {
  test(path, async () => {
    if (!path.endsWith('.glsl')) {
      expect(lines.length).not.toBe(0)
    }
    if (path.endsWith('.json')) {
      let parsed: any
      let error: unknown
      try {
        parsed = JSON.parse(lines.join('\n'))
      } catch (e) {
        error = e
      }
      expect(error).toBe(undefined)
      expect(parsed).toMatchSnapshot()
    } else if (path.endsWith('.mcfunction')) {
      for (const line of lines) {
        expect(line).toMatch(/^[\$\#a-z]/)
        expect(line).toMatchSnapshot()
      }
      expect(lines.length).toMatchSnapshot('Length')
    } else if (lines.length === 1) {
      expect(lines[0]).toMatchSnapshot()
    } else {
      expect(lines).toMatchSnapshot()
    }
  })
}

for await (const { line, rawLine } of shell()) {
  if (line === '') {
    continue
  }
  if (line === 'Compiling source...') {
    resourcesStarted = true
    continue
  }
  if (!resourcesStarted) {
    continue
  }

  const pathLine = pathLineRegex.exec(line)

  if (pathLine && pathLine[1] !== '') {
    if (firstResource) {
      firstResource = false
    } else {
      tests.push(runTest(currentResourcePath, currentResource))
      currentResource = []
    }
    if (os.platform()) {
      currentResourcePath = pathLine[1].replaceAll(sep, '/')
    } else {
      currentResourcePath = pathLine[1]
    }
    continue
  }
  if (line.startsWith('Pack(s) compiled!')) {
    tests.push(runTest(currentResourcePath, currentResource))
    currentResource = []

    continue
  }

  currentResource.push(line)
}

await Promise.allSettled(tests)

test('file_count', () => {
  expect(tests.length).toMatchSnapshot('File Count')
})

const exitCode = await CLI.exited

test('cli_succeeded', () => {
  expect(exitCode).toBe(0)
})