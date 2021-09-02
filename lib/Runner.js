const { Engine } = Matter;
export default class Runner {
    constructor(engine) {
        this.engine = engine;
        this.lastUpdate = 0;
    }

    run() {
        window.requestAnimationFrame(this.run.bind(this));
        Engine.update(this.engine, this.lastUpdate ? Date.now() - this.lastUpdate : 1000 / 60);
        this.lastUpdate = Date.now();
    }
}