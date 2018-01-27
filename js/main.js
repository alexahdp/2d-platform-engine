import {loadLevel} from './loaders/level.js'
import Composer from './composer.js'
import Entity from './entity.js'
import {loadEntities} from './entities.js'
import loadMario from './entities/mario.js'
import loadGoomba from './entities/goomba.js'
import loadKoopa from './entities/koopa.js'
import Timer from './timer.js'
import setupKeyboard from './input.js'
import Camera from './camera.js'
import {createCollitionLayer} from './layers.js'


const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');


(async function main() {
	const camera = new Camera();
	
	const [level, entity] = await Promise.all([
		loadLevel('1-1'),
		loadEntities()
	]);
	
	const mario = entity.mario();
	
	const goomba = entity.goomba();
	goomba.pos.x = 220;
	level.entities.add(goomba);
	
	const koopa = entity.koopa();
	koopa.pos.x = 260;
	level.entities.add(koopa);
	
	mario.pos.set(64, 100);
	
	level.entities.add(mario);
	
	level.comp.layers.push(createCollitionLayer(level));
	
	const input = setupKeyboard(mario);
	input.listenTo(window);
	
	const timer = new Timer(1 / 60);
	timer.update = function(deltaTime) {
		level.update(deltaTime);
		
		if (mario.pos.x > 100) {
			camera.pos.x = mario.pos.x - 100;
		}
		
		level.comp.draw(context, camera);
	};
	
	timer.start();
})()
.catch(err => {
	console.log('FATAL ERROR');
	console.log(err.message);
	console.log(err.stack);
});
