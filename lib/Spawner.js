window.Spawner = class Spawner {
    spawn() {
        const random = Math.floor(Math.random() * (200 - 1) + 1);
        //Asteroid spawn
        if (random == 10) {
            return Body.create({
                x: Math.floor(Math.random() * (1800 - 1) + 1),
                y: Math.floor(Math.random() * (1000 - 1) + 1),
                w: 60,
                h: 60,
                mass: 0.05,
                type: BodyType.asteroid
            });
        }
        else if (random > 50 && random <= 70) {
            return Body.create({
                x: Math.floor(Math.random() * (1800 - 1) + 1),
                y: Math.floor(Math.random() * (1000 - 1) + 1),
                w: 90,
                h: 90,
                mass: 0.03,
                type: BodyType.asteroid
            });
        }
        else if (random > 150 && random <= 160) {
            return Body.create({
                x: Math.floor(Math.random() * (1800 - 1) + 1),
                y: Math.floor(Math.random() * (1000 - 1) + 1),
                w: 120,
                h: 120,
                mass: 0.08,
                type: BodyType.asteroid
            });
        }//Trash spawn
        else if (random > 10 && random <= 140) {
            return Body.create({
                x: Math.floor(Math.random() * (1800 - 1) + 1),
                y: Math.floor(Math.random() * (1000 - 1) + 1),
                w: 36,
                h: 36,
                mass: 0.08,
                type: BodyType.trash
            });
        }
    }
}