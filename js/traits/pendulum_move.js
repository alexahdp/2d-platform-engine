import {Trait, SIDES} from '../entity.js'

export default class PendulumMove extends Trait {
	constructor() {
		super('pendulumMove');
		this.speed = -30;
		this.enabled = true;
	}
	
	update(entity, deltaTime) {
		if (this.enabled) {
			entity.vel.x = this.speed;
		}
	}
	
	obstruct(entity, side) {
		if (side == SIDES.LEFT || side == SIDES.RIGHT) {
			this.speed *= -1;
		}
	}
}
