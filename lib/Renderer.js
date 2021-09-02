const { Composite } = Matter;
export default class Renderer {
    /** @type {HTMLDivElement} */
    canvas;
    /** @type {import('matter-js').Engine} */
    engine;
    /** @type {import('matter-js').Composite} */
    Composite = Composite;
    /** @type {{[id: string]}: HTMLDivElement} */
    elements = {};

    /**
     * @param {HTMLDivElement} canvas
     * @param {import('matter-js').Engine} engine
     * @returns {Renderer}
     */
    static create(canvas, engine) {
        const r = new Renderer();
        r.engine = engine;
        r.canvas = canvas;
        r.elements.player = canvas.querySelector('#player-spite');
        return r;
    }

    render() {
        for (const body of this.Composite.allBodies(this.engine)) {

        }
    }
}