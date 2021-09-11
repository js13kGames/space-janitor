import { createReadStream, createWriteStream, mkdirSync, readdirSync, readFileSync, rmdirSync, writeFileSync } from 'fs';
import UglifyJS from 'uglify-js';
import HtmlMinifier from 'html-minifier';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import path from 'path';
import archiver from 'archiver';
const cwd = process.cwd();
const dist = path.join(cwd, 'dist');
console.log('Building project-asteroids...');
console.log('Removing previous build')
rmdirSync(dist, { recursive: true });
// minify scripts
console.log('Minifying lib/*.js');
mkdirSync(path.join(dist, 'lib'), { recursive: true });
readdirSync(path.join(cwd, 'lib'))
    .filter(fname => /\.js$/.test(fname))
    .forEach((fname) => {
        writeFileSync(path.join(dist, 'lib', fname), UglifyJS.minify(
            readFileSync(path.join(cwd, 'lib', fname), 'utf-8'),
            {
                mangle: true,
                compress: true
            }
        ).code);
    });
// minify html
console.log('Minifying index.html');
writeFileSync(path.join(dist, 'index.html'), HtmlMinifier.minify(
    readFileSync(path.join(cwd, 'index.html'), 'utf-8'),
    {
        removeComments: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true
    }
));
// copy assets
console.log('Copying assets/*');
mkdirSync(path.join(dist, 'assets'), { recursive: true });
readdirSync(path.join(cwd, 'assets')).forEach(fname => {
    createReadStream(path.join(cwd, 'assets', fname)).pipe(createWriteStream(path.join(dist, 'assets', fname)));
});
// minify css
console.log('Minifying styles/*.css');
mkdirSync(path.join(dist, 'styles'), { recursive: true });
const cssFileNames = readdirSync(path.join(cwd, 'styles'))
    .filter(fname => /\.css$/.test(fname));
Promise.all(
    cssFileNames.map(fname => postcss([autoprefixer, cssnano]).process(readFileSync(path.join(cwd, 'styles', fname), 'utf-8')))
).then((csses) => {
    csses.forEach((css, index) => {
        writeFileSync(path.join(dist, 'styles', cssFileNames[index]), css.css);
    });
    const zip = createWriteStream(path.join(cwd, 'project-asteroids.zip'));
    const archive = archiver('zip');
    zip.on('close', () => {
        console.log('Complete! Minified files are in dist/ and project-asteroids.zip generated');
    });
    archive.on('error', console.error);
    archive.pipe(zip);
    archive.directory(dist, false);
    archive.finalize();
}).catch(console.error);