import SpriteSheet from './spritesheet.js'
import {createAnim} from './anim.js'

export function loadImage(url) {
	return new Promise((res, rej) => {
		const image = new Image(url);
		image.src = url;
		image.addEventListener('load', () => res(image));
	});
}

export async function loadJson(url) {
	return fetch(url).then(r => r.json());
}


export async function loadSpriteSheet(name) {
	const sheetSpec = await loadJson(`/sprites/${name}.json`);
	const image = await loadImage(sheetSpec.imageURL);
	
	const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);
	if (sheetSpec.tiles) {
		sheetSpec.tiles.forEach(tile => {
			sprites.defineTile(tile.name, ...tile.index);
		});
	}
	
	if (sheetSpec.frames) {
		sheetSpec.frames.forEach(frameSpec => {
			sprites.define(frameSpec.name, ...frameSpec.rect);
		});
	}
	
	if (sheetSpec.animations) {
		sheetSpec.animations.forEach(animSpec => {
			const animation = createAnim(animSpec.frames, animSpec.frameLen)
			sprites.defineAnim(animSpec.name, animation);
		});
	}
	
	return sprites;
}
