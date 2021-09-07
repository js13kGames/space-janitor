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
    const asteroid2 = Body.create({
        x: 200,
        y: 400,
        w: 75,
        h: 75,
        mass: 0.03,
        type: engine.bodyTypes.asteroid
    });
    const asteroid3 = Body.create({
        x: 500,
        y: 900,
        w: 50,
        h: 50,
        mass: 0.07,
        type: engine.bodyTypes.asteroid
    });
    engine.addBody(asteroid);
    engine.addBody(asteroid2);
    engine.addBody(asteroid3);
    engine.applyForce(asteroid, {x: 100, y: 400 }, true);
    engine.applyForce(asteroid2, {x: 700, y: 300 }, true);
    engine.applyForce(asteroid3, {x: -200, y: -500 }, true);
    main({ engine, collisions: [], renderer });
}

let lastUpdate;
let stop = false;
/**
 * @param {object} param0
 * @param {Physics} param0.engine
 * @param {Renderer} param0.renderer
 */
function main({ engine, renderer }) {
    try {
        if (!stop) window.requestAnimationFrame(() => main({ engine, renderer }));
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