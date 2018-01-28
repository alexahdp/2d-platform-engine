import {createLevelLoader} from './loaders/level.js'
import Composer from './composer.js'
import {loadEntities} from './entities.js'
import loadMario from './entities/mario.js'
import loadGoomba from './entities/goomba.js'
import loadKoopa from './entities/koopa.js'
import Timer from './timer.js'
import setupKeyboard from './input.js'
import Camera from './camera.js'
import {createCollitionLayer} from './layers.js'
import PlayerController from './traits/player_controller.js'
import Entity from './entity.js'


const canvas = document.getElementById('screen');

function createPlayerEnv(playerEntity) {
	const playerEnv = new Entity();
	const playerControl = new PlayerController();
	playerControl.checkpoint.set(64, 64);
	playerControl.setPlayer(playerEntity);
	playerEnv.addTrait(playerControl);
	return playerEnv;
}

(async function main() {
	const context = canvas.getContext('2d');
	
	const entityFactory = await loadEntities();
	const loadLevel = await createLevelLoader(entityFactory);
	
	const level = await loadLevel('1-1');
	
	const camera = new Camera();
	
	const mario = entityFactory.mario();
	const playerEnv = createPlayerEnv(mario);
	level.entities.add(playerEnv);
	
	level.comp.layers.push(createCollitionLayer(level));
	
	const input = setupKeyboard(mario);
	input.listenTo(window);
	
	const timer = new Timer(1 / 60);
	timer.update = function(deltaTime) {
		level.update(deltaTime);
		
		//if (mario.pos.x > 100) {
			camera.pos.x = Math.max(0, mario.pos.x - 100);
		//}
		
		level.comp.draw(context, camera);
	};
	
	timer.start();
})()
.catch(err => {
	console.log('FATAL ERROR');
	console.log(err.message);
	console.log(err.stack);
});
