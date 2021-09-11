import BodyType from './BodyType.js';
export default class Renderer {
    /** @type {HTMLDivElement} */
    canvas;
    /** @type {import('./Physics').default} */
    engine;
    /** @type {{[id: string]}: HTMLDivElement} */
    elements = {};
    spriteUrls = {};

    /**
     * @param {HTMLDivElement} canvas
     * @param {import('./Physics').default} engine
     * @returns {Renderer}
     */
    static create(canvas, engine) {
        const r = new Renderer();
        r.engine = engine;
        r.canvas = canvas;
        r.spriteUrls = {
            [BodyType.asteroid]() {
                return `/assets/Stones2Filled_2${Math.floor(Math.random() * 9)}.png`
            },
            [BodyType.player]: '/assets/ship.png',
            [BodyType.blackhole]: '/assets/bg.png',
            [BodyType.trash]:'/assets/Trash2.png'
        };
        return r;
    }

    deleteBody(body) {
        (this.canvas.querySelector(`[data-id="${body.id}"]`) || { remove() {} }).remove();
    }

    /**
     * @param {import('./Physics').Body[]} bodies 
     */
    render(bodies = []) {
       bodies.forEach((body) => {
           const { id, type, position: { x, y }, w, h, rotation: r } = body;
           if (!this.elements[id]) {
                let sprite;
                if (type === BodyType.blackhole) {
                    sprite = document.createElement('div');
                    sprite.classList.add('blackhole');
                    sprite.dataset.id = id;
                    sprite.style.setProperty('--width', w + 'px');
                    this.canvas.appendChild(sprite);
                } else {
                    sprite = document.createElement('img');
                    sprite.dataset.id = id;
                    if (type === BodyType.asteroid) sprite.src = this.spriteUrls[type]();
                    else sprite.src = this.spriteUrls[type];
                }
                sprite.classList.add('sprite');
                body.el = sprite;
                this.elements[id] = sprite;
                this.canvas.appendChild(sprite);
           } 
            const el = this.elements[id];
            Object.assign(el.style, {
                left: x + 'px',
                top: y + 'px',
                transform: `rotate(${r * 180 / Math.PI}deg)`,
                width: w + 'px',
                height: h + 'px'
            });
       });
    }
}