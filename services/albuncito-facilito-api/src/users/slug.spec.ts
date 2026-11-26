import { slugify, uniqueSlug } from './slug.js';

describe('slug', () => {
  it('quita acentos, espacios y símbolos', () => {
    expect(slugify('Ana Pérez')).toBe('ana-perez');
    expect(slugify('  María  José!! ')).toBe('maria-jose');
  });

  it('usa "user" si el nombre no deja caracteres válidos', () => {
    expect(slugify('***')).toBe('user');
  });

  it('agrega un sufijo cuando el slug ya existe', () => {
    const taken = new Set(['ana-perez', 'ana-perez-2']);
    expect(uniqueSlug('Ana Pérez', (slug) => taken.has(slug))).toBe('ana-perez-3');
  });

  it('evita los slugs reservados por rutas del frontend', () => {
    expect(uniqueSlug('Login', () => false)).toBe('login-2');
    expect(uniqueSlug('signup', () => false)).toBe('signup-2');
  });
});
