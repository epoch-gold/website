import puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function prerender() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const routes = [
        {
            path: '/',
            title: 'EpochGold - Auctions & Market Data',
            metaTags: [
                { name: 'description', content: 'Auctions & Market Data for Project Epoch.' },
                { name: 'keywords', content: 'project epoch, epoch auctions' },
                { name: 'robots', content: 'index, follow' },
            ],
        },
    ];

    const baseUrl = 'http://localhost:4173';
    const distDir = path.resolve(__dirname, 'dist');

    const previewProcess = exec('npm run preview', (err) => {
        if (err) console.error('Preview server failed:', err);
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
        for (const route of routes) {
            const url = `${baseUrl}${route.path}`;
            console.log(`Prerendering: ${url}`);

            await page.goto(url, { waitUntil: 'networkidle0' });

            let html = await page.content();

            html = html.replace(/<title>.*<\/title>/, `<title>${route.title}</title>`);

            html = html.replace(/<meta[^>]*name=["']description["'][^>]*>/gi, '');
            html = html.replace(/<meta[^>]*name=["']keywords["'][^>]*>/gi, '');
            html = html.replace(/<meta[^>]*name=["']robots["'][^>]*>/gi, '');

            if (route.metaTags) {
                const metaTagsHtml = route.metaTags
                    .map(tag => {
                        const attrs = Object.entries(tag).map(([key, value]) => `${key}="${value}"`).join(' ');
                        return `<meta ${attrs}>`;
                    })
                    .join('\n');
                html = html.replace('<head>', `<head>\n${metaTagsHtml}`);
            }

            const outputPath = path.join(distDir, route.path === '/' ? 'index.html' : `${route.path}/index.html`);
            const outputDir = path.dirname(outputPath);

            await fs.mkdir(outputDir, { recursive: true });
            await fs.writeFile(outputPath, html, 'utf8');
            console.log(`Saved: ${outputPath}`);
        }
    } catch (error) {
        console.error('Prerendering failed:', error);
    } finally {
        await browser.close();
        if (previewProcess.pid) {
            try {
                process.kill(previewProcess.pid, 'SIGTERM');
                console.log('Preview server completed.');
            } catch (killError) {
                console.error('Failed to terminate preview server:', killError);
            }
        }
        process.exit(0);
    }
}

prerender().catch(error => {
    console.error('Prerender script failed:', error);
    process.exit(1);
});