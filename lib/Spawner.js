import Physics, { Body, Vector } from './Physics.js';
import BodyType from './BodyType.js';
const engine = Physics.create();

export default class Spawner{
    spawn (){
        const random = Math.floor(Math.random()* (200 - 1) + 1);

        if(random == 10){
            return Body.create({
                x: Math.floor(Math.random()* (1800-1) + 1),
                y: Math.floor(Math.random()* (1000-1) + 1),
                w: 100,
                h: 100,
                mass: 0.05,
                type: BodyType.asteroid
            });
        }
        else if (random == 100){
            return Body.create({ 
                x: Math.floor(Math.random()* (1800-1) + 1),
                y: Math.floor(Math.random()* (1000-1) + 1),
                w: 150,
                h: 150,
                mass: 0.03,
                type: BodyType.asteroid
            });
        }
        else if (random == 200){
            return Body.create({ 
                x: Math.floor(Math.random()* (1800-1) + 1),
                y: Math.floor(Math.random()* (1000-1) + 1),
                w: 180,
                h: 180,
                mass: 0.08,
                type: BodyType.asteroid
            });
        }
        else if (random == 5 || random == 50 || random == 150){
            return Body.create({ 
                x: Math.floor(Math.random()* (1800-1) + 1),
                y: Math.floor(Math.random()* (1000-1) + 1),
                w: 50,
                h: 50,
                mass: 0.08,
                type: BodyType.trash
            });
        }

    }
}