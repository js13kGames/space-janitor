window.Renderer = class Renderer {
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
                return [
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABsCAYAAACYRMcEAAAABmJLR0QA/wD/AP+gvaeTAAADnUlEQVR42u2dy04qQRRFu7VFRQRfiYkjgyEO/f/PYISGSNqBjnxFEXxzB0zPGhyjud7L2sNjpRt6W5WVXaeasvhl6na7s6i+srISjj87OyuL/1BLhdIYpTEaozRmofTjRHN8fBxS1vr6eji+0WiE9c/Pz7D+/Pwc1sfjcVhfXV0N629vb2F9NBqVzhilMRqjNEZj1O+jssPDw5CyOp1OOH55ebnIUBlRFo2nDO3+/j6sPzw8pGiNrv/4+Jiix7quS2eMS5nSGI1RGqPyVHZ0dJSir7W1tRTVEK1VVZUaTxkX0d3d3V38H7oU/49SdjedTsP6+/t7WP/4+Ajr5+fnpTPGpUxpjMYojVFFSfRVljGwbW9vh3XKmrK0RhS0t7cX1q+urlL0tbm5GdZvb29TNDWbhY8NMzSiPqI4Z4xLmdIYjVEas2CqiC6oThSxtbUV1injIiojuqMMrdlshnXK9CaTSVjf3d1N3Zd2SOn5UKZHz8EZ41KmNEZjlMYsGpVRJkY08vT0FNapn+rg4CCsb2xspKiMrt/r9cJ6XddhfWdnJ/W9Xl9fwzplbvQ5s3TnjHEpUxqjMUpjFo3KaIeRMi7K0Ei0k0j3pcyNsi86a0l9X3Tf7NlMfKBAX7SD+fLy4oxxKVMaozFKY1RRVEQL7XY7RWvUf0VUQ3RHVEPjqQ+N6I6yLKKj7HOgM5503+FwaLe/S5nSGI1RGqOKoqIdOqIpypqov4uyspubm7C+v7+foq+Li4sUxbVarbBO/WCUxdF42hGm8c4YlzKlMRqjNEbNqSybZVF3Ou0Ykui+l5eXYZ360+jsJGVZ2UyMvhd9fqIyytCcMS5lSmM0RmmMmlMZ9Wtl6YsyMaIjytaur6/DOp2dzJ5WoC59uj5lXER3lD3STrEzxqVMaYzGKI1Rc3ihs4fU/U7jKVujd/LT9YlqqC+LKJHGZ98Wm6VBolB6q60zxqVMaYzGKI1Rc7igP5ycnMwy1EQZFFEQ0R2J6I4yNxpPpxKojm95he9FO6r9ft9fXHIpUxqjMUpj1BeojNTtdlO/xESZ1XdlZfT+MdqBpe59yrjovrRjOxgMSmeMS5nSGKUxGqN+nspI9KvllCnRu/SJyihbo0wsewaT3uZKn2c0GpXOGJcypTFKYzRGfZuq77pQXdcpSmk0GqkdUqIvojWiL+rSPz09LZ0xSmM0RmmMxqi/pvJf+aCUxWVp0BmjNEZjlMZojPqV+gM4e27kvL41cAAAAABJRU5ErkJggg==',
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABmCAYAAAA53+RiAAAABmJLR0QA/wD/AP+gvaeTAAAD50lEQVR42u2d20ojWRSGq6x41qDGkIMBZe5FsF9h3mn6EZxnmnmEvvFOEYNohESNiedz2Rdzuz5hN0j30N93+ZtDxZ+9+Vlr7ao8+0msra29R3qz2Qxf//r6Gur9fj/UB4NBHulLS0t/RPp4PO5mvxATmfySaIzGiMZojHwWlc/+glarFaavxcXF+IIq8SVNT0+H+srKCqW4HUhlf0V6URR/R/pwOPzqihGN0RjRGI2RTydPfcP29vY7pJ3w9Q8PD6E+MzMT6o+Pj1lKiru/v0/SqbY2Ozsb6rVaLdTPzs6Sftfe3l7uinErE43RGNEYSU9ljUYjTF+bm5tJXzA5ORnqb29voX53dxfqVEObm5tLSoNHR0dJn0+8vLyE+vPzc1Lq63a7uSvGrUw0RmNEYySr1Gq1nZQ3UC2L5r6q1WpSCmo0GqE+GAxC/eLiIikdbWxshDrV1q6vr5NSWVEUSa+nOTdXjFuZaIzGiMb8bqmsLMt/oz+UZflnpI9Goy+RTrWgTqeTlF6ow0idxNvb2yR9YmIi6Trpc56enpJSYlmWdD2Hrhi3MtEYjRGNkSynWk21Wg3TAnUeFxYWQn11dTXU19fXQ51qSpSmqIZGHUyq6dH1U00vtVNJ+vHxsSvGrUw0RmNEYyTLKu12O0xfNF1P6YhqXL1eL9RpHmx+fj7U39/DMTc8m0mpKfV3LS8vJ6U7qqFRuqMOqSvGrUw0RmNEY363VEbphVIE1Xza7Xaoj8fjUL+6ukpKX5R26PpTodoazZvRKQZKiXSK4fDw0Gl/tzLRGI0RjZEsq1D6arVaSSmL0gilrMvLy6TUR3ecoA4mXQ+dJpiamkr6HKrp0f+HamKuGLcy0RiNEY2R/1IZ1ZpOT09DneavhsNhqFOnjzqG5+fnSamJ5tyo9kWd1jyPbxJSr9cpzoY6nWK4ublxxbiVicZojGiMfJDKKI1QLYhSEE3pU5qidEedTTrDSNdP82OUsqjGRVDti2qAo9HIFeNWJhqjMaIx8kEqo7mmTqcTth6phkadSjprSbUmqnHRHBelMuqEUnqks6JUA6TUSvR6Pe/t71YmGqMxojHyQSqjP3S78cO6qeNJZxVpyp06m3SX2tQ0lXqWk2qANIdGzwigDqwrxq1MNEZjRGPkx1LZyclJDukrvLtsURT/RDrNU1Gaok4ldQCphkZpMLXTenBwEOrUae33+7krxq1MNEY0RmMkmfyzv4BS3NbWVpjiaL6L5rXoqejNZjOOodA53d/fD3Xq8Lpi3MpEY0RjNEb+X6kslXq9/g3SXfikJ+p40p00aN5sd3c3d8WIxmiMaIzGyE/jO/FXcE1biIgiAAAAAElFTkSuQmCC'
                ][fr(1.9)];
            },
            [BodyType.player]: 'data:image/png;base64,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',
            [BodyType.trash]: 'data:image/png;base64,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'
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
           const { id, type, pos: { x, y }, w, h, rotation: r } = body;
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