import Physics, { Body, Vector } from './Physics.js';
import Renderer from './Renderer.js';
/**
 * Called when the DOM has loaded. This sets up the
 * physics engine, renderer, and initial game assets
 */
function setup() {
    const engine = Physics.create();
    const renderer = Renderer.create(document.querySelector('#canvas'), engine);
    const asteroid = Body.create({
        x: 50,
        y: 50,
        w: 100,
        h: 100,
        mass: 0.05,
        type: engine.bodyTypes.asteroid
    });
    engine.addBody(asteroid);
    engine.applyForce(asteroid, {x: 1000, y: 250 }, true);
    main({ engine, collisions: [], renderer });
}

let lastUpdate;
let stop = false;
/**
 * @param {object} param0
 * @param {Physics} param0.engine
 * @param {Renderer} param0.renderer
 */
function main({ collisions = [], engine, renderer }) {
    try {
        if (!stop) window.requestAnimationFrame(() => main({ collisions, engine, renderer }));
        // game logic - read controller, apply new forces, spawn, remove objects, etc

        // end of game logic
        engine.update(lastUpdate ? (Date.now() - lastUpdate) / 1000 : 0);
        renderer.render(engine.bodies);
        lastUpdate = Date.now();
    } catch (e) {
        console.error(e);
    }
}

if (['complete', 'interactive'].includes(document.readyState))
    setup();
else
    window.addEventListener('DOMContentLoaded', setup);