export class Plataforma {
	/**
	 * scene: Phaser.Scene
	 * options: { defaultKey, defaultScale }
	 */
	constructor(scene, options = {}) {
		this.scene = scene;
		this.defaultKey = options.defaultKey || 'platform';
		this.defaultScale = options.defaultScale || 3;
		this.group = this.scene.physics.add.staticGroup();
	}

	// Cria a plataforma principal
	createMainPlatform(x = 400, y = 568) {
		const plat = this.group.create(x, y, this.defaultKey).setScale(this.defaultScale);
		// refreshBody necessário após setScale para staticGroup
		if (typeof plat.refreshBody === 'function') plat.refreshBody();
		return plat;
	}

	// Adiciona uma plataforma arbitrária; retorna o objeto criado
	addPlatform(x, y, key = this.defaultKey, scale = 1) {
		const plat = this.group.create(x, y, key).setScale(scale);
		if (typeof plat.refreshBody === 'function') plat.refreshBody();
		return plat;
	}

	// Retorna o group para uso em colliders
	getGroup() {
		return this.group;
	}

	// Helper para ligar colisão entre plataformas e um object/ group/ sprite
	// onCollide optional callback (obj, platform)
	setColliderWith(object, onCollide) {
		const collider = this.scene.physics.add.collider(object, this.group, (obj, plat) => {
			if (typeof onCollide === 'function') onCollide(obj, plat);
		});
		return collider;
	}
}
