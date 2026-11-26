import { PasswordService } from './password.service.js';

describe('PasswordService', () => {
  const service = new PasswordService();

  it('guarda un hash scrypt y nunca la contraseña en texto plano', async () => {
    const hash = await service.hash('mi-clave-segura');
    expect(hash.startsWith('scrypt$')).toBe(true);
    expect(hash).not.toContain('mi-clave-segura');
  });

  it('genera hashes distintos para la misma contraseña (sal aleatoria)', async () => {
    const first = await service.hash('mi-clave-segura');
    const second = await service.hash('mi-clave-segura');
    expect(first).not.toBe(second);
  });

  it('verifica la contraseña correcta y rechaza la incorrecta', async () => {
    const hash = await service.hash('mi-clave-segura');
    expect(await service.verify('mi-clave-segura', hash)).toBe(true);
    expect(await service.verify('otra-clave', hash)).toBe(false);
  });

  it('rechaza siempre cuando no hay hash guardado', async () => {
    expect(await service.verify('lo-que-sea', undefined)).toBe(false);
  });
});
