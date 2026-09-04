/**
 * Node's type-stripping runs .ts files but resolves specifiers more strictly
 * than a bundler: no implicit extension, and no directory -> index. This hook
 * adds both so engine and data modules import the same way they do under Vite.
 */
import { existsSync } from 'node:fs'

export function resolve(specifier, context, next) {
  if (specifier.startsWith('.') && !/\.[a-z]+$/i.test(specifier)) {
    const base = new URL(specifier, context.parentURL)
    for (const candidate of ['.ts', '.tsx', '/index.ts', '/index.tsx']) {
      const url = base.href + candidate
      if (existsSync(new URL(url))) return next(url, context)
    }
  }
  return next(specifier, context)
}
