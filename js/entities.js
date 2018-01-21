import Entity from './entity.js'
import Velocity from './traits/velocity.js'
import Jump from './traits/jump.js'
import Go from './traits/go.js'
import {loadMarioSprite} from './sprites.js'

export default async function createMario() {
	const sprite = await loadMarioSprite();
	const mario = new Entity();
	mario.size.set(14, 16);
	
	mario.addTrait(new Go())
	mario.addTrait(new Jump())
	
	mario.draw = function(context) {
		sprite.draw('idle', context, 0, 0);
	};
	
	return mario;
}
