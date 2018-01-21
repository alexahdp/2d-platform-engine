export default class Composer {
	constructor() {
		this.layers = [];
	}
	
	draw(context, camera) {
		this.layers.forEach(layer => {
			layer(context, camera)
		});
	}
}