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
		});
		
		// проверка коллизий должна выполняться в отдельном цикле
		// иначе возможно ситуация, когда неправильно обсчитываются взаимодействия
		this.entities.forEach(entity => {
			this.entityCollider.check(entity);
		});
		
		// finalize нужен для избежания гонки за "ресурсы"
		// когда мы убили goomba, мы должны от него отпрыгнуть только один раз
		// поэтому свойство dead должно установиться у него не сразу после коллайдинга,
		// а позднее, когда mario получит импульс отталкивания
		this.entities.forEach(entity => {
			entity.finalize();
		});
		
		this.totalTime += deltaTime;
	}
}
