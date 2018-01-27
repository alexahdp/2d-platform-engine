import loadMario from './entities/mario.js'
import loadGoomba from './entities/goomba.js'
import loadKoopa from './entities/koopa.js'

export async function loadEntities() {
	const [createMario, createGoomba, createKoopa] = await Promise.all([
		loadMario(),
		loadGoomba(),
		loadKoopa()
	]);
	
	const entityFactories = {
		mario: createMario,
		goomba: createGoomba,
		koopa: createKoopa
	};
	
	return entityFactories;
}