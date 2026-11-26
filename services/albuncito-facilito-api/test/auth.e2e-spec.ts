import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { DatabaseService } from '../src/database/database.service.js';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let database: DatabaseService;
  const ana = { name: 'Ana Pérez', email: 'ana@example.com', password: 'clave-segura-1' };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    database = app.get(DatabaseService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('signup crea el usuario, devuelve token y slug', async () => {
    const res = await request(app.getHttpServer()).post('/auth/signup').send(ana).expect(201);
    expect(res.body.accessToken).toEqual(expect.any(String));
    expect(res.body.user).toMatchObject({ name: 'Ana Pérez', slug: 'ana-perez', email: ana.email });
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it('guarda la contraseña con hash, nunca en texto plano', () => {
    const row = database.db
      .prepare('SELECT password_hash FROM users WHERE email = ?')
      .get(ana.email) as { password_hash: string };
    expect(row.password_hash.startsWith('scrypt$')).toBe(true);
    expect(row.password_hash).not.toContain(ana.password);
  });

  it('signup con email repetido responde 409', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ ...ana, email: 'ANA@example.com' })
      .expect(409);
  });

  it('dos usuarios con el mismo nombre reciben slugs distintos', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ ...ana, email: 'ana2@example.com' })
      .expect(201);
    expect(res.body.user.slug).toBe('ana-perez-2');
  });

  it('signup valida los campos', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ name: 'A', email: 'no-es-email', password: 'corta' })
      .expect(400);
  });

  it('login correcto devuelve token y usuario', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: ana.email, password: ana.password })
      .expect(200);
    expect(res.body.accessToken).toEqual(expect.any(String));
    expect(res.body.user.slug).toBe('ana-perez');
  });

  it('login con contraseña incorrecta o email desconocido responde 401', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: ana.email, password: 'incorrecta' })
      .expect(401);
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'nadie@example.com', password: 'lo-que-sea' })
      .expect(401);
  });

  it('GET /auth/me exige un token válido', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: ana.email, password: ana.password });
    const res = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .expect(200);
    expect(res.body).toMatchObject({ slug: 'ana-perez', email: ana.email });

    await request(app.getHttpServer()).get('/auth/me').expect(401);
    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer token-falso')
      .expect(401);
  });
});
