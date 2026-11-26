import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

// Parámetros de scrypt recomendados por OWASP (N=2^15, r=8, p=3)
const COST = 2 ** 15;
const BLOCK_SIZE = 8;
const PARALLELISM = 3;
const KEY_LENGTH = 64;
const MAX_MEMORY = 128 * 1024 * 1024;

function deriveKey(
  password: string,
  salt: Buffer,
  cost: number,
  blockSize: number,
  parallelism: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password.normalize('NFKC'),
      salt,
      KEY_LENGTH,
      { N: cost, r: blockSize, p: parallelism, maxmem: MAX_MEMORY },
      (error, key) => (error ? reject(error) : resolve(key)),
    );
  });
}

@Injectable()
export class PasswordService {
  // Hash falso para que verificar un email inexistente tarde lo mismo que uno real
  private dummyHash?: Promise<string>;

  // Formato: scrypt$N$r$p$salt$hash (los parámetros viajan con el hash)
  async hash(password: string): Promise<string> {
    const salt = randomBytes(16);
    const key = await deriveKey(password, salt, COST, BLOCK_SIZE, PARALLELISM);
    return `scrypt$${COST}$${BLOCK_SIZE}$${PARALLELISM}$${salt.toString('hex')}$${key.toString('hex')}`;
  }

  async verify(password: string, storedHash: string | undefined): Promise<boolean> {
    const hash = storedHash ?? (await this.getDummyHash());
    const [algorithm, cost, blockSize, parallelism, salt, key] = hash.split('$');
    if (algorithm !== 'scrypt' || !salt || !key) {
      return false;
    }
    const expected = Buffer.from(key, 'hex');
    const actual = await deriveKey(
      password,
      Buffer.from(salt, 'hex'),
      Number(cost),
      Number(blockSize),
      Number(parallelism),
    );
    // Comparación en tiempo constante; sin hash guardado nunca es válido
    const matches = actual.length === expected.length && timingSafeEqual(actual, expected);
    return matches && storedHash !== undefined;
  }

  private getDummyHash(): Promise<string> {
    this.dummyHash ??= this.hash('dummy-password');
    return this.dummyHash;
  }
}
