import TileResolver from './tileresolver.js'
import {SIDES} from './entity.js'

export default class TileCollider {
	constructor(tileMatrix) {
		this.tiles = new TileResolver(tileMatrix);
	}
	
	checkX(entity) {
		let x;
		if (entity.vel.x > 0) {
			x = entity.bounds.right;
		}
		else if (entity.vel.x < 0) {
			x = entity.bounds.left;
		}
		else {
			return;
		}
		
		const matches = this.tiles.searchByRange(
			entity.bounds.left,
			entity.bounds.right,
			entity.bounds.top,
			entity.bounds.bottom
		);
		
		matches.forEach(match => {
			if (match.tile.type !== 'ground') {
				return;
			}
			
			if (entity.vel.x > 0) {
				if (entity.bounds.right > match.x1) {
					entity.bounds.right = match.x1;
					entity.vel.x = 0;
					entity.obstruct(SIDES.RIGHT);
				}
			}
			else if (entity.vel.x < 0) {
				if (entity.bounds.left < match.x2) {
					entity.bounds.left = match.x2;
					entity.vel.x = 0;
					entity.obstruct(SIDES.LEFT);
				}
			}
		});
	}
	
	checkY(entity) {
		let y;
		if (entity.vel.y > 0) {
			y = entity.bounds.bottom;
		}
		else if (entity.vel.y < 0) {
			y = entity.bounds.top;
		}
		else {
			return;
		}
		
		const matches = this.tiles.searchByRange(
			entity.bounds.left,
			entity.bounds.right,
			entity.bounds.top,
			entity.bounds.bottom
		);
		
		matches.forEach(match => {
			if (match.tile.type !== 'ground') {
				return;
			}
			
			if (entity.vel.y > 0) {
				if (entity.bounds.bottom > match.y1) {
					entity.bounds.bottom = match.y1;
					entity.vel.y = 0;
					
					entity.obstruct(SIDES.BOTTOM);
				}
			}
			else if (entity.vel.y < 0) {
				if (entity.bounds.top < match.y2) {
					entity.bounds.top = match.y2;
					entity.vel.y = 0;
					
					entity.obstruct(SIDES.TOP);
				}
			}
		});
	}
	
	test(entity) {
		const match = this.tiles.searchByPosition(entity.bounds.left, entity.bounds.top);
		return match;
	}
}