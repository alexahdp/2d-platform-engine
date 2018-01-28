import {loadImage} from '../loader.js'
import SpriteSheet from '../spritesheet.js'

const CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

class Font {
	constructor(sprites, size) {
		this.sprites = sprites;
		this.size = size;
	}
	
	print(text, context, x, y) {
		text.split('').forEach((char, pos) => {
			this.sprites.draw(char, context, x + pos * this.size, y)
		});
	}
}


export async function loadFont() {
	const image = await loadImage('/img/font.png');
	const fontSprite = new SpriteSheet(image);
	
	const size = 8;
	
	// почему-то image.width хром всегда возвращает равным нулю
	//const rowLen = image.width;
	const rowLen = 128;
	
	for (let [index, char] of [...CHARS].entries()) {
		const x = index * size % rowLen;
		const y = Math.floor(index * size / rowLen) * size;
		
		fontSprite.define(char, x, y, size, size);
	}
	
	return new Font(fontSprite, size);
}