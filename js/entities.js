import Entity from './entity.js'
import Jump from './traits/jump.js'
import Go from './traits/go.js'
import {loadSpriteSheet} from './loader.js'
import {createAnim} from './anim.js'


export default async function createMario() {
	const sprite = await loadSpriteSheet('mario');
	const mario = new Entity();
	mario.size.set(14, 16);
	
	mario.addTrait(new Go())
	mario.addTrait(new Jump())
	
	// частота ротации спрайтов анимации при ходьбе
	const frameFreq = 7;
	
	const runAnim = createAnim(['run-1', 'run-2', 'run-3'], frameFreq);
	
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
	
	mario.draw = function(context) {
		sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0);
	};
	
	return mario;
}
