import SpriteSheet from './spritesheet.js'
import {loadImage} from './loader.js'

export async function loadMarioSprite() {
	const image = await loadImage(`/img/characters.gif`);
	const sprites = new SpriteSheet(image, 16, 16);
	sprites.define('idle', 276, 44, 16, 16);
	return sprites;
}
