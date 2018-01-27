import Entity, {SIDES} from '../entity.js'
import {loadSpriteSheet} from '../loader.js'
import PendulumWalk from '../traits/pendulum_walk.js'


export default async function loadKoopa() {
	const sprite = await loadSpriteSheet('koopa');
	return createKoopaFactory(sprite);
}


function createKoopaFactory(sprite) {
	const walkAnim = sprite.animations.get('walk');
	
	function draw(context) {
		sprite.draw(walkAnim(this.lifetime), context, 0, 0, this.vel.x < 0);
	};
	
	return function createKoopa() {
		const koopa = new Entity();
		koopa.size.set(16, 24);
		//koopa.offset.y = 8;
		koopa.draw = draw;
		
		koopa.addTrait(new PendulumWalk());
		
		return koopa;
	}
}