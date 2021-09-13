window.fr = (max = 1, min = 0) => {
    return Math.floor(Math.random() * (max - min) + min);
}

window.Vector = class Vector {
    x = 0;
    y = 0;
    id = null;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {Vector}
     */
    static create(x = 0, y = 0) {
        return Object.assign(new Vector(), { x, y });
    }
    /**
     * 
     * @param {Vector} param0 
     * @returns {Vector}
     */
    static from({ x, y }) {
        return Vector.create(x, y);
    }
    id(id) {
        this.id = id;
    }
    /**
     * 
     * @param {Vector} param0 
     * @returns {Vector}
     */
    add({ x, y }) {
        this.x += x;
        this.y += y;
        return this;
    }
    /**
     * 
     * @param {Vector} param0 
     * @returns {Vector}
     */
    subtract({ x, y }) {
        this.x -= x;
        this.y -= y;
        return this;
    }
    dot({ x, y }) {
        return this.x * y - this.y * x;
    }
    /**
     * 
     * @param {Vector} param0 
     * @returns {Vector}
     */
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    /**
     * 
     * @param {Vector|number} scalar 
     * @returns {Vector}
     */
    divide(scalar) {
        this.x /= typeof scalar.x === 'number' ? scalar.x : scalar;
        this.y /= typeof scalar.y === 'number' ? scalar.y : scalar;
        return this;
    }
    /**
     * 
     * @param {Vector} param0 
     * @returns {Vector}
     */
    update(x, y) {
        if (typeof x === 'object') Object.assign(this, x);
        else {
            this.x = x;
            this.y = y;
        }
        return this;
    }
    /**
     * @returns {Vector}
     */
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }
    /**
     * @returns {Vector}
     */
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }
    /**
     * @param {Vector} vector
     * @returns {number}
     */
    distance({ x, y }) {
        return Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
    }
    /**
     * @returns {Vector} A new vector representing the unit vector 
     */
    unit() {
        return Vector.from(this).divide(this.magnitude());
    }
    /**
     * @returns {number}
     */
    magnitude() {
        return this.distance({ x: 0, y: 0 });
    }
}

window.Body = class Body {
    type;
    id;
    h = 1;
    w = 1;
    /** @type {Vector} */
    grid = Vector.create();
    /** @type {Vector} */
    pos = Vector.create();
    /** @type {number} kg */
    mass = 0.001;
    /** @type {Vector} px/s */
    velocity = Vector.create();
    /** @type {Vector} px/s^2 */
    acc = Vector.create();
    /** @type {Vector[]} kg * px / s^2 */
    forces = [];
    /** @type {number} radians */
    rotation = 0;
    /** @type {Vector[]} */
    extents = [];
    /** @type {Vector[]} */
    direction = Vector.create(0, 1);
    static create(init = {}) {
        const o = Object.assign(new Body(), {
            id: Math.random().toString(16).slice(2)
        }, init);
        o.pos.update(init.x, init.y);
        o.l = o.pos.distance(Vector.create(init.x + init.w / 2, init.y + init.h / 2));
        o.calculateExtents();
        return o;
    }
    
    rotate(radians) {
        this.rotation += radians;
        if (this.rotation > 2 * Math.PI) this.rotation -= 2 * Math.PI;
        if (this.rotation < 0) this.rotation += 2 * Math.PI;
        this.calculateExtents();
        this.direction = Vector.create(Math.sin(this.rotation), Math.cos(this.rotation) * -1);
    }

    calculateExtents() {
        const { pos, w, h, rotation } = this;
        const { x, y } = pos;
        this.ext = [
            Vector.create(this.l * Math.cos(rotation + Math.PI / 4), this.l * Math.sin(rotation + Math.PI / 4)).add({ x, y }),
            Vector.create(this.l * Math.cos(rotation + 3 * Math.PI / 4), this.l * Math.sin(rotation + 3 * Math.PI / 4)).add({ x, y }),
            Vector.create(this.l * Math.cos(rotation + 5 * Math.PI / 4), this.l * Math.sin(rotation + 5 * Math.PI / 4)).add({ x, y }),
            Vector.create(this.l * Math.cos(rotation + 7 * Math.PI / 4), this.l * Math.sin(rotation + 7 * Math.PI / 4)).add({ x, y })
        ];
    }
}

