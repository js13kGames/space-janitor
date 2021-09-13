(function () {
    let lastUpdate = 0;
    let stop = false;
    let arrowKeyUp = false;
    let arrowKeyRight = false;
    let arrowKeyLeft = false;
    let boostKey = false;
    const spawner = new Spawner();
    const G = 6.674 / 100; // gravitational constant
    /** @type {Body[]} */
    const holes = [];
    const p = Body.create({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        w: window.innerWidth / 20,
        h: window.innerHeight / 20,
        mass: 0.06,
        type: BodyType.player
    });
    /** @type {Body[]} */
    const bodies = [p];
    // blackhole timer
    let bt = 0;
    let pausedTime = 0;
    /** @type {Physics} */
    let e;
    /** @type {Renderer} */
    let r;
    const trashPickedUp = [];
    /**
     * Called when the DOM has loaded. This sets up the
     * physics engine, renderer, and initial game assets
     */
    function setup() {
        e = Physics.create();
        r = Renderer.create(document.querySelector('#canvas'), e);
        p.direction.update({ x: 0, y: -1 });
        holes.forEach(e.addBody.bind(e));
        e.addBody(p);
        main();
    }

    /**
     * Find the gravitational pull that body1 has on body2
     * @param {Body} body1
     * @param {Body} body2
     * @returns {Vector}
     */
    function createForceFromGravity(body1, body2) {
        const force = G * body1.mass * body2.mass / Math.pow(body2.pos.distance(body1.pos), 2);
        return Vector.from(body2.pos).subtract(body1.pos).unit().multiply(force);
    }

    function main() {
        if (!stop) window.requestAnimationFrame(() => main());
        // game logic - read controller, apply new forces, spawn, remove objects, etc
        if (arrowKeyUp) e.applyForce(p, Vector.from(p.direction).multiply(20 * (boostKey ? 2 : 1)));
        if (arrowKeyLeft) p.rotate(Math.PI / -20);
        if (arrowKeyRight) p.rotate(Math.PI / 20);
        // apply the force of blackholes
        holes.forEach((hole, index) => {
            hole.aliveTime = hole.aliveTime + Date.now() - lastUpdate;
            if (hole.aliveTime >= 5 * 1000) {
                e.deleteBody(hole);
                r.deleteBody(hole);
                holes.splice(index, 1);
            }
            // create a single time force per body
            else {
                bodies.forEach(body => {
                    e.applyForce(body, createForceFromGravity(body, hole));
                });
            }
        });

        if (bodies.length < 30) {
            const output = spawner.spawn();
            if (output != null && output.pos.distance(p.pos) > 3 * p.h) {
                e.addBody(output);

                e.applyForce(output, { x: fr(-101, 100), y: fr(-101, 100) });
                bodies.push(output);
            }

        }

        e.cols.forEach(function (coll) {
            const player = coll[BodyType.player];
            const asteroid = coll[BodyType.asteroid];
            const trash = coll[BodyType.trash];
            const hole = coll[BodyType.blackhole];
            let index = -1;
            //Blackhole collision
            if (hole) {
                const body = player || asteroid || trash;
                e.deleteBody(body);
                r.deleteBody(body);
                index = bodies.indexOf(body);
            }
            //Player, Asteroid collision
            else if (player && asteroid) {
                e.deleteBody(player);
                r.deleteBody(player);
                index = bodies.indexOf(player);
            }
            //Player, Trash collision 
            else if (player && trash) {
                e.deleteBody(trash);
                r.deleteBody(trash);
                index = bodies.indexOf(trash);
                if (!trashPickedUp.includes(trash.id)) {
                    trashPickedUp.push(trash.id);
                    document.querySelector("#hud").innerText = trashPickedUp.length;
                    document.querySelector("#hud").style.color = "white";
                    document.querySelector("#hud").style.fontSize = "50px";
                }

            }
            if (index > -1) bodies.splice(index, 1);
        })

        bt = bt + Date.now() - lastUpdate;



        if (bt >= 10 * 1000) {
            const blackHole = Body.create({
                type: BodyType.blackhole,
                mass: 10000000,
                x: fr(window.innerWidth),
                y: fr(window.innerHeight),
                w: 200,
                h: 200
            })
            if (blackHole.pos.distance(p.pos) > 5 * p.h) {
                e.addBody(blackHole);
                holes.push(blackHole);
                bt = 0;
                blackHole.aliveTime = 0;
            }


        }

        // end of game logic
        const now = Date.now();
        e.update(lastUpdate ? (pausedTime ? ((now - pausedTime) - (now - lastUpdate)) : (now - lastUpdate)) / 1000 : 0);
        r.render(e.bodies);
        lastUpdate = Date.now();
    }

    document.addEventListener("keydown", function ({ key }) {
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
    document.addEventListener("keyup", function ({ key }) {
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
    });
    setup();
})();