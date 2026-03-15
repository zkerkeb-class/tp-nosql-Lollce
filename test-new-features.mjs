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
  console.log('--- 6.B GET /api/stats ---');
  const stats = await request('GET', `${BASE}/api/stats`);
  console.log('Status:', stats.status);
  if (stats.status === 200 && stats.data) {
    console.log('byType (3 premiers):', stats.data.byType?.slice(0, 3));
    console.log('maxAttack:', stats.data.maxAttack?.name?.english);
    console.log('maxHp:', stats.data.maxHp?.name?.english);
  } else console.log(stats.data);

  console.log('\n--- Login pour favoris et équipes ---');
  const login = await request('POST', `${BASE}/api/auth/login`, { username: 'sacha', password: 'pikachu' });
  const token = login.data?.token;
  if (!token) {
    console.log('Login échoué:', login.data);
    return;
  }
  console.log('Token OK');

  console.log('\n--- 6.A GET /api/favorites ---');
  const fav = await request('GET', `${BASE}/api/favorites`, null, token);
  console.log('Status:', fav.status, fav.data?.favorites?.length ?? fav.data);

  console.log('\n--- 6.A POST /api/favorites/25 ---');
  const addFav = await request('POST', `${BASE}/api/favorites/25`, null, token);
  console.log('Status:', addFav.status, addFav.data?.message || addFav.data);

  console.log('\n--- 6.D POST /api/teams ---');
  const team = await request('POST', `${BASE}/api/teams`, { name: 'Mon équipe', pokemons: [1, 25, 150] }, token);
  console.log('Status:', team.status, team.data?.name || team.data);

  console.log('\n--- 6.D GET /api/teams ---');
  const teams = await request('GET', `${BASE}/api/teams`, null, token);
  console.log('Status:', teams.status, 'équipes:', teams.data?.length ?? teams.data);

  console.log('\nVérification terminée.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
