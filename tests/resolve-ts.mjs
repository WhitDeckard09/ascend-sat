/**
 * Node's type-stripping runs .ts files but won't resolve extensionless relative
 * imports the way a bundler does. This hook adds the .ts extension so engine
 * modules can be imported directly in tests.
 */
import { existsSync } from 'node:fs'

export function resolve(specifier, context, next) {
  if (specifier.startsWith('.') && !/\.[a-z]+$/i.test(specifier)) {
    const base = new URL(specifier, context.parentURL)
    for (const ext of ['.ts', '.tsx']) {
      if (existsSync(new URL(base.href + ext))) return next(base.href + ext, context)
    }
  }
  return next(specifier, context)
}
