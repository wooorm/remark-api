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
      const outputUrl = new URL('output.md', folderUrl)
      const input = await read(new URL('input.md', folderUrl))
      const processor = remark().use(remarkApi)

      await processor.process(input)

      /** @type {VFile} */
      let output

      try {
        if ('UPDATE' in process.env) {
          throw new Error('Updating…')
        }

        output = await read(outputUrl)
      } catch {
        output = new VFile({path: outputUrl, value: String(input)})
        await write(output)
      }

      assert.equal(String(input), String(output))
    })
  }

  await fs.rename(backupPackageUrl, rootPackageUrl)
})
