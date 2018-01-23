import Vec2 from './math.js'
export const SIDES = {
	TOP: Symbol('top'),
	BOTTOM: Symbol('bottom'),
}

const FAST_DRAG = 1 / 5000;
const SLOW_DRAG = 1 / 2000;

export class Trait {
	constructor(name) {
		this.NAME = name;
	}
	
	obstruct() {}
	
	update() {
		console.log('unhandle')
	}
}

export default class Entity {
	constructor() {
		this.pos = new Vec2(0, 0);
		this.vel = new Vec2(0, 0);
		this.size = new Vec2(0, 0);
		
		this.traits = [];
		this.dragFactor = SLOW_DRAG;
	}
	
	
	addTrait(trait) {
		this.traits.push(trait);
		this[trait.NAME] = trait;
	}
	
	
	update(deltaTime) {
		this.traits.forEach(trait => {
			trait.update(this, deltaTime);
		});
	}
	
	obstruct(side) {
		this.traits.forEach(trait => {
			trait.obstruct(this, side);
		});
	}
	
	turbo(keyState) {
		this.go.dragFactor = keyState ? FAST_DRAG : SLOW_DRAG;
	}
}