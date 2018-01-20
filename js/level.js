import Composer from './composer.js'
import {Matrix} from './math.js'

export default class Level {
	constructor() {
		this.comp = new Composer();
		this.entities = new Set();
		this.tiles = new Matrix();
	}
	
	update(deltaTime) {
		this.entities.forEach(entity => {
			entity.update(deltaTime);
		});
	}
}