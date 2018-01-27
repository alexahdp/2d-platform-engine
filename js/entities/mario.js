import Entity from '../entity.js'
import Jump from '../traits/jump.js'
import Go from '../traits/go.js'
import {loadSpriteSheet} from '../loader.js'


export default async function loadMario() {
	const sprite = await loadSpriteSheet('mario');
	return createMarioFactory(sprite);
}


function createMarioFactory(sprite) {
	// частота ротации спрайтов анимации при ходьбе
	const frameFreq = 7;
	
	const runAnim = sprite.animations.get('run');
	
	function routeFrame(mario) {
		if (mario.go.distance > 0) {
			if (mario.jump.falling) {
				return 'jump';
			}
			else if (mario.vel.x > 0 && mario.go.dir < 0 || mario.vel.x < 0 && mario.go.dir > 0) {
				return 'break';
			}
			
			return runAnim(mario.go.distance);
		}
		
		return 'idle';
	}
	
	function draw(context) {
		sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0);
	};
	
	return function() {
		const mario = new Entity();
		mario.size.set(14, 16);
		
		mario.addTrait(new Go())
		mario.addTrait(new Jump())
		
		mario.draw = draw;
		
		return mario;
	}
}