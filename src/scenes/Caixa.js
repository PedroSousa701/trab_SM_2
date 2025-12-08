export class Caixa {
	
	constructor(scene, options = {}) {
		this.scene = scene;
        // número de caixas a criar
		this.boxCount = options.boxCount || 1;
         // escala da caixa (default = 0.15)
		this.scale = options.scale || 0.15;
        // limites de spawn em X e Y 
		this.minX = (options.xRange && options.xRange[0]) || 20;
		this.maxX = (options.xRange && options.xRange[1]) || Math.max(100, scene.scale.width - 20);
		this.minY = (options.yRange && options.yRange[0]) || 20;
		this.maxY = (options.yRange && options.yRange[1]) || 300;

		this.group = this.scene.physics.add.group();
        // criar as caixas iniciai
		this.createBoxes();
	}

	createBoxes() {
		for (let i = 0; i < this.boxCount; i++) {
			const x = Phaser.Math.Between(this.minX, this.maxX);
			const y = Phaser.Math.Between(this.minY, this.maxY);
			const box = this.group.create(x, y, 'caixa');
            // dar um bounce vertical aleatório
			box.setBounceY(Phaser.Math.FloatBetween(0.3, 0.4));
			// aplicar escala definida
            box.setScale(this.scale);
		}
	}

	// liga colisão entre caixas e plataformas
	setPlatformCollider(platforms, onPlatformHit) {
		this.scene.physics.add.collider(this.group, platforms, (box, plat) => {
			// não desativar a caixa ao colidir, apenas permitir colisão
			if (typeof onPlatformHit === 'function') onPlatformHit(box, plat);
		});
	}

	// liga overlap entre jogador e caixa
	setPlayerOverlap(player, callback) {
		this.scene.physics.add.overlap(player, this.group, (p, b) => {
			// chama callback quando jogador toca numa caixa
            if (typeof callback === 'function') callback(p, b);
		}, null, this.scene);
	}

	// reativa todas as caixas em posições novas (usado quando todas foram recolhidas)
	respawnAll() {
		this.group.children.iterate((child) => {
			const x = Phaser.Math.Between(this.minX, this.maxX);
			const y = Phaser.Math.Between(this.minY, this.maxY);
			if (child.enableBody) {
				child.enableBody(true, x, y, true, true);
				child.setBounceY(Phaser.Math.FloatBetween(0.3, 0.4));
			}
		});
	}

	// comportamento quando jogador apanha uma caixa
	collectBox(player, box) {
		const scene = this.scene;

		// desativar a caixa recolhida
		if (box && box.disableBody) box.disableBody(true, true);

		// aumentar pontuação
		scene.score = (scene.score || 0) + 10;
		if (scene.scoreText && typeof scene.scoreText.setText === 'function') {
			scene.scoreText.setText('Pontuação: ' + scene.score);
		}

		// incrementar contador de caixas para escudo
		scene.boxesCollected = (scene.boxesCollected || 0) + 1;
		if (scene.shieldText && typeof scene.shieldText.setText === 'function') {
			scene.shieldText.setText('Escudo: ' + scene.boxesCollected + '/10');
		}

		// tocar som ao apanhar a caixa
		if (scene.sound && typeof scene.sound.play === 'function') {
			scene.sound.play('apanha');
		}

		// se não houver caixas ativas, re-spawn
		if (this.countActive && this.countActive() === 0) {
			this.respawnAll();
		}
	}

    // devolve número de caixas ativas
	countActive() {
		return this.group.countActive(true);
	}

    // devolve o grupo de caixas (para colisores externos)
	getGroup() {
		return this.group;
	}
}
