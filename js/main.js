import {loadLevel} from './loader.js'
import Composer from './composer.js'
import Entity from './entity.js'
import createMario from './entities.js'
import Timer from './timer.js'
import setupKeyboard from './input.js'
import Camera from './camera.js'


const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');


(async function main() {
	const camera = new Camera();
	
	const [level, mario] = await Promise.all([
		loadLevel('1-1'),
		createMario(context)
	]);
	
	mario.pos.set(64, 100);
	
	level.entities.add(mario);
	
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
	console.log(err);
});
