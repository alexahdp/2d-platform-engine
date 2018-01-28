import Entity, {SIDES, Trait} from '../entity.js'
import {loadSpriteSheet} from '../loader.js'
import PendulumMove from '../traits/pendulum_move.js'
import Killable from '../traits/killable.js'
import Solid from '../traits/solid.js'
import Physics from '../traits/physics.js'

const STATE_WALKING = Symbol('walking');
const STATE_HIDING = Symbol('hiding');
const STATE_PANIC = Symbol('panic');

export default async function loadKoopa() {
	const sprite = await loadSpriteSheet('koopa');
	return createKoopaFactory(sprite);
}


class Behavior extends Trait {
	constructor() {
		super('behavior');
		this.state = STATE_WALKING;
		this.hideTime = 0;
		this.hideDuration = 5;
		this.walkSpeed = null;
		this.panicSpeed = 300;
	}
	
	collides(us, them) {
		if (us.killable.dead) {
			return;
		}
		
		if (them.stomper) {
			if (them.vel.y > us.vel.y) {
				this.handleStomp(us, them);
			} else {
				this.handleNudge(us, them);
			}
		}
	}
	
	// nudge - подталкивать (локтем)
	handleNudge(us, them) {
		if (this.state === STATE_WALKING) {
			them.killable.kill()
		}
		else if (this.state === STATE_HIDING) {
			this.panic(us, them);
		}
		else if (this.state === STATE_PANIC) {
			const travelDir = Math.sign(us.vel.x);
			const impactDir = Math.sign(us.pos.x - them.pos.x);
			if (travelDir !== 0 && travelDir != impactDir) {
				them.killable.kill();
			}
		}
	}
	
	handleStomp(us, them) {
		if (this.state === STATE_WALKING) {
			this.hide(us);
		}
		else if (this.state === STATE_HIDING) {
			us.killable.kill();
			us.vel.set(100, -200);
			us.solid.obstructs = false;
		}
		else if (this.state = STATE_PANIC) {
			this.hide(us);
		}
	}
	
	hide(us) {
		us.vel.x = 0;
		us.pendulumMove.enabled = false;
		if (this.walkSpeed === null) {
			this.PalkSpeed = us.pendulumMove.speed;
		}
		this.hideTime = 0;
		this.state = STATE_HIDING;
	}
	
	unhide(us) {
		us.pendulumMove.enabled = true;
		this.state = STATE_WALKING;
		us.pendulumMove.speed = this.walkSpeed;
	}
	
	panic(us, them) {
		us.pendulumMove.enabled = true;
		us.pendulumMove.speed = this.panicSpeed * Math.sign(them.vel.x);
		this.state = STATE_PANIC;
	}
	
	update(us, deltaTime) {
		if (this.state === STATE_HIDING) {
			this.hideTime += deltaTime;
			if (this.hideTime > this.hideDuration) {
				this.unhide(us);
			}
		}
	}
}

function createKoopaFactory(sprite) {
	const walkAnim = sprite.animations.get('walk');
	const wakeAnim = sprite.animations.get('wake');
	
	function routeAnim(koopa) {
		if (koopa.behavior.state === STATE_HIDING) {
			if (koopa.behavior.hideTime > 3) {
				return wakeAnim(koopa.behavior.hideTime);
			}
			return 'hiding';
		}
		
		if (koopa.behavior.state === STATE_PANIC) {
			return 'hiding';
		}
		
		if (koopa.killable.dead) {
			return 'flat';
		}
		
		return walkAnim(koopa.lifetime);
	}
	
	function draw(context) {
		sprite.draw(routeAnim(this), context, 0, 0, this.vel.x < 0);
	};
	
	return function createKoopa() {
		const koopa = new Entity();
		koopa.size.set(16, 16);
		koopa.offset.y = 8;
		koopa.draw = draw;
		
		koopa.addTrait(new Physics());
		koopa.addTrait(new PendulumMove());
		koopa.addTrait(new Behavior());
		koopa.addTrait(new Killable());
		koopa.addTrait(new Solid());
		
		return koopa;
	}
}