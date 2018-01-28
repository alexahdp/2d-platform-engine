import Entity, {SIDES, Trait} from '../entity.js'
import {loadSpriteSheet} from '../loader.js'
import PendulumMove from '../traits/pendulum_move.js'
import Killable from '../traits/killable.js'
import Physics from '../traits/physics.js'
import Solid from '../traits/solid.js'


export default async function loadGoomba() {
	const sprite = await loadSpriteSheet('goomba');
	return createGoombaFactory(sprite);
}

class Behavior extends Trait {
	constructor() {
		super('behavior');
	}
	
	collides(us, them) {
		if (us.killable.dead) {
			return;
		}
		
		if (them.stomper) {
			if (them.vel.y > us.vel.y) {
				us.killable.kill();
				us.pendulumMove.speed = 0;
			} else {
				them.killable.kill();
			}
		}
	}
}

function createGoombaFactory(sprite) {
	const walkAnim = sprite.animations.get('walk');
	
	function routeAnim(goomba) {
		if (goomba.killable.dead) {
			return 'flat';
		}
		
		return walkAnim(goomba.lifetime);
	}
	
	function draw(context) {
		sprite.draw(routeAnim(this), context, 0, 0);
	};
	
	return function createGoomba() {
		const goomba = new Entity();
		goomba.size.set(16, 16);
		goomba.draw = draw;
		
		goomba.addTrait(new Physics());
		goomba.addTrait(new PendulumMove());
		goomba.addTrait(new Behavior());
		goomba.addTrait(new Killable());
		goomba.addTrait(new Solid());
		
		goomba.killable.removeAfter = 0;
		
		return goomba;
	}
}