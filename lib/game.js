import BodyType from './BodyType.js';
import Physics, { Body, Vector } from './Physics.js';
import Renderer from './Renderer.js';
import Spawner from './Spawner.js';

let lastUpdate;
let stop = false;
let arrowKeyUp = false;
let arrowKeyRight = false;
let arrowKeyLeft = false;
const spawner = new Spawner();
const G = 6.674 / 100; // gravitational constant
/** @type {Body[]} */
const blackholes = [
    Body.create({
        type: BodyType.blackhole,
        mass: 10000000,
        x: Math.floor(Math.random() * (window.innerWidth)),
        y: Math.floor(Math.random() * (window.innerWidth)),
        w: 200,
        h: 200
    })
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

/**
 * Called when the DOM has loaded. This sets up the
 * physics engine, renderer, and initial game assets
 */
function setup() {
    const engine = Physics.create();
    const renderer = Renderer.create(document.querySelector('#canvas'), engine);
    player.direction.update({ x: 0, y: -1 });
    blackholes.forEach(engine.addBody.bind(engine));
    engine.addBody(player);
    main({ engine, collisions: [], renderer });
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

/**
 * @param {object} param0
 * @param {Physics} param0.engine
 * @param {Renderer} param0.renderer
 */
function main({ engine, renderer }) {
    try {
        if (!stop) window.requestAnimationFrame(() => main({ engine, renderer }));
        // game logic - read controller, apply new forces, spawn, remove objects, etc
        if (arrowKeyUp && !player.isMoving) {
            playerMoveVector = Vector.from(player.direction).multiply(20);
            engine.applyForce(player, playerMoveVector, true);
            player.isMoving = true;
        }
        else if (player.isMoving) {
            player.forces.splice(player.forces.indexOf(playerMoveVector), 1);
            player.isMoving = false;
        }
        if (arrowKeyLeft) player.rotate(Math.PI / 16);
        if (arrowKeyRight) player.rotate(Math.PI / -16);
        // apply the force of blackholes
        blackholes.forEach(hole => {
            // create a single time force per body
            bodies.forEach(body => {
                engine.applyForce(body, createForceFromGravity(body, hole));
            });
        });

        const output = spawner.spawn();
        if (output != null){
          
            engine.addBody(output);
        
            engine.applyForce(output, {x: Math.floor(Math.random()* (200-50) + 50), y: Math.floor(Math.random()* (200-50) + 50) });
            asteroids.push(output);
        
        }
       
        if (timeSinceDelete >= 30*1000){
            
            asteroids.forEach(function(body){
                engine.deleteBody(body);
                renderer.deleteBody(body);
            })
            timeSinceDelete = 0;
        }
        
        
        timeSinceDelete += (lastUpdate ? (Date.now() - lastUpdate) : 0);
        // end of game logic
        engine.update(lastUpdate ? (Date.now() - lastUpdate) /1000 : 0);
        renderer.render(engine.bodies);
        lastUpdate = Date.now();
    } catch (e) {
        console.error(e);
    }
}

document.addEventListener("keydown", function(event){
    if (event.keyCode === 37){
        arrowKeyLeft = true;
    }  
    else if (event.keyCode === 38){
        arrowKeyUp = true;
    }  
    else if (event.keyCode === 39){
        arrowKeyRight = true;
    }  
})
document.addEventListener("keyup", function(event){
    if (event.keyCode === 37){
        arrowKeyLeft = false;
    }  
    else if (event.keyCode === 38){
        arrowKeyUp = false;
    }  
    else if (event.keyCode === 39){
        arrowKeyRight = false;
    }  
})

if (['complete', 'interactive'].includes(document.readyState))
    setup();
else
    window.addEventListener('DOMContentLoaded', setup);