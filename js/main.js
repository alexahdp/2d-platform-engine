import {loadLevel} from './loader.js'
import Composer from './composer.js'
import Entity from './entity.js'
import createMario from './entities.js'
import Timer from './timer.js'
import {createCollitionLayer} from './layers.js'
import setupKeyboard from './input.js'


const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');


(async function main() {
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
		//mario.update(deltaTime);
		level.update(deltaTime);
		level.comp.draw(context);
	};
	
	timer.start();
})()
.catch(err => {
	console.log('FATAL ERROR');
	console.log(err);
});
