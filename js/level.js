import Composer from './composer.js'
import TileCollider from './tilecollider.js'
import EntityCollider from './entity_collider.js'

export default class Level {
	constructor() {
		this.gravity = 1500;
		this.totalTime = 0;
		
		this.comp = new Composer();
		this.entities = new Set();
		//this.tiles = new Matrix();
		// this.tileCollider = new TileCollider(this.tiles);
		this.entityCollider = new EntityCollider(this.entities);
		this.tileCollider = null;
	}
	
	setCollisionGrid(matrix) {
		this.tileCollider = new TileCollider(matrix);
	}
	
	update(deltaTime) {
		this.entities.forEach(entity => {
			entity.update(deltaTime, this);
			
			entity.pos.x += entity.vel.x * deltaTime;
			if (entity.canCollide) {
				this.tileCollider.checkX(entity);
			}
			
			entity.pos.y += entity.vel.y * deltaTime;
			if (entity.canCollide) {
				this.tileCollider.checkY(entity);
			}
			
			entity.vel.y += this.gravity * deltaTime;
		});
		
		// проверка коллизий должна выполняться в отдельном цикле
		// иначе возможно ситуация, когда неправильно обсчитываются взаимодействия
		this.entities.forEach(entity => {
			if (entity.canCollide) {
				this.entityCollider.check(entity);
			}
		});
		
		this.totalTime += deltaTime;
	}
}
