import KeyboardState from './keyboardstate.js'

export default function setupKeyboard(mario) {
	const input = new KeyboardState();
	
	input.addMapping('ArrowUp', keyState => {
		if (keyState) {
			mario.jump.start();
		} else {
			mario.jump.cancel();
		}
	});
	
	input.addMapping('ArrowRight', keyState => {
		mario.go.dir += keyState ? 1 : -1;
	});
	
	input.addMapping('ArrowLeft', keyState => {
		mario.go.dir += -keyState ? -1 : 1;
	});
	
	input.addMapping('Space', keyState => {
		mario.turbo(keyState);
	});
	
	return input;
}
