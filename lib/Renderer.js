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
                return [
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAAB4CAIAAABHDfoIAAADh0lEQVR42u2dwU5iQRBFQREVUVFJSFgRDXHJ/3+GKzUEIwtcKRJQVFCZfZ3JdOdlmNF47rLSNO/dVKpvblf3K5WEEEIIIf4+yl/tgU5PT0Nka2srRK6vr78XyxsmmizLspBlWVZjrBPn5+chsru7GyLVajVEPj8/Q+T19TVEnp6eQmR7eztElstliNzc3JjLVgwhy7Isy+KLa4xOpxMih4eHIbK5uZnUGNQPHENnYzKZhMh0Ok2qDs4zm82SCuf29tZctmLIspBlWRZr0hhnZ2dJRbGzs5Nc06k6KpVKcgwdCSqTx8fHmFAbMaXomby8vITI+/t7iHx8fITIYDAwl60YsixkWZZFAY1BRVEuxx8eHR0lfYMc1cF1v9lshsjd3V1SUezv74fIeDxOqoXVahUidDaoVahDgtdhLlsxZFnIsiz/PFRyBnHlZYTrbKPRSDoS1BhUJnQ2arVaiNBFmc/nIXJycpKcmXsufC+6KHwLc9mKIctClmVZjZEziK4FV+fn5+cQYSdDu90Okb29vaTG4DzdbvfPvkGpVDo+Pk4+4WKxCBG6H/z3HGViLlsxZFnIsiyrMXIGcY+DjgSdDYI7GpyZ7gc9Cp4iYR8FZ845afIbgqAouFfy9vZmLlsxZFnIsiyLAhqDq+rBwUFSdbDbgWs6lQnXdI5hzwaVCf0HKoGct+D5FM7c7/fNZSuGLAtZlmVRQGNwT4Fqgb4BuyboYzw8PIRIq9VKKorhcJjUIfV6PUTYWUE/hGO4T8Qx5rIVQ5aFLMuyKKYxcvwH9j1y/yJn5tFoFCLs4uAJEfoPOa4Fn5DPQ41BZ8NctmLIspBlWRbFNAY7InIUBV0LKgF6Hff39yHCEyI5Pajs3uQ8dCSoTOjhcOfIXLZiyLKQZVkWxTQGT2Swf5Jj6HXwxk7OwzWd/Q/UMxyTc+NWjnqhLuJ9X+ayFUOWhSzLsgAK3vPZ6/WS2oBOAtd9KhOCyoTuB8ew45QR+hh8Qu7LXFxcmMtWDFkWsizLYk0ag+D3UrnDQrehmI/Buy+4d8N+TjoSnJn7O5eXl+ayFUPIsizLsviPGoPgV9LoEvDuTWoMeh10LXLOlfCmLP7Xmr7Eai5bMWRZyLIs/zxU1jd1zvdJ2SPBdZ+KgqqDioLdm1dXV+ayFUPIsiwLWf5XKH/9R6QfUuDr6uayFUPIsiwLWRZCCCGE+P74BSikZ4PChs6fAAAAAElFTkSuQmCC',
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHYAAAB4CAIAAACoz5E2AAADyklEQVR42u2d2y5rURSGHVu0qEgkjkFE3HkBN15a4sqNB/AA0tL0QtCqUylVLtzI+KJzbZudxv7+yz9rrsOfkTH/NeaYaw0MCCGEEEL8LQb77YampqYCUywWA3N7e5tk+gdDRpkSK7FQYiX+/Rj5lxebnJwMzNLSUmAKhUJgHh8fAzMxMRGN0WC0Rvl8PjCvr6+Buby8NIpNFEKJlViJxXfg22oUrCSsrq5G+zISDczMzExgzs/Pk/4hl8slvcHFxUVyFF3H1dVVYLrdbmDu7u6MYhOFEgslVmIRJvmvDVtYWAjMxsZGYEqlUmAeHh4CMz09HZjh4eEYBUMxDq6vr5NuYWxsLJon1DF4LfqidrudvFaj0TCKTRRKLJRYiXUUSXC1grPq+Ph40i1kWZsgFhcXA8OuiU6nE5jZ2dnA3N/fJ0fRvbBGwaegD/lYxzCKTRRKLJRYiXUUn7mFVqsVGHYpcBTrBpzlOYpVAvoQ+gd2X9AJ0Bfxfl5eXgLz/PycvB8dhYlCiYUSK7GOgmC1gXNxuVwOTLPZDMza2lpguDJC3NzcBGZ+fj4wx8fHgRkdHY2Pii4OugX2bPAYPjtrJvV63Sg2USixUGIl1lEEbG9vB4YdCOxtYJXg5OQkMCsrK0knwMoGuzdZM8nSh8lqA1c9WNmgM3l6ejKKTRRKLJRYiXUUSXBW3dnZSb6n01EcHBwkR3H3R5ZOBvoHrsKwL5QVCfoZOiX6h95fwzCKTRRKLJRYiXUU79jf3w/M+vp6YNjJwP0g/HrV2dlZ0hsQ3FtBt8DKBj0GKxtZdojQKfXeT2oUmyiUWCixEuso3sFuSa4XcEfG6elpcgbnfM1RdCacwXnmLE9BsGuCaxz8ZoVRbKJQYqHESqyjyHLQ7u5uYDY3N5Nz+uHhYdIJcJWBKwj0GPQhXL/gjk66Ba5fsNeCO0zZQ2IUmyiUWCixEusoshy0t7cXmK2trcBUq9Xkuzx7JNgJ+XGXxGeug+sOPA+9AY+hw+HKCEfRYxjFJgolFkqsxDqKLAdx/yb3ih4dHQVmbm4u+XZfqVSSboGdmXQLrFHwPFyp4ZnZxcE6BneaGMUmCiUWSqzE/z2+7b8ey8vLgWFnBWdwfr2KVQLutmCHJx0F6w9f65Hg1f2vh4lCiYUSK7H4OUdBsJOBFQB+j4Kuo1arBYY9llyb4NX5xS1+IZPVGKPYRCGUWImVWGTAD/7NPMu7fJYvStEbsG7AGgXBns8/rTYYxSYKJRZKrMTiEwz2/y32/g+XUSyUWImVWCixEEIIIcSvwBuBxF3tUgkZcgAAAABJRU5ErkJggg==',
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHYAAAB4CAIAAACoz5E2AAADo0lEQVR42u2dyU4jQRBEsVnMYvYdjDhx5ML//wRHhECAQWLfDTaLmXu+mcliNDALL44h290dSmVFZ2aVe3qEEEIIIYQQQggh/jwqn3mx5eXlwCwsLATm5eUlMMfHx4F5fHwMTLVaDcz19fVfInHVKFNiJRZKrMT/P/o+7qcXFxcDMzo6Gi/fF2+gVqsFZmpqKjCnp6eBmZiYCExvb29gLi4ujGIThVBiJVZi8TH4xRrFxsZGuqazkjA4OBiYdruduo6Hh4eUYR1jaGgoMNPT06kz4R3u7++nz2UUmyiUWCixEusoSj40Pz8fmPX19fRb/f39gXl9fQ1Mq9UKDKsWw8PD6Zq+t7eX/g7x/PwcmKenp9SZ7O7uGsUmCiUWSqzEInUUfJfn6ry2thYYzj+MjY2lv8OawMnJSbrKk5mcnEzrGLe3t6kzoeepVKJEd3d3gfn5zIZRbKJQYqHESvwF8J0X+W63mzJXV1fpu3yj0QgMZxvYraCfub+/TxlOZvLq/Fan0wnM+fl5+uzvnQI1ik0USiyUWIm/pqN4e3tL3QLXUNYotra2ArO6uprWKLhes7bAusHNzU1abWCFhG6Bu1H47AcHB4HhrIVRbKJQYqHESqyjWFpaCgynJbnus9pweHgYGE5EjIyMpH6Guz/Y9Si5Q3ZG6IJYtaAPocMxik0USiyUWIl1FKS4XnNV5Zs7fQjrGKwk0D9wTef9lIAzEpys4Owo3QtnR3d2doxiE4USCyVWYpE6CvoHnixBt8C1mG7h8vIydSYls5q8FnejDAwMpN9ihYTP9d6KhFFsolBiocRKrKP4UU3g6OgoMPV6PTA8P4o9BXYizs7OUifAiQjWH9hz4azF7Oxs6p04O8qdHUaxiUKJhRIrsShxFFyL+S7PVZ5nO9Ab0IewD8JpSd4PpyboFkpO4Wb9gVUU7moxik0USiyUWIlFiaPgSZLcicmqBXsc3NnBmgCrDZxtoKNgr4R+ZmZmJjCsotApEToKE4VQYiVWYlGAojMzV1ZWAlNyxtT4+Hhg2AfhGRHsO9AblOwQKfnHEJ60yS4M94oaxSYKJRZKrMSipEZBNJvN1D+UTCDQG5ScncWqBfdflPRctre3A8OeC+cxjGIThVBiJVZi8bscBcF1nwxdx9zcXFpboMdg3YD/gc4JDZ6v9d5dn0axiUIosRIrsShG5TMvxvkHOgH6EP4/KXeY8pc3NzeNYhOFUGIlFkoshBBCCPHv4Bs3onELNKRm2wAAAABJRU5ErkJggg==',
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAAB4CAIAAABHDfoIAAADw0lEQVR42u2dyUprQRRFNcY2Yq/YYoQQELtf8MudO3NihxgV+9g3MfY6P2tQlyAPn6w13ASjm0PV9tSpe5uaRERERERERET+D5r/5Zd1dHQEZWhoKCjDw8NBub29Dcr9/X1QcrlcUC4uLn6PyzkLTZd1WXRZl80YP0epVApKW1tbUJ6fn4MyPT0dlM/Pz6AcHBwkP/Px8RGU4+Nja9kVQ3RZl0WXf3nGYLehXC4HpbW1Nbnvv76+BoW9jt7e3qC8vb0FpVKpJFPHyMhIUE5PT4Py8vISlFqtFhT2VaxlVwxdFl3WZQH5LB8aHBwMSn9/f1AODw+DMj8/H5R6vZ5MAu3t7UFh94MwvXR3dwfl+vo6BqzmdMQaGBgISktLS1Curq6sZVcMXRZd1mVJZoyenp5kEvj6+goKzzi477MnwHkMTlawt3B5eRmUycnJZDbY398PSrVaTSYTdlrYn7GWXTF0WXRZlyVLxsjy332WnsDs7GxQZmZmgsLJTKaXQqEQFPZVeHZD2A8ZHR1toEfR19cXlLOzM2vZFUOXRZd1WZIZg/MPPL9gZ+P8/DzZAVhaWgoKux8PDw/JjME9PZ/PJz/Dfgi7FlQWFhaC8vT0FJStrS1r2RVDl0WXdVmSGYOJgpMVu7u7yZ2Xs5EnJydB4YkGb5q8v78HhTOfhKcw7GPwXIbK1NRUUNbW1qxlVwxdFl3WZWkgY/COxtzcXHIHZwfg6OgomUOYFtjZYEeCcx2c0ODUBG+sMFEwzzAXraysWMuuGLosuqzL0kDG4F7M/ZrnKZzwnJiYCArPU1ZXV5MZI0ui6OzsDAqnQPlX8C4MJzSYgngGZC27Yuiy6LIuS5aMwb348fExKJx73N7eDkpXV1dQOMXB/fru7i4onC/lT+bvzGeB8lxmbGwsKJwGYXayll0xdFl0WZelsYzBiQje9eDTq9jZ4M8pFotB4X3SLLs8Oy1kY2MjKOPj40Hh3VU+94OTotayK4Yuiy7rsvxUxuBpBecWbm5ukomCOYQdCXZIOMXB2Q+mBd4H4UkNz2XYV2EXxVp2xdBl0WVdlsYyBuGbPpg6+OwL9gSYQ3jGwdsf/C7eVOV3ra+vB4XP0ODZDRMFz4CsZVcMXRZd1mXJwI+9E21xcTGZBDiZyX4I5yiYDXgfhCmIHQk+JYy/z+bmprXsiiG6rMu6LL8qY2RheXk5KJz04IQGex3sWvA5XXt7e0Hh21qtZVcM0WVd1mX5GxmDZHnbGm+a8I0q7Gzs7OxYy64Yosu6LLosIiIi8rf4BmohaFlY9MjmAAAAAElFTkSuQmCC'
                ][Math.floor(Math.random() * 4)];
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