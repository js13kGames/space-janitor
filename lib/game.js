import BodyType from './BodyType.js';
import Physics, { Body, Vector } from './Physics.js';
import Renderer from './Renderer.js';
import Spawner from './Spawner.js';

let lastUpdate;
let stop = false;
let arrowKeyUp = false;
let arrowKeyRight = false;
let arrowKeyLeft = false;
let boostKey = false;
const spawner = new Spawner();
const G = 6.674 / 100; // gravitational constant
/** @type {Body[]} */
const blackholes = [
    // Body.create({
    //     type: BodyType.blackhole,
    //     mass: 10000000,
    //     x: Math.floor(Math.random() * (window.innerWidth)),
    //     y: Math.floor(Math.random() * (window.innerWidth)),
    //     w: 200,
    //     h: 200
    // })
];
const player = Body.create({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    w: window.innerWidth / 10,
    h: window.innerHeight / 10,
    mass: 0.06,
    type: BodyType.player
});
/** @type {Body[]} */
const bodies = [player];
const asteroids = [];
let playerMoveVector;
let timeSinceDelete = 0;
let pausedTime = 0;
/** @type {Physics} */
let engine;
/** @type {Renderer} */
let renderer;

/**
 * Called when the DOM has loaded. This sets up the
 * physics engine, renderer, and initial game assets
 */
function setup() {
    engine = Physics.create();
    renderer = Renderer.create(document.querySelector('#canvas'), engine);
    player.direction.update({ x: 0, y: -1 });
    blackholes.forEach(engine.addBody.bind(engine));
    engine.addBody(player);
    main();
}

/**
 * Find the gravitational pull that body1 has on body2
 * @param {Body} body1
 * @param {Body} body2
 * @returns {Vector}
 */
function createForceFromGravity(body1, body2) {
    const force = G * body1.mass * body2.mass / Math.pow(body2.position.distance(body1.position), 2);
    return Vector.from(body2.position).subtract(body1.position).unit().multiply(force);
}

function main() {
    try {
        if (!stop) window.requestAnimationFrame(() => main());
        // game logic - read controller, apply new forces, spawn, remove objects, etc
        if (arrowKeyUp) engine.applyForce(player, Vector.from(player.direction).multiply(20 * (boostKey ? 2 : 1)));
        if (arrowKeyLeft) player.rotate(Math.PI / 16);
        if (arrowKeyRight) player.rotate(Math.PI / -16);
        // apply the force of blackholes
        blackholes.forEach(hole => {
            // create a single time force per body
            bodies.forEach(body => {
                engine.applyForce(body, createForceFromGravity(body, hole));
            });
        });

        if (bodies.length < 30){
            const output = spawner.spawn();
            if (output != null){          
                engine.addBody(output);
            
                engine.applyForce(output, {x: Math.floor(Math.random()* (301) - 100), y: Math.floor(Math.random()* (301) - 100) });
                bodies.push(output);
            }
        }
      
       
        engine.collisions.forEach(function(collision){
            if (collision[BodyType.player] && collision[BodyType.trash]) {
                const trash = collision[BodyType.trash];
                engine.deleteBody(trash);
                renderer.deleteBody(trash);
                const index = bodies.indexOf(trash);
                if (index > -1) bodies.splice(index, 1);
            }
        })

        
       
        // end of game logic
        const now = Date.now();
        engine.update(lastUpdate ? (pausedTime ? ((now - pausedTime) - (now - lastUpdate)) : (now - lastUpdate)) /1000 : 0);
        renderer.render(engine.bodies);
        lastUpdate = Date.now();
    } catch (e) {
        console.error(e);
    }
}

document.addEventListener("keydown", function({ key }){
    switch (key) {
        case 'a':
            boostKey = true;
            break;
        case 'ArrowLeft':
            arrowKeyLeft = true;
            break;
        case 'ArrowRight':
            arrowKeyRight = true;
            break;
        case 'ArrowUp':
            arrowKeyUp = true;
            break;
    }
})
document.addEventListener("keyup", function({ key }){
    switch (key) {
        case 'ArrowLeft':
            arrowKeyLeft = false;
            break;
        case 'ArrowRight':
            arrowKeyRight = false;
            break;
        case 'ArrowUp':
            arrowKeyUp = false;
            break;
        case 'a':
            boostKey = false;
            break;
        case 'p':
            stop = !stop;
            if (stop === true) {
                pausedTime = Date.now();
            } else if (stop === false) {
                main();
                pausedTime = 0;
            }
            break;
    }
})

if (['complete', 'interactive'].includes(document.readyState))
    setup();
else
    window.addEventListener('DOMContentLoaded', setup);