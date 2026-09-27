// Unsplash에서 무료(비프리미엄) 사진을 검색해 블로그에 바로 쓸 수 있는 형태로 출력한다.
// 사용법: node scripts/find-photo.mjs "kimchi stew" [개수]

const query = process.argv[2];
const count = Number(process.argv[3] ?? 8);

if (!query) {
	console.error('사용법: node scripts/find-photo.mjs "<영문 검색어>" [개수]');
	process.exit(1);
}

const res = await fetch(
	`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=30`,
);
if (!res.ok) {
	console.error(`검색 실패: HTTP ${res.status}`);
	process.exit(1);
}

const { results } = await res.json();
const free = results.filter((p) => !p.premium && !p.plus).slice(0, count);

if (free.length === 0) {
	console.log('무료 사진이 없습니다. 검색어를 바꿔보세요.');
}

for (const p of free) {
	const base = p.urls.raw.split('?')[0];
	console.log(`- ${p.alt_description ?? '(설명 없음)'}`);
	console.log(`  이미지: ${base}?w=1600&q=80&auto=format&fit=crop`);
	console.log(`  작가: ${p.user.name} (https://unsplash.com/@${p.user.username})`);
	console.log(`  원본: https://unsplash.com/photos/${p.id}`);
}
