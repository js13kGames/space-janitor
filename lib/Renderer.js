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
            [BodyType.asteroid]: '/assets/asteroid.png',
            [BodyType.player]: '/assets/ship.png',
            [BodyType.blackhole]: '/assets/black-hole.png',
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
       bodies.forEach(({ id, type, extents: [{ x, y }], w, h, rotation: r }) => {
           if (!this.elements[id]) {
               const img = document.createElement('img');
               this.elements[id] = img;
               img.classList.add('sprite');
               if (type === BodyType.asteroid) img.classList.add('asteroid', 'spinning');
               img.dataset.id = id;
               img.src = this.spriteUrls[type];
               this.canvas.appendChild(img);
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