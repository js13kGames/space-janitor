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

const asteroid = [];
let timeSinceDelete = 0;

/**
 * @param {object} param0
 * @param {Physics} param0.engine
 * @param {Renderer} param0.renderer
 */
function main({ engine, renderer }) {
    try {
        if (!stop) window.requestAnimationFrame(() => main({ engine, renderer }));
        // game logic - read controller, apply new forces, spawn, remove objects, etc
        //Player 
        

        
        //Asteroid & Trash Spawner
        const output = spawner.spawn();
        
       
        if (output != null){
          
            engine.addBody(output);
        
            engine.applyForce(output, {x: Math.floor(Math.random()* (301) - 100), y: Math.floor(Math.random()* (301) - 100) }, true);
            asteroid.push(output);
        
        }
       
        console.log(timeSinceDelete/1000);
       
        if (timeSinceDelete >= 30*1000){
            
            asteroid.forEach(function(body){
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