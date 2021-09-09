import Physics, { Body, Vector } from './Physics.js';
import BodyType from './BodyType.js';
const engine = Physics.create();

export default class Spawner{
    spawn (){
        const random = Math.floor(Math.random()* (50 - 1) + 1);

        if(random <= 2){
            return Body.create({
                x: Math.floor(Math.random()* (900-1) + 1),
                y: Math.floor(Math.random()* (900-1) + 1),
                w: 100,
                h: 100,
                mass: 0.05,
                type: BodyType.asteroid
            });
        }
    }
}