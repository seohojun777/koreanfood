// 글 본문의 글자 수(공백 포함)를 센다. frontmatter, 이미지, 링크 URL, 마크다운 기호는 제외한다.
// 사용법: node scripts/count-chars.mjs src/content/blog/<파일>.md

import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) {
	console.error('사용법: node scripts/count-chars.mjs <마크다운 파일>');
	process.exit(1);
}

const body = readFileSync(file, 'utf8')
	.replace(/^---[\s\S]*?\n---\n/, '') // frontmatter
	.replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 이미지
	.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 링크는 텍스트만
	.replace(/^#{1,6}\s+/gm, '') // 제목 기호
	.replace(/^\s*([-*+]|\d+\.)\s+/gm, '') // 목록 기호
	.replace(/^>\s?/gm, '') // 인용 기호
	.replace(/[*_`|]/g, '') // 강조·코드·표 기호
	.replace(/^\s*:?-{3,}:?(\s*:?-{3,}:?)*\s*$/gm, '') // 표 구분선, 가로줄
	.replace(/\n{2,}/g, '\n')
	.trim();

const withSpaces = [...body.replace(/\n/g, '')].length;
const withoutSpaces = [...body.replace(/\s/g, '')].length;

console.log(`공백 포함: ${withSpaces.toLocaleString()}자`);
console.log(`공백 제외: ${withoutSpaces.toLocaleString()}자`);
console.log(withSpaces >= 5000 ? '✔ 5,000자 기준 통과' : `✘ ${5000 - withSpaces}자 부족`);
process.exit(withSpaces >= 5000 ? 0 : 2);
