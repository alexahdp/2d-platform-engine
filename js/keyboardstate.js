const PRESSED = 1;
const RELEASED = 0

export default class KeyBoardState {
	
	constructor() {
		// хранит текущее состояние заданной клавиши
		this.keyStates = new Map();
		
		// хранит коллбэки для клавиш
		this.keyMap = new Map();
	}
	
	
	addMapping(code, cb) {
		this.keyMap.set(code, cb);
	}
	
	
	handleEvent(e) {
		const {code} = e;
		if (!this.keyMap.has(code)) {
			return;
		}
		
		e.preventDefault();
		
		const keyState = e.type === 'keydown' ? PRESSED : RELEASED;
		
		// состояние нажатия клавиши не изменилось
		if (this.keyStates.get(code) === keyState) {
			return;
		}
		
		this.keyStates.set(code, keyState);
		
		this.keyMap.get(code)(keyState);
	}
	
	
	listenTo() {
		['keydown', 'keyup'].forEach(eventName => {
			window.addEventListener(eventName, e => this.handleEvent(e));
		});
	}
}
