/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Assert } from '../assert'
import { FileSystem } from './fileSystem'

export class NodeFileProvider extends FileSystem {
  fs: typeof import('fs').promises | null = null
  path: typeof import('path') | null = null
  os: typeof import('os') | null = null

  async init(): Promise<FileSystem> {
    this.fs = (await import('fs')).promises
    this.path = await import('path')
    this.os = await import('os')
    return this
  }

  async writeFile(path: string, data: string): Promise<void> {
    Assert.isNotNull(this.fs, `Must call FileSystem.init()`)
    await this.fs.writeFile(path, data)
  }

  async readFile(path: string): Promise<string> {
    Assert.isNotNull(this.fs, `Must call FileSystem.init()`)
    return await this.fs.readFile(path, { encoding: 'utf8' })
  }

  async mkdir(path: string, options: { recursive?: boolean }): Promise<void> {
    Assert.isNotNull(this.fs, `Must call FileSystem.init()`)
    await this.fs.mkdir(path, options)
  }

  resolve(path: string): string {
    Assert.isNotNull(this.path, `Must call FileSystem.init()`)
    return this.path.resolve(this.expandTilde(path))
  }

  join(...paths: string[]): string {
    Assert.isNotNull(this.path, `Must call FileSystem.init()`)
    return this.path.join(...paths)
  }

  /**
   * Expands a path out using known unix shell shortcuts
   * ~ expands to your home directory
   * ~+ expands to your current directory
   *
   * @param filePath The filepath to expand out using unix shortcuts
   */
  private expandTilde(filePath: string): string {
    Assert.isNotNull(this.os)
    Assert.isNotNull(this.path)

    const CHAR_TILDE = 126
    const CHAR_PLUS = 43
    const home = this.os.homedir()

    if (filePath.charCodeAt(0) === CHAR_TILDE) {
      if (filePath.charCodeAt(1) === CHAR_PLUS) {
        return this.path.join(process.cwd(), filePath.slice(2))
      }

      if (!home) return filePath

      return this.path.join(home, filePath.slice(1))
    }

    return filePath
  }
}
