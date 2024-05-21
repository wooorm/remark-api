/**
 * @typedef {import('vfile-message').VFileMessage} VFileMessage
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import process from 'node:process'
import test from 'node:test'
import {remark} from 'remark'
import remarkApi from 'remark-api'
import {read, write} from 'to-vfile'
import {VFile} from 'vfile'

test('remark-api', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('remark-api')).sort(), [
      'default'
    ])
  })
})

test('fixtures', async function (t) {
  const base = new URL('fixtures/', import.meta.url)
  const folders = await fs.readdir(base)

  const rootPackageUrl = new URL('../package.json', import.meta.url)
  const backupPackageUrl = new URL('../package.json.bak', import.meta.url)

  await fs.rename(rootPackageUrl, backupPackageUrl)

  for (const folder of folders) {
    if (folder.charAt(0) === '.') continue

    await t.test(folder, async function () {
      const folderUrl = new URL(folder + '/', base)
      const outputMarkdownUrl = new URL('output.md', folderUrl)
      const outputJsonUrl = new URL('output.json', folderUrl)
      const input = await read(new URL('input.md', folderUrl))
      const processor = remark().use(remarkApi)

      input.value = String(input).replace(/\r\n/g, '\n')

      await processor.process(input)

      /** @type {VFile} */
      let outputMarkdown

      try {
        if ('UPDATE' in process.env) {
          throw new Error('Updating…')
        }

        outputMarkdown = await read(outputMarkdownUrl)
        outputMarkdown.value = String(outputMarkdown).replace(/\r\n/g, '\n')
      } catch {
        outputMarkdown = new VFile({
          path: outputMarkdownUrl,
          value: String(input)
        })
        await write(outputMarkdown)
      }

      /** @type {Array<VFileMessage>} */
      const simplified = JSON.parse(JSON.stringify(input.messages))
      for (const message of simplified) {
        dropPath(message)
      }

      /** @type {Array<VFileMessage>} */
      let outputJson

      try {
        if ('UPDATE' in process.env) {
          throw new Error('Updating…')
        }

        outputJson = JSON.parse(await fs.readFile(outputJsonUrl, 'utf8'))
      } catch {
        outputJson = simplified
        await fs.writeFile(
          outputJsonUrl,
          JSON.stringify(simplified, undefined, 2) + '\n'
        )
      }

      assert.equal(String(input), String(outputMarkdown))
      assert.deepEqual(simplified, outputJson)
    })
  }

  await fs.rename(backupPackageUrl, rootPackageUrl)
})

/**
 * @param {Error} message
 *   Message.
 * @returns {undefined}
 *   Nothing.
 */
function dropPath(message) {
  if ('file' in message && typeof message.file === 'string') {
    message.file = dropDirname(message.file)
  }

  if ('name' in message) {
    message.name = dropDirname(message.name)
  }

  if (message.cause) {
    dropPath(/** @type {Error} */ (message.cause))
  }
}

/**
 * @param {string} value
 *   Message.
 * @returns {string}
 *   Nothing.
 */
function dropDirname(value) {
  const slash = value.lastIndexOf('/')
  const backslash = value.lastIndexOf('\\')
  const lastIndex = slash > backslash ? slash : backslash
  return lastIndex > -1 ? value.slice(lastIndex + 1) : value
}
