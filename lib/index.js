/* eslint-disable no-await-in-loop */
/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').RootContent} RootContent
 *
 * @typedef {import('vfile').VFile} VFile
 */

import path from 'node:path'
import {pathToFileURL} from 'node:url'
import {headingRange} from 'mdast-util-heading-range'
import {packageExports} from 'package-exports'
import {createFinder, defaultFormat} from 'module-exports'
import {findUp} from 'vfile-find-up'

/**
 * Generate an API section.
 *
 * Looks for the closest `package.json` file upwards from the current
 * markdown file.
 * For each export in the package, it generates API docs.
 * It injects those into an `# API` section.
 *
 * @returns
 *   Transform.
 */
export default function remarkApi() {
  const finder = createFinder()

  // If there is no export maps, and no `files`, then everything is exported.
  // That includes markdown and `license` and `.gitignore` and whatever.
  // So, for now, just ignore all that and only allow JS.
  const allowedExtensionNames = new Set(['cjs', 'js', 'mjs'])

  /**
   * @param {Root} tree
   * @param {VFile} file
   * @returns {Promise<undefined>}
   */
  return async function (tree, file) {
    /* c8 ignore next -- else is for stdin, typically not used. */
    const base = file.dirname ? path.resolve(file.cwd, file.dirname) : file.cwd
    const packageFile = await findUp('package.json', base)

    if (!packageFile) {
      return
    }

    const folderUrl = new URL('.', pathToFileURL(packageFile.path))
    const exportsResult = await packageExports(folderUrl)
    /** @type {Array<RootContent>} */
    const content = []

    /** @type {Set<string>} */
    const seen = new Set()

    for (const exported of exportsResult.exports) {
      const extensionName = path.extname(exported.url).slice(1)

      if (!allowedExtensionNames.has(extensionName)) {
        continue
      }

      if (seen.has(exported.url)) {
        continue
      }

      seen.add(exported.url)

      const result = await finder(new URL(exported.url))
      const formatted = await defaultFormat(result.symbols)
      content.push(...formatted.children)
    }

    headingRange(
      tree,
      {ignoreFinalDefinitions: true, test: 'api'},
      function (start, _, end) {
        return [start, ...content, end]
      }
    )
  }
}
