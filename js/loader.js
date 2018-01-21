import SpriteSheet from './spritesheet.js'
import Level from './level.js'
import {createBackgroundLayer, createSpriteLayer} from './layers.js'

export function loadImage(url) {
	return new Promise((res, rej) => {
		const image = new Image(url);
		image.src = url;
		image.addEventListener('load', () => res(image));
	});
}

async function loadJson(url) {
	return fetch(url).then(r => r.json());
}

function createTiles(level, backgrounds) {
	function applyRange(background, xStart, xLenght, yStart, yLength) {
		const xEnd = xStart + xLenght;
		const yEnd = yStart + yLength;
		
		for (let x = xStart; x < xEnd; x++) {
			for (let y = yStart; y < yEnd; y++) {
				level.tiles.set(x, y, {
					name: background.tile,
					type: background.type,
				});
			}
		}
	}
	
	backgrounds.forEach(background => {
		background.ranges.forEach(range => {
			if (range.length == 4) {
				applyRange(background, ...range);
			}
			else if (range.length == 3) {
				const [xStart, xLength, yStart] = range;
				applyRange(background, xStart, xLength, yStart, 1);
			}
			else if (range.length == 2) {
				const [xStart, yStart] = range;
				applyRange(background, xStart, 1, yStart, 1);
			}
		});
	})
}


async function loadSpriteSheet(name) {
	const sheetSpec = await loadJson(`/sprites/${name}.json`);
	const image = await loadImage(sheetSpec.imageURL);
	
	const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);
	sheetSpec.tiles.forEach(tile => {
		sprites.defineTile(tile.name, ...tile.index);
	});
	
	return sprites;
}

export async function loadLevel(name) {
	const levelSpec = await loadJson(`/levels/${name}.json`);
	const backgroundSprites = await loadSpriteSheet(levelSpec.spriteSheet);
	
	const level = new Level();
	createTiles(level, levelSpec.backgrounds);
	
	const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
	level.comp.layers.push(backgroundLayer);
	
	const marioLayer = createSpriteLayer(level.entities);
	level.comp.layers.push(marioLayer);
	
	return level;
}
