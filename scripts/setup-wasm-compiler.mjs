// Windows 스마트 앱 컨트롤이 Astro 컴파일러 네이티브 파일(.node)을 차단하는 PC를 위한 설치 스크립트.
// npm install 후(postinstall) 자동 실행되며, Windows에서만 WASM 버전 컴파일러를 node_modules에 풀어 넣는다.
// package.json 의존성에 넣으면 Linux 배포 서버(Cloudflare 등)에서 EBADPLATFORM으로 설치가 실패하므로 이 방식을 쓴다.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PKG = '@astrojs/compiler-binding-wasm32-wasi@0.5.1';
const target = join('node_modules', '@astrojs', 'compiler-binding-wasm32-wasi');

if (process.platform !== 'win32' || existsSync(target)) process.exit(0);

const tmp = mkdtempSync(join(tmpdir(), 'astro-wasm-'));
try {
	execFileSync('npm', ['pack', PKG, '--pack-destination', tmp, '--silent'], {
		stdio: 'ignore',
		shell: true,
	});
	const tgz = readdirSync(tmp).find((f) => f.endsWith('.tgz'));
	mkdirSync(target, { recursive: true });
	execFileSync('tar', ['-xzf', join(tmp, tgz), '-C', target, '--strip-components=1']);
	console.log(`[setup-wasm-compiler] ${PKG} 설치 완료`);
} catch (err) {
	console.warn(`[setup-wasm-compiler] 설치 실패 (빌드가 차단되면 수동 확인 필요): ${err.message}`);
} finally {
	rmSync(tmp, { recursive: true, force: true });
}
