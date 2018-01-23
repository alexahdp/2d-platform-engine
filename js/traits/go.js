import {Trait} from '../entity.js'

export default class Go extends Trait {
	constructor() {
		super('go');
		
		this.dir = 0;
		this.acceleration = 400;
		this.deceleration = 300;
		this.distance = 0;
		this.heading = 1;
		this.dragFactor = 1 / 2000;
	}
	
	update(entity, deltaTime) {
		const absX = Math.abs(entity.vel.x);
		
		if (this.dir !== 0) {
			entity.vel.x += this.acceleration * deltaTime * this.dir;
			
			if (!entity.jump.falling) {
				this.heading = this.dir;
			}
		}
		else if (entity.vel.x !== 0) {
			const decel = Math.min(absX, this.deceleration * deltaTime);
			entity.vel.x += entity.vel.x > 0 ? -decel : decel;
		}
		else {
			this.distance = 0;
		}
		
		this.distance += absX * deltaTime;
		const drag = this.dragFactor * entity.vel.x * absX;
		entity.vel.x -= drag;
	}
}