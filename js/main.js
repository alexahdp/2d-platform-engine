'use strict';

import {loadLevel} from './loader.js'
import {loadBackgroundSprite, loadMarioSprite} from './sprites.js'
import Composer from './composer.js'
import {createBackgroundLayer, createSpriteLayer} from './layers.js'
import Entity from './entity.js'
import createMario from './entities.js'
import Timer from './timer.js'
import KeyboardState from './keyboardstate.js'

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

const wait = t => new Promise((res, rej) => setTimeout(res, t));

(async function main() {
	const [backgroundSprites, level, mario] = await Promise.all([
		loadBackgroundSprite(),
		loadLevel('1-1'),
		createMario(context)
	]);
	
	const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
	const marioLayer = createSpriteLayer(mario);
	
	const comp = new Composer();
	comp.layers.push(backgroundLayer);
	comp.layers.push(marioLayer);
	
	const gravity = 2000;
	mario.pos.set(64, 180);
	//mario.vel.set(200, -600);
	
	const SPACE = 32;
	const input = new KeyboardState();
	input.addMapping(SPACE, keyState => {
		if (keyState) {
			mario.jump.start();
		} else {
			mario.jump.cancel();
		}
	});
	input.listenTo(window);
	
	const timer = new Timer(1 / 60);
	
	timer.update = function(deltaTime) {
		mario.update(deltaTime);
		comp.draw(context);
		mario.vel.y += gravity * deltaTime;
	};
	
	timer.start();
})()
.catch(err => {
	console.log('FATAL ERROR');
	console.log(err);
});
