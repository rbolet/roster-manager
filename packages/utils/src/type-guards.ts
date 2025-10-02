/**
 * Type guard utilities
 */

/**
 * Type guard to check if value is a plain object (not array, null, etc.)
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]' && value !== null;
}
