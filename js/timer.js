export default class Timer {
	constructor(deltaTime) {
		let accumulatedTime = 0;
		let lastTime = 0;
		
		this.updateProxy = time => {
			accumulatedTime += (time - lastTime) / 1000;
			
			if (accumulatedTime > 1) {
				accumulatedTime = 1;
			}
			
			// это злоебучий хак для борьбы с переменной высотой прыжка
			// и для постоянной скорости независимо от просадки fps
			while (accumulatedTime > deltaTime) {
				this.update(deltaTime);
				accumulatedTime -= deltaTime;
			}
			
			lastTime = time;
			
			this.enqueue();
		}
	}
	
	enqueue() {
		requestAnimationFrame(this.updateProxy);
	}
	
	start() {
		this.enqueue();
	}
}