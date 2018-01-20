import Composer from './composer.js'
import TileCollider from './tilecollider.js'
import {Matrix} from './math.js'

export default class Level {
	constructor() {
		this.comp = new Composer();
		this.entities = new Set();
		this.tiles = new Matrix();
		this.tileCollider = new TileCollider(this.tiles);
		this.gravity = 2000;
	}
	
	update(deltaTime) {
		this.entities.forEach(entity => {
			entity.update(deltaTime);
			
			entity.pos.x += entity.vel.x * deltaTime;
			this.tileCollider.checkX(entity);
			
			entity.pos.y += entity.vel.y * deltaTime;
			this.tileCollider.checkY(entity);
			
			entity.vel.y += this.gravity * deltaTime;
		});
	}
}
