const BASE = 'http://localhost:3000';

async function request(method, url, body = null, token = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: res.status, data };
}

async function main() {
  console.log('1. GET /api/pokemons (sans auth) …');
  const r1 = await request('GET', `${BASE}/api/pokemons?limit=1`);
  console.log('   Status:', r1.status, r1.status === 200 ? 'OK' : r1.data);

  console.log('2. POST /api/pokemons sans token …');
  const r2 = await request('POST', `${BASE}/api/pokemons`, { id: 999, name: { english: 'Test', french: 'Test' }, type: ['Normal'], base: { HP: 1, Attack: 1, Defense: 1, Speed: 1 } });
  console.log('   Status:', r2.status, r2.status === 401 ? 'OK (auth requise)' : r2.data);

  console.log('3. POST /api/auth/register sacha …');
  const r3 = await request('POST', `${BASE}/api/auth/register`, { username: 'sacha', password: 'pikachu' });
  console.log('   Status:', r3.status, r3.data?.message || r3.data?.error || r3.data);

  console.log('4. POST /api/auth/login sacha …');
  const r4 = await request('POST', `${BASE}/api/auth/login`, { username: 'sacha', password: 'pikachu' });
  console.log('   Status:', r4.status, r4.data?.token ? 'token reçu' : r4.data);

  if (r4.data?.token) {
    console.log('5. POST /api/pokemons avec token …');
    const r5 = await request('POST', `${BASE}/api/pokemons`, { id: 999, name: { english: 'Test', french: 'Test' }, type: ['Normal'], base: { HP: 1, Attack: 1, Defense: 1, Speed: 1 } }, r4.data.token);
    console.log('   Status:', r5.status, r5.status === 201 ? 'OK (créé)' : r5.data);
  }

  console.log('\nVérification terminée.');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
