export default class Composer {
	constructor() {
		this.layers = [];
	}
	
	draw(context, ...args) {
		this.layers.forEach(layer => layer(context, ...args));
	}
}