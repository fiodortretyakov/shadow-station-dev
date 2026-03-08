import { TILE_CONFIG } from '../config/constants.js';
import { Prop } from '../entities/Prop.js';

export class GameMap {
    constructor(k, layout) {
        this.k = k;
        this.layout = layout;
        this.map = null;
    }

    create() {
        const { k, layout } = this;
        const S = TILE_CONFIG.width; // 64

        // Helper: add floor under a prop tile
        const floorUnder = (pos) => {
            k.add([k.sprite('floor-plain'), k.pos(pos), k.z(0)]);
        };

        // Helper: create a prop centered in the tile
        const makeProp = (type, pos, opts = {}) => {
            floorUnder(pos);
            const center = k.vec2(pos.x + S / 2, pos.y + S / 2);
            const p = new Prop(k, type, center, opts);
            p.create();
        };

        this.map = k.addLevel(layout, {
            tileWidth:  S,
            tileHeight: S,
            tiles: {
                // ── Walls ──────────────────────────────────────────────────
                'w': () => [k.sprite('wall-plain'),  k.area(), k.body({ isStatic: true }), k.z(1)],
                't': () => [k.sprite('wall-tech'),   k.area(), k.body({ isStatic: true }), k.z(1)],
                'v': () => [k.sprite('wall-vent'),   k.area(), k.body({ isStatic: true }), k.z(1)],
                'c': () => [k.sprite('wall-corner'), k.area(), k.body({ isStatic: true }), k.z(1)],
                'T': () => [k.sprite('wall-top'),    k.area(), k.body({ isStatic: true }), k.z(1)],
                'W': () => [k.sprite('window'),      k.area(), k.body({ isStatic: true }), k.z(1)],
                'd': () => [k.sprite('door-closed'), k.area(), k.body({ isStatic: true }), k.z(1)],

                // ── Floor ──────────────────────────────────────────────────
                '.': () => [k.sprite('floor-plain'), k.z(0)],
                'p': () => [k.sprite('floor-panel'), k.z(0)],

                // ── Void (outside station hull) ────────────────────────────
                ' ': () => [k.sprite('space-void'), k.z(0)],

                // ── Props (each adds a floor tile underneath) ───────────────
                'D': (pos) => { makeProp('desk',      pos, { searchable: true  }); return []; },
                'X': (pos) => { makeProp('computer',  pos, { searchable: true  }); return []; },
                'B': (pos) => { makeProp('bed',       pos, { searchable: true  }); return []; },
                'S': (pos) => { makeProp('bookshelf', pos, { searchable: true  }); return []; },
                'C': (pos) => { makeProp('chair',     pos, { pickable:   true  }); return []; },
                'M': (pos) => { makeProp('mug',       pos, { pickable:   true  }); return []; },
                'G': (pos) => { makeProp('lamp',      pos, { searchable: false }); return []; },
                'L': (pos) => { makeProp('locker',    pos, { searchable: true  }); return []; },
            },
        });

        return this.map;
    }
}
