export class Meteoro {
	constructor(scene, options = {}) {
		this.scene = scene;
		this.meteoros = scene.physics.add.group();
        // tempo inicial entre meteoros
		this.meteoroDelay = options.initialDelay || 5000;
        // limite mínimo de delay
		this.minDelay = options.minDelay || 300;
        // redução do delay por ciclo
		this.difficultyStep = options.step || 1000; 
		this.difficultyInterval = options.interval || 10000;
		this.meteoroTimer = null;
		this.difficultyTimer = null;
	}

	start() {
		// cria timer de spawn
		if (this.meteoroTimer) this.meteoroTimer.remove(false);
		this.meteoroTimer = this.scene.time.addEvent({
			delay: this.meteoroDelay,
			callback: () => this.spawn(),
			loop: true
		});

		// cria timer de dificuldade
		if (this.difficultyTimer) this.difficultyTimer.remove(false);
		this.difficultyTimer = this.scene.time.addEvent({
			delay: this.difficultyInterval,
			callback: () => this.increaseDifficulty(),
			loop: true
		});
	}

	stop() {
		if (this.meteoroTimer) this.meteoroTimer.remove(false);
		if (this.difficultyTimer) this.difficultyTimer.remove(false);
		this.meteoroTimer = null;
		this.difficultyTimer = null;
	}

    // Cria um meteoro numa posição X aleatória
	spawn(x) {
		const spawnX = (typeof x === 'number') ? x : Phaser.Math.Between(50, 750);
		const meteoro = this.meteoros.create(spawnX, 0, 'meteoro');
		meteoro.setScale(0.2);
		return meteoro;
	}

    // Aumenta dificuldade reduzindo o delay entre meteoros
	increaseDifficulty() {
		const oldDelay = this.meteoroDelay;
		this.meteoroDelay = Math.max(this.minDelay, this.meteoroDelay - this.difficultyStep);

		// Mostrar aviso visual e sonoro
		const warningText = this.scene.add.text(400, 300, 'DIFICULDADE AUMENTADA!', { 
			fontSize: '32px', 
			fill: '#ff0000',
			backgroundColor: '#000000',
			padding: { x: 10, y: 5 }
		}).setOrigin(0.5);

		// tocar som de alerta 
		if (this.scene && this.scene.sound) {
			this.scene.sound.play('alerta');
		}

		this.scene.time.delayedCall(2000, () => warningText.destroy());

		// recriar timer de spawn com novo delay
		if (this.meteoroTimer) {
			this.meteoroTimer.remove(false);
		}
		this.meteoroTimer = this.scene.time.addEvent({
			delay: this.meteoroDelay,
			callback: () => this.spawn(),
			loop: true
		});

		// se já chegou ao mínimo duas vezes consecutivas, pode optar por parar (comportamento opcional)
		if (this.meteoroDelay === this.minDelay && oldDelay === this.minDelay) {
			if (this.difficultyTimer) this.difficultyTimer.remove(false);
		}
	}

	// trata colisão entre jogador e um meteoro 
	handlePlayerCollision(player, meteoro) {
		// Desativar meteoro que colidiu
		if (meteoro && meteoro.disableBody) meteoro.disableBody(true, true);

		const scene = this.scene;

		// Reduzir vidas 
		if (typeof scene.lives === 'number') {
			scene.lives -= 1;
			if (scene.livesText && typeof scene.livesText.setText === 'function') {
				scene.livesText.setText('Vidas: ' + scene.lives);
			}
		}

		// Tocar som de morte
		if (scene && scene.sound && typeof scene.sound.play === 'function') {
			scene.sound.play('morte');
		}

		// Verificar fim de jogo
		if (typeof scene.lives === 'number' && scene.lives <= 0) {
			this.stop();
			if (scene && typeof scene.scene === 'object') {
				scene.scene.start('GameOver', { score: scene.score || 0, time: scene.gameTime || 0 });
			}
			return;
		}

		
	}

	// Métodos utilitários para ligar colisões externamente (Start.js pode chamar)
	setPlatformCollider(platforms, onPlatformHit) {
		this.scene.physics.add.collider(this.meteoros, platforms, (meteoro, plat) => {
			// tocar som de explosao 
			if (this.scene && this.scene.sound) {
				this.scene.sound.play('explosao');
			}
            // Desativar meteoro
			meteoro.disableBody(true, true);
			if (typeof onPlatformHit === 'function') onPlatformHit(meteoro, plat);
		});
	}

    // Liga overlap meteoro vs jogador
	setPlayerOverlap(player, callback) {
		this.scene.physics.add.overlap(player, this.meteoros, (p, m) => {
			if (typeof callback === 'function') callback(p, m);
		});
	}

    // Liga colisão meteoro vs escudo
	setShieldCollider(shield, callback) {
		this.scene.physics.add.collider(shield, this.meteoros, (s, m) => {
			if (typeof callback === 'function') callback(s, m);
		});
	}
}