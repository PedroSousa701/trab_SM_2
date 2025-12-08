export class Escudo {
	
	constructor(scene, player, meteoroGroup, onHit) {
		this.scene = scene;
		this.player = player;
		this.meteoroGroup = meteoroGroup;
		this.onHit = onHit;

		// criar representação e collider através do método dedicado
		this.gameObject = null;
		this.collider = null;
		this.createShield();
	}

	// cria o rectângulo gráfico e o corpo físico do escudo
	createShield() {
		// criar retangulo como escudo
		this.gameObject = this.scene.add.rectangle(this.player.x, this.player.y - 40, 60, 12, 0x00ff00, 0.6);
		this.scene.physics.add.existing(this.gameObject);
		this.gameObject.body.setAllowGravity(false);
		this.gameObject.body.setImmovable(true);
		this.gameObject.setDepth(10);

		// criar colisão entre escudo e meteoros
		if (this.meteoroGroup) {
			// quando meteoro colide, chama shieldHit
			this.collider = this.scene.physics.add.collider(this.gameObject, this.meteoroGroup, this.shieldHit.bind(this));
		}

		// registar update global para que o escudo siga o jogador
		if (this.scene && this.scene.events && typeof this.scene.events.on === 'function') {
			this.scene.events.on('update', this.update, this);
		}
	}

	// impacto entre escudo e meteoro
	shieldHit(shieldObj, meteor) {
		// desativar o meteoro
		if (meteor && meteor.disableBody) meteor.disableBody(true, true);

		// destruir o escudo (remove collider e gameObject)
		this.destroy();

		// notificar callback externo (Start.shieldHit)
		if (typeof this.onHit === 'function') {
			try { this.onHit(shieldObj, meteor); } catch (e) { /* ignore callback errors */ }
		}
	}

	// Atualiza posição do escudo para seguir o jogador
	update() {
		if (this.gameObject && this.player) {
			this.gameObject.setPosition(this.player.x, this.player.y - 40);
		}
	}

	// Remove collider e o objeto gráfico
	destroy() {
		if (this.collider) {
			try { this.collider.destroy(); } catch (e) { /* ignore */ }
			this.collider = null;
		}
		if (this.gameObject) {
			try { this.gameObject.destroy(); } catch (e) { /* ignore */ }
			this.gameObject = null;
		}

		// remover listener de update para evitar leaks
		if (this.scene && this.scene.events && typeof this.scene.events.off === 'function') {
			try { this.scene.events.off('update', this.update, this); } catch (e) { /* ignore */ }
		}
	}
}
