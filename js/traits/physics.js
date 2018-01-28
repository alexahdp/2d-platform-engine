import {Trait, SIDES} from '../entity.js'

export default class Physics extends Trait {
	constructor() {
		super('physics');
		this.enabled = true;
	}
	
	update(entity, deltaTime, level) {
		entity.pos.x += entity.vel.x * deltaTime;
		level.tileCollider.checkX(entity);
		
		entity.pos.y += entity.vel.y * deltaTime;
		level.tileCollider.checkY(entity);
		
		entity.vel.y += level.gravity * deltaTime;
	}
}