window.Physics = class Physics {
    
    /** @type {Body[]} */
    bodies = [];
    /**
     * @type {number}
     * creates a n x n grid of areas in which bodies
     *  reside to make collision calculations more efficient
     */
    grids = 12;
    /** @type {Vector} */
    worldSize = Vector.create(window.innerWidth, window.innerHeight);
    /** @type {Vector} */
    gridSize = Vector.from(this.worldSize).divide(12);
    areas = (() => {
        const grid = [];
        while (grid.length < this.grids) grid.push(new Array(this.grids).fill([], 0));
        return grid;
    })();
    /** @type {{a: Body, b: Body}[]} */
    cols = [];

    static create() {
        return new Physics();
    }

    /**
     * @param {Body} body
     */
    addBody(body) {
        if (!this.bodies.includes(body)) this.bodies.push(body);
        
        this.upCollArea(body);
    }
    deleteBody(body) {
        const index = this.bodies.indexOf(body);
        if (index > -1) this.bodies.splice(index, 1);
    }
    upCollArea(body) {
        const { grid, pos } = body;
        const area = this.areas[grid.x][grid.y];
        if (area) area.splice(area.indexOf(body), 1);
        const nextGrid = Vector.from(pos).divide(this.gridSize).floor();
        // check for wrapping
        if (nextGrid.x < 0) nextGrid.add({ x: this.grids, y: 0 });
        else if (nextGrid.x >= this.grids) nextGrid.x = nextGrid.x - this.grids;
        if (nextGrid.y < 0) nextGrid.add({ y: this.grids, x: 0 });
        else if (nextGrid.y >= this.grids) nextGrid.y = nextGrid.y - this.grids;
        
        grid.update(nextGrid);
        this.areas[grid.x][grid.y].push(body);
    }
    /**
     * Main function that moves the world forward in time
     * @param {number} time The time in ms to move the world forward
     */
    update(time) {
        const { x: worldEndX, y: worldEndY } = this.worldSize;
        this.bodies.forEach(b => {
            // update acceleration
            const resultantForce = b.forces.reduce(/** @param {Vector} acc */(acc, force) => acc.add(force), Vector.create());
            // remove all non-constant forces
            b.forces = b.forces.filter(f => f.constant);
            // add to the current acceleration
            b.acc.add(resultantForce.divide(b.mass));
            // update velocity
            b.velocity.add(Vector.from(b.acc).multiply(time));
            // update the position
            const dp = Vector.from(b.velocity).multiply(time);
            b.prevPosition = b.pos;
            b.pos.add(dp);
            b.ext[0].add(dp);
            b.ext[1].add(dp);
            b.ext[2].add(dp);
            b.ext[3].add(dp);
            if (b.pos.x > worldEndX) {
                b.pos.x -= worldEndX;
                b.ext[0].x -= worldEndX;
                b.ext[1].x -= worldEndX;
                b.ext[2].x -= worldEndX;
                b.ext[3].x -= worldEndX;
            }
            else if (b.pos.x < -1 * b.h) {
                b.pos.x += worldEndX;
                b.ext[0].x += worldEndX;
                b.ext[1].x += worldEndX;
                b.ext[2].x += worldEndX;
                b.ext[3].x += worldEndX;
            };
            if (b.pos.y > worldEndY) {
                b.pos.y -= worldEndY;
                b.ext[0].y -= worldEndY;
                b.ext[1].y -= worldEndY;
                b.ext[2].y -= worldEndY;
                b.ext[3].y -= worldEndY;
            }
            else if (b.pos.y < -1 * b.w) {
                b.pos.y += worldEndY;
                b.ext[0].y += worldEndY;
                b.ext[1].y += worldEndY;
                b.ext[2].y += worldEndY;
                b.ext[3].y += worldEndY;
            }
            // set acceleration to 0 so that it doesn't continuously increase
            b.acc.update({ x: 0, y: 0 });
            // update grid positions
            this.upCollArea(b);
        });
        // check for collisions
        this.cols.length = 0;
        this.bodies.forEach(b => {
            // check this grid and the surrounding grids
            const { grid: { x, y } } = b;
            const up = y <= 0 ? this.grids - 1 : y - 1;
            const down = y >= this.grids - 1 ? 0 : y + 1;
            const left = x <= 0 ? this.grids - 1 : x - 1;
            const right = x >= this.grids - 1 ? 0 : x + 1;
            /** @type {Body[]} */
            const posCols = [];
            [
                ...this.areas[x][y],
                ...this.areas[x][up],
                ...this.areas[x][down],
                ...this.areas[right][y],
                ...this.areas[right][up],
                ...this.areas[right][down],
                ...this.areas[left][y],
                ...this.areas[left][up],
                ...this.areas[left][down]
            ].forEach(collider => {
                if (!posCols.includes(collider)) posCols.push(collider)
            });
            posCols.filter(c => c !== b).forEach((collider) => {
                const { extents } = collider;
                for (const extent of extents) {
                    if (extent.distance(b.pos) < b.l * 0.8 || extent.distance(b.prevPosition) < b.l * 0.8) {
                        this.cols.push({
                            [b.type]: b,
                            [collider.type]: collider
                        });
                        break;
                    }
                }
            });
        });
    }

    /**
     * 
     * @param {Body} body 
     * @param {Vector} force 
     * @param {boolean} constant 
     */
    applyForce(body, force, constant = false) {
        body.forces.push({
            ...(force instanceof Vector ? force : Vector.from(force)),
            constant
        });
    }
}