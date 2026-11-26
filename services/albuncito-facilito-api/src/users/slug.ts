// Slugs que chocan con rutas del frontend
export const RESERVED_SLUGS = new Set(['login', 'signup', 'logout', 'api']);

// "Ana Pérez" -> "ana-perez"
export function slugify(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'user';
}

// Devuelve un slug libre: base, base-2, base-3...
export function uniqueSlug(name: string, isTaken: (slug: string) => boolean): string {
  const base = slugify(name);
  let candidate = base;
  let suffix = 2;
  while (RESERVED_SLUGS.has(candidate) || isTaken(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}
