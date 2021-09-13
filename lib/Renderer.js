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
            [BodyType.asteroid]: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABmCAYAAAA53+RiAAAABmJLR0QA/wD/AP+gvaeTAAAD50lEQVR42u2d20ojWRSGq6x41qDGkIMBZe5FsF9h3mn6EZxnmnmEvvFOEYNohESNiedz2Rdzuz5hN0j30N93+ZtDxZ+9+Vlr7ao8+0msra29R3qz2Qxf//r6Gur9fj/UB4NBHulLS0t/RPp4PO5mvxATmfySaIzGiMZojHwWlc/+glarFaavxcXF+IIq8SVNT0+H+srKCqW4HUhlf0V6URR/R/pwOPzqihGN0RjRGI2RTydPfcP29vY7pJ3w9Q8PD6E+MzMT6o+Pj1lKiru/v0/SqbY2Ozsb6rVaLdTPzs6Sftfe3l7uinErE43RGNEYSU9ljUYjTF+bm5tJXzA5ORnqb29voX53dxfqVEObm5tLSoNHR0dJn0+8vLyE+vPzc1Lq63a7uSvGrUw0RmNEYySr1Gq1nZQ3UC2L5r6q1WpSCmo0GqE+GAxC/eLiIikdbWxshDrV1q6vr5NSWVEUSa+nOTdXjFuZaIzGiMb8bqmsLMt/oz+UZflnpI9Goy+RTrWgTqeTlF6ow0idxNvb2yR9YmIi6Trpc56enpJSYlmWdD2Hrhi3MtEYjRGNkSynWk21Wg3TAnUeFxYWQn11dTXU19fXQ51qSpSmqIZGHUyq6dH1U00vtVNJ+vHxsSvGrUw0RmNEYyTLKu12O0xfNF1P6YhqXL1eL9RpHmx+fj7U39/DMTc8m0mpKfV3LS8vJ6U7qqFRuqMOqSvGrUw0RmNEY363VEbphVIE1Xza7Xaoj8fjUL+6ukpKX5R26PpTodoazZvRKQZKiXSK4fDw0Gl/tzLRGI0RjZEsq1D6arVaSSmL0gilrMvLy6TUR3ecoA4mXQ+dJpiamkr6HKrp0f+HamKuGLcy0RiNEY2R/1IZ1ZpOT09DneavhsNhqFOnjzqG5+fnSamJ5tyo9kWd1jyPbxJSr9cpzoY6nWK4ublxxbiVicZojGiMfJDKKI1QLYhSEE3pU5qidEedTTrDSNdP82OUsqjGRVDti2qAo9HIFeNWJhqjMaIx8kEqo7mmTqcTth6phkadSjprSbUmqnHRHBelMuqEUnqks6JUA6TUSvR6Pe/t71YmGqMxojHyQSqjP3S78cO6qeNJZxVpyp06m3SX2tQ0lXqWk2qANIdGzwigDqwrxq1MNEZjRGPkx1LZyclJDukrvLtsURT/RDrNU1Gaok4ldQCphkZpMLXTenBwEOrUae33+7krxq1MNEY0RmMkmfyzv4BS3NbWVpjiaL6L5rXoqejNZjOOodA53d/fD3Xq8Lpi3MpEY0RjNEb+X6kslXq9/g3SXfikJ+p40p00aN5sd3c3d8WIxmiMaIzGyE/jO/FXcE1biIgiAAAAAElFTkSuQmCC',
            [BodyType.player]: 'data:image/png;base64,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',
            [BodyType.trash]: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAkCAYAAAB8DZEQAAAABmJLR0QA/wD/AP+gvaeTAAAHDElEQVRIx42X248lVRXGf2utXed0T3fDQIDxBl4gojgJQUcczAxEeFQTBaIPJsYH0fhsYjRqjBoeDIn8Fd7iaAwPJsbbgxgwYgwTYRgIEEAujpcZZ7r71Knaay0fdp1m0EGo5KTOqbNrr/196/u+XSW8xvHgAw8dMLPbhnH4NPBWM/3WgQOX/aTvh2v7fsjlcnny8OFD4/+bQy508fjx49J1XfnbS39/m5XZ1zc3Nz4mwmZXCh7121tbm4+fPbv95d3dPqrXe9bW1n70/kM3jK+7yIkTj5VhGG7ounJnRh7xyEOmOrNimIpvb+/8YN/GxvWnT5856DUoXXlWVb/Q98tfHD16U1yoiP73hXGsV2Tkvct++OIwDDdl1BlRUYIM33av1545feadkDJfm0nXlasi/Pau08sffOAPF2Sm/E9V1XOz2fx3Knp1pM8Xix1xr1ta0+bdbGPe6XW21s3VFDUbanVU+HAk0S/6rwD/es0iBw9ed+7pp5+5e9kvfymab963Nj86n5VPCFxsZkVNS0TQ9z2LxeKvwElRO5kpDw/DMLwuJADLxdnd8Pq8wmeslI8o5WIrbaiIUooyn6+RLK/q+75fnNt+wt2Pe/Xl62r84ycemYnKUSW/KXCjiHSiSikdmUkdRxIQERDB3Vns7o6nT59+MlLuKd3sp0duvvnMqxZ58omTFu63m3K3ql5DpiBKKQVVxd2p44iHo2qotv+WyyX/PnuWxaI/k8n3IvO787X50x84/MF8BV0vPf+sDuN4YyrfELhGRAURVBTVturMxEohKyyXPfP5nAhlPp+ztbWFqu7f3dm5C2H/OI5fAl54hYSXQ32DwFdN9d2qJqXrmM1mmLUVr84RQa2Vxe4uOQkgMpjPZmxubLC+vj7zWu+oY73r9/ffP98r8tijj3RexztF5FZRVSttQoDMQEQQEcyMCMe9Mo4j/XJJZjAMS0QEVW0Umq2Z6Wcj/MhvfvVr0daYfLsIn1eRdYGJIiUziXCYCsqkLp2a3vc9IkJ4kpm4Ozs729Ra8Tq+Kbx+zkz3l78cf9hU5VOmerUAmQky6SETEUUQMoPqTimFcRC6UhBVanWKWaOwX9D3PRlJZqhH3orooULGlSpyW0TMY1JNRIugBESVzMBrbQsgyamPGcE4tlwc6tiUVyuZjeZF31/qHu8pKvIOdz8oItSamCXVHUFQs0bDVCAyCXfcvU08jDBWhmGglMIwDHj4tBghI8Xd31LM7JKI2Kq1kqq4V8KdWitWOhBlWDYjz+YzTBVTJSMZhoEEzIw6IclIIgJRxUyplXmp7lcIKV4rZX2dTEdFEGmQM5JxHPcaO5vN8HCCZJwQtv9AJ4W5O0SgagBaPGJmtIEiICiqEGkgyjg66c5YKwuvrK2vU2tld3dBrXXPO5mBTRKOaLIHwbpuq/g4ipi2lUdQVBDArOATCnff41tEiHhZCKtPTH1a+aXWilnBVC9TMjZXhvMIIiHyZa9ENOlW91dMmudlXvNTEF6BxKwpMsJRM9M6jJdnNDWsVAMQ4fSLnnEYCG90EEFGQAacX3CFZoqcTKZ0CMicqdd6adQKGZM6GqqswbC7Qx2W+LhE6gjpCNnMeR6SiBVKWhEBpLGwHIaxJFzj1anLETGlXy6xUhgWfSuY2VRGIil77j+Pq73fjXb2lJhARHjJiP2YyR7cRd+M5M6KRtWC56qpQmZLVpniv5kPqrciRENrakgiZbHo/ymiKaqiopBJreN5NwspAmqkQIoiki2la91DUWslacpKEjUlE/CY62KxeG57e5uxtgySZhLcK+6VpHHd4n6K/wCdNtWcFhWZU9QbTGOlHReVzDwx9D19MUwULYaagY9kOC7ge3vK1AZJyEDIyYgv+6N9V5BAEMTKxZqZj0Rm9H3Psu+JTOoU6xFN6xmBT8HoEUQkNYI4rx9NEImKYKKQYMWI8CwgL5J5yiPfuLtc4tCyKYLOBHKiMBP3yQcR+NQLWcGbTjFJfPUIBaBWynOoPh4kPu0PsULhq8ho59U+n1FxdyJyb/83sz35Tk+iZGZk8qyWrntBSvmZqu6oKS3H2o2pK9O15pMtc7oy20tcM6PrOmZdh6lR1ChtMY7on63rviMA9x07dsCK3SPwydLZzMyaD87jOqRRU1TxDMa6CsTW6LZtA0gCnsnPEbl7a3PrTwVg3+bGqeWi/9owjueS+GhmrhfViySZycS3ZCJmrawopbCnqunoReRU9XjRPR7y8HvV9KnDR47m3oj7jh0TtbKpKu9S0wOScVO439J15XpV3YBERURLydXjEiKRmf/IzEdF7bcgx4ZheGYYa+37Yfz4nXfkq75pAfz4h9/vOitXbmzse18pdqsK7yXzEuvKULS8JCJPpfDHiDgRKc+kyPNHb/nQBV+C/gMas/vI1mBudQAAAABJRU5ErkJggg=='
        };
        return r;
    }

    deleteBody(body) {
        if (body) (this.canvas.querySelector(`[data-id="${body.id}"]`) || { remove() {} }).remove();
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
                    sprite.src = this.spriteUrls[type];
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