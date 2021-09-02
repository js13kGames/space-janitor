import Runner from './Runner.js';
import Renderer from './Renderer.js';
/**
 * Called when the DOM has loaded. This
 * is the main game loop
 */
function main() {
    const {
        Engine
    } = Matter;
    const engine = Engine.create();
    const runner = Runner.create(engine);
    const renderer = Renderer.create(document.querySelector('#canvas'), engine);
}

if (['complete', 'interactive'].includes(document.readyState))
    main();
else
    window.addEventListener('DOMContentLoaded', main);