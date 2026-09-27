// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// TODO: 실제 도메인으로 바꿔야 canonical, sitemap, RSS 주소가 올바르게 생성됩니다.
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
});
