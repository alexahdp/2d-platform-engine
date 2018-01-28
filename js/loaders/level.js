import Level from '../level.js'
import {createSpriteLayer} from '../layers/sprites.js'
import {createBackgroundLayer} from '../layers/background.js'
import {loadJson, loadSpriteSheet} from '../loader.js'
import {Matrix} from '../math.js'

function setupCollision(levelSpec, level) {
	const mergedTiles = levelSpec.layers.reduce((mergedLayers, levelSpec) =>
		mergedLayers.concat(levelSpec.tiles),
		[]
	);
	
	const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
	level.setCollisionGrid(collisionGrid);
}

function setupBackgrounds(levelSpec, level, backgroundSprites) {
	levelSpec.layers.forEach(layer => {
		const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns);
		const backgroundLayer = createBackgroundLayer(level, backgroundGrid, backgroundSprites);
		level.comp.layers.push(backgroundLayer);
	});
}

function setupEntities(levelSpec, level, entityFactory) {
	const marioLayer = createSpriteLayer(level.entities);
	level.comp.layers.push(marioLayer);
	
	levelSpec.entities.forEach(({name, pos: [x, y]}) => {
		const createEntity = entityFactory[name];
		const entity = createEntity()
		entity.pos.set(x, y);
		level.entities.add(entity);
	});
}


export async function createLevelLoader(entityFactory) {
	return async function loadLevel(name) {
		const levelSpec = await loadJson(`/levels/${name}.json`);
		const backgroundSprites = await loadSpriteSheet(levelSpec.spriteSheet);
		
		const level = new Level();
		
		setupCollision(levelSpec, level);
		setupBackgrounds(levelSpec, level, backgroundSprites);
		setupEntities(levelSpec, level, entityFactory);
		
		return level;
	}
}

function* expandSpan(xStart, xLenght, yStart, yLength) {
	const xEnd = xStart + xLenght;
	const yEnd = yStart + yLength;
	
	for (let x = xStart; x < xEnd; x++) {
		for (let y = yStart; y < yEnd; y++) {
			yield ({x, y});
		}
	}
}


function expandRange(range) {
	if (range.length == 4) {
		const [xStart, xLength, yStart, yLength] = range;
		return expandSpan(xStart, xLength, yStart, yLength);
	}
	else if (range.length == 3) {
		const [xStart, xLength, yStart] = range;
		return expandSpan(xStart, xLength, yStart, 1);
	}
	else if (range.length == 2) {
		const [xStart, yStart] = range;
		return expandSpan(xStart, 1, yStart, 1);
	}
}

function* expandRanges(tiles) {
	for (let range of tiles) {
		yield* expandRange(range);
	}
}

function* expandTiles(tiles, patterns) {
	function* walkTiles(tiles, offsetX, offsetY) {
		for (const tile of tiles) {
			for (let {x, y} of expandRanges(tile.ranges)) {
				const derivedX = x + offsetX;
				const derivedY = y + offsetY;
				
				if (tile.pattern) {
					const tiles = patterns[tile.pattern].tiles;
					yield* walkTiles(tiles, derivedX, derivedY);
				} else {
					yield {
						tile,
						x: derivedX,
						y: derivedY,
					};
				}
			}
		}
	}
	
	yield* walkTiles(tiles, 0, 0);
}

function createCollisionGrid(tiles, patterns) {
	const grid = new Matrix();
	for (const {tile, x, y} of expandTiles(tiles, patterns)) {
		grid.set(x, y, {type: tile.type});
	}
	
	return grid;
}

function createBackgroundGrid(tiles, patterns) {
	const grid = new Matrix();
	for (const {tile, x, y} of expandTiles(tiles, patterns)) {
		grid.set(x, y, {name: tile.name});
	}
	
	return grid;
}