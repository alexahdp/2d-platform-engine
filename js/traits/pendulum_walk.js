import {Trait, SIDES} from '../entity.js'

export default class Jump extends Trait {
	constructor() {
		super('pendulumWalk');
		this.speed = -30;
	}
	
	update(entity, deltaTime) {
		entity.vel.x = this.speed;
	}
	
	obstruct(entity, side) {
		if (side == SIDES.LEFT || side == SIDES.RIGHT) {
			this.speed *= -1;
		}
	}
}

