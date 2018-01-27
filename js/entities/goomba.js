import Entity, {SIDES} from '../entity.js'
import {loadSpriteSheet} from '../loader.js'
import PendulumWalk from '../traits/pendulum_walk.js'


export default async function loadGoomba() {
	const sprite = await loadSpriteSheet('goomba');
	return createGoombaFactory(sprite);
}


function createGoombaFactory(sprite) {
	const walkAnim = sprite.animations.get('walk');
	
	function draw(context) {
		sprite.draw(walkAnim(this.lifetime), context, 0, 0);
	};
	
	return function createGoomba() {
		const goomba = new Entity();
		goomba.size.set(16, 16);
		goomba.draw = draw;
		
		goomba.addTrait(new PendulumWalk());
		
		return goomba;
	}
}