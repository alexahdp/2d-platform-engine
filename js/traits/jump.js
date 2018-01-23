import {Trait, SIDES} from '../entity.js'

export default class Jump extends Trait {
	constructor() {
		super('jump');
		
		// флаг о том, можно ли прыгать
		// чтоб спрайт не менялся при прыжке под кирпичами
		// пришлось сделать числовым
		this.ready = 0;
		
		this.velocity = 200;
		
		// время торможения
		this.duration = 0.3;
		
		// торможение разгона при прыжке (счетчик)
		// чтоб не улетал как ракета
		this.engageTime = 0;
		
		// чтобы прыгать можно была еще не приземлившись до конца
		this.requestTime = 0;
		this.gracePeriod = 0.1;
		
		// коэффициент зависимости высоты прыжка от скорости
		this.speedBoost = 0.3;
	}
	
	start() {
		this.requestTime = this.gracePeriod;
	}
	
	cancel() {
		this.engageTime = 0;
		this.requestTime = 0;
	}
	
	get falling() {
		return this.ready < 0;
	}
	
	update(entity, deltaTime) {
		if (this.requestTime) {
			if (this.ready > 0) {
				this.engageTime = this.duration;
				this.requestTime = 0;
			}
			
			this.requestTime -= deltaTime;
		}
		
		if (this.engageTime > 0) {
			// зависимость высоты прыжка от скорости!
			entity.vel.y = -(this.velocity + Math.abs(entity.vel.x) * this.speedBoost);
			this.engageTime -= deltaTime;
		}
		
		this.ready--;
	}
	
	// а можно ли прыгать?
	obstruct(entity, side) {
		if (side == SIDES.BOTTOM) {
			this.ready = 1;
		}
		else if (side == SIDES.TOP) {
			this.cancel();
		}
	}
}