const PRESSED = 1;
const RELEASED = 0

export default class KeyBoardState {
	
	constructor() {
		// хранит текущее состояние заданной клавиши
		this.keyStates = new Map();
		
		// хранит коллбэки для клавиш
		this.keyMap = new Map();
	}
	
	
	addMapping(keyCode, cb) {
		this.keyMap.set(keyCode, cb);
	}
	
	
	handleEvent(e) {
		const {keyCode} = e;
		if (!this.keyMap.has(keyCode)) {
			return;
		}
		
		e.preventDefault();
		
		const keyState = e.type === 'keydown' ? PRESSED : RELEASED;
		
		// состояние нажатия клавиши не изменилось
		if (this.keyStates.get(keyCode) === keyState) {
			return;
		}
		
		this.keyStates.set(keyCode, keyState);
		
		this.keyMap.get(keyCode)(keyState);
	}
	
	
	listenTo() {
		['keydown', 'keyup'].forEach(eventName => {
			window.addEventListener(eventName, e => this.handleEvent(e));
		});
	}
}
