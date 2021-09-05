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
            [engine.bodyTypes.asteroid]: '/assets/asteroid.png'
        };
        return r;
    }

    /**
     * @param {import('./Physics').Body[]} bodies 
     */
    render(bodies = []) {
       bodies.forEach(({ id, type, extents: [{ x, y }], w, h, rotation: r }) => {
           if (!this.elements[id]) {
               this.canvas.innerHTML += `<img class="sprite" id="${id}" src="${this.spriteUrls[type]}" style="width: ${w}px;height:${h}px;left:${x}px;top:${y}px;transform:rotate(${r * 180 / Math.PI}deg);" />`;
               this.elements[id] = this.canvas.lastElementChild;
           } else {
               const el = this.elements[id];
               Object.assign(el.style, {
                    left: x + 'px',
                    top: y + 'px',
                    transform: `rotate(${r * 180 / Math.PI}deg)`
               });
           }
       });
    }
}