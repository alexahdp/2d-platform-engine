import Entity from './entity.js'
import Velocity from './traits/velocity.js'
import Jump from './traits/jump.js'
import Go from './traits/go.js'
import {loadMarioSprite} from './sprites.js'

export default async function createMario(context) {
	const sprite = await loadMarioSprite();
	const mario = new Entity();
	mario.size.set(14, 16);
	
	mario.addTrait(new Go())
	mario.addTrait(new Jump())
	//mario.addTrait(new Velocity())
	// mario.update = function(deltaTime) {
	// 	//mario.pos.add(mario.vel);
	// 	mario.pos.x += mario.vel.x * deltaTime;
	// 	mario.pos.y += mario.vel.y * deltaTime
	// };
	
	mario.draw = function() {
		sprite.draw('idle', context, this.pos.x, this.pos.y);
	};
	
	return mario;
}
