import Physics, { Body, Vector } from './Physics.js';
import Renderer from './Renderer.js';
import Spawner from './Spawner.js';
/**
 * Called when the DOM has loaded. This sets up the
 * physics engine, renderer, and initial game assets
 */
function setup() {
    const engine = Physics.create();
    const renderer = Renderer.create(document.querySelector('#canvas'), engine);
   
    main({ engine, collisions: [], renderer });
}

let lastUpdate;
let stop = false;
let arrowKeyUp = false;
let arrowKeyRight = false;
let arrowKeyLeft = false;
const spawner = new Spawner();



/**
 * @param {object} param0
 * @param {Physics} param0.engine
 * @param {Renderer} param0.renderer
 */
function main({ engine, renderer }) {
    try {
        if (!stop) window.requestAnimationFrame(() => main({ engine, renderer }));
        // game logic - read controller, apply new forces, spawn, remove objects, etc
        const output = spawner.spawn();
        
       
        if (output != null){
          
            engine.addBody(output);
        
            engine.applyForce(output, {x: 100, y: 50 }, true);
        }
        
        
        
        // end of game logic
        engine.update(lastUpdate ? (Date.now() - lastUpdate) / 1000 : 0);
        renderer.render(engine.bodies);
        lastUpdate = Date.now();
    } catch (e) {
        console.error(e);
    }
}

document.addEventListener("onkeydown", function(event){
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
document.addEventListener("onkeyup", function(event){
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