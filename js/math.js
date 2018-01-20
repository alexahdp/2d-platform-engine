export class Matrix {
	constructor() {
		this.grid = [];
	}
	
	forEach(cb) {
		this.grid.forEach((col, x) => {
			col.forEach((value, y) => {
				cb(value, x, y);
			});
		});
	}
	
	get(x, y) {
		const col = this.grid[x];
		if (col) return col[y];
		
		return undefined;
	}
	
	set(x, y, value) {
		if (!this.grid[x]) {
			this.grid[x] = [];
		}
		
		this.grid[x][y] = value;
	}
}


export default class Vec2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	
	set(x, y) {
		this.x = x;
		this.y = y;
	}
	
	add(vec2) {
		this.x += vec2.x;
		this.y += vec2.y;
	}
}