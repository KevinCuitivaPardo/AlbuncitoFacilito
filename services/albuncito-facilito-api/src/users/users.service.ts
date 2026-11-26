import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { uniqueSlug } from './slug.js';

export interface User {
  id: number;
  name: string;
  slug: string;
  email: string;
}

// Solo se usa para verificar el login: el hash nunca sale de la API
export interface UserWithPasswordHash extends User {
  passwordHash: string;
}

interface UserRow {
  id: number;
  name: string;
  slug: string;
  email: string;
  password_hash: string;
}

const toUser = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  email: row.email,
});

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  // Crea el usuario con un slug único; el hash ya viene calculado
  create(name: string, email: string, passwordHash: string): User {
    const slug = uniqueSlug(name, (candidate) => this.findBySlug(candidate) !== null);
    const result = this.database.db
      .prepare('INSERT INTO users (name, slug, email, password_hash) VALUES (?, ?, ?, ?)')
      .run(name, slug, email, passwordHash);
    return { id: Number(result.lastInsertRowid), name, slug, email };
  }

  findById(id: number): User | null {
    const row = this.database.db.prepare('SELECT * FROM users WHERE id = ?').get(id) as
      | UserRow
      | undefined;
    return row ? toUser(row) : null;
  }

  findBySlug(slug: string): User | null {
    const row = this.database.db.prepare('SELECT * FROM users WHERE slug = ?').get(slug) as
      | UserRow
      | undefined;
    return row ? toUser(row) : null;
  }

  findByEmail(email: string): UserWithPasswordHash | null {
    const row = this.database.db.prepare('SELECT * FROM users WHERE email = ?').get(email) as
      | UserRow
      | undefined;
    return row ? { ...toUser(row), passwordHash: row.password_hash } : null;
  }
}
