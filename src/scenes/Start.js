export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
        
        // Inicializar variáveis do jogo
        this.score = 0;
        this.lives = 1;
        this.gameTime = 0;
        this.startTime = 0;
        this.boxesCollected = 0;
        this.shield = null;
        this.shieldCollider = null;
        this.meteoroDelay = 1500;
    }

    preload() {
        this.load.image('fundo', 'assets/sky.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.spritesheet('heroi', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('caixa', 'assets/box.png');
        this.load.image('meteoro', 'assets/meteor.png');
        this.load.image('escudo', 'assets/box.png'); // Usar imagem da caixa como escudo
        this.load.audio('morte', 'assets/Audio/morte.mp3');
        this.load.audio('alerta', 'assets/Audio/alerta.mp3');
        this.load.audio('apanha', 'assets/Audio/apanha.mp3');
        this.load.audio('quebrar', 'assets/Audio/quebrar.mp3');
        this.load.audio('explosao', 'assets/Audio/explosao.mp3');
        this.load.audio('escudo', 'assets/Audio/escudo.mp3');
        this.load.audio('salto', 'assets/Audio/salto.mp3');
    
    }

    create() {
                
        // Adicionar imagem de fundo
        this.add.image(400, 300, 'fundo');
        
        // Criar grupo estático de física para as plataformas
        this.platforms = this.physics.add.staticGroup();

        // Criar a plataforma principal
        this.platforms.create(400, 568, 'platform').setScale(3).refreshBody();
        
        // criação do player e a pocição onde ele aparece
        this.player = this.physics.add.sprite(100, 450, 'heroi');

        // Impede que o player saia da tela
        this.player.setCollideWorldBounds(true);

        // manter o player na plataforma
        this.physics.add.collider(this.player, this.platforms);

        // atribuir alguma elasticidade ao player
        this.player.setBounce(0.2);
        
        // criar animacoes do player
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('heroi', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('heroi', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'heroi', frame: 4 } ],
            frameRate: 10,
            repeat: 20
        });
        
        // utilizar o teclado
        this.cursors = this.input.keyboard.createCursorKeys();

        // criar grupo de caixas
        this.boxes = this.physics.add.group();
        const boxCount = 1; // número de caixas
        for (let i = 0; i < boxCount; i++) {
            const x = Phaser.Math.Between(20, 780); // margem para ficar dentro da tela
            const y = Phaser.Math.Between(20, 300); // em cima para que possam cair
            const box = this.boxes.create(x, y, 'caixa');
            box.setBounceY(Phaser.Math.FloatBetween(0.3, 0.4));
            box.setScale(0.15); // Configurar tamanho da caixa 
        }
        
        // manter a caixa na plataforma
        this.physics.add.collider(this.boxes, this.platforms);

        // ativar o player a apanhar as caixas
        this.physics.add.overlap(this.player, this.boxes, this.collectBox, null, this);

        // Resetar valores para novo jogo
        this.score = 0;
        this.lives = 1;
        this.gameTime = 0;
        this.boxesCollected = 0;
        this.shield = null;
        this.shieldCollider = null;
        this.meteoroDelay = 1500;
        
        // Inicializar startTime no primeiro update após criar a cena
        this.startTime = null;
        
        // adicionar texto da pontuação, vidas e progresso para o escudo
        this.scoreText = this.add.text(16, 16, 'Pontuação: ' + this.score, { fontSize: '24px', fill: '#000', fontStyle: 'bold' });
        this.livesText = this.add.text(16, 44, 'Vidas: ' + this.lives, { fontSize: '24px', fill: '#000', fontStyle: 'bold' });
        this.timeText = this.add.text(16, 72, 'Tempo: ', { fontSize: '24px', fill: '#000', fontStyle: 'bold' });
        this.shieldText = this.add.text(16, 100, 'Escudo: ' + this.boxesCollected + '/10', { fontSize: '24px', fill: '#000', fontStyle: 'bold' });
        
        // tecla para ativar escudo ('T')
        this.keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        
        // Criar grupo de meteoros
        this.meteoros = this.physics.add.group();
        
        // Delay inicial dos meteoros
        this.meteoroDelay = 5000;
        
        // Gerar meteoros com delay inicial
        this.meteoroTimer = this.time.addEvent({
            delay: this.meteoroDelay,
            callback: () => {
                const x = Phaser.Math.Between(50, 750);
                const meteoro = this.meteoros.create(x, 0, 'meteoro');
                meteoro.setScale(0.2);
            },
            loop: true
        });
        
        // A cada 10 segundos, diminuir delay em 200ms (mínimo de 300ms)
        this.difficultyTimer = this.time.addEvent({
            delay: 10000,
            callback: () => {
                // Reduzir delay 300 é o delay mínimo
                const oldDelay = this.meteoroDelay;
                this.meteoroDelay = Math.max(300, this.meteoroDelay - 1000);
                
                // Se já atingiu o mínimo, parar o timer de dificuldade
                if (this.meteoroDelay === 300 && oldDelay === 300) {
                    if (this.difficultyTimer) {
                        this.difficultyTimer.remove(false);
                    }
                    return;
                }
                
                // Mostrar aviso de aumento de dificuldade
                const warningText = this.add.text(400, 300, 'DIFICULDADE AUMENTADA!', { 
                    fontSize: '32px', 
                    fill: '#ff0000',
                    backgroundColor: '#000000',
                    padding: { x: 10, y: 5 }
                }).setOrigin(0.5);

                // Tocar som de alerta
                this.sound.play('alerta');
                
                // Fazer o texto desaparecer após 2 segundos
                this.time.delayedCall(2000, () => {
                    warningText.destroy();
                });
                
                // Remover timer antigo
                if (this.meteoroTimer) {
                    this.meteoroTimer.remove(false);
                }
                
                // Criar novo timer com delay reduzido
                this.meteoroTimer = this.time.addEvent({
                    delay: this.meteoroDelay,
                    callback: () => {
                        const x = Phaser.Math.Between(50, 750);
                        const meteoro = this.meteoros.create(x, 0, 'meteoro');
                        meteoro.setScale(0.2);
                    },
                    loop: true
                });
            },
            loop: true
        });

        // Se meteoro bater na plataforma, ele desaparece
        this.physics.add.collider(this.meteoros, this.platforms, (meteoro) => {
            // tocar som ao destruir o escudo
            this.sound.play('explosao');
            
            meteoro.disableBody(true, true);
        });
        
        // Colisão entre jogador e meteoros (fim de jogo)
        this.physics.add.overlap(this.player, this.meteoros, this.hitMeteoro, null, this);
    }
    
    hitMeteoro(player, meteoro) {
        // Desativar meteoro que colidiu
        meteoro.disableBody(true, true);

        // Reduzir vidas
        this.lives -= 1;
        this.livesText.setText('Vidas: ' + this.lives);
        // Tocar som de morte
        this.sound.play('morte');

        if (this.lives <= 0) {
            // Fim de jogo - parar meteoros e ir para tela de GameOver
            if (this.meteoroTimer) {
                this.meteoroTimer.remove(false);
            }
            this.scene.start('GameOver', { score: this.score, time: this.gameTime });
        } else {
            player.setTint(0xffaaaa);
            this.time.delayedCall(300, () => player.clearTint());
        }
    }

    update() {
        // Inicializar startTime no primeiro update
        if (this.startTime === null) {
            this.startTime = this.time.now;
        }
        
        // Atualizar tempo de jogo
        this.gameTime = Math.floor((this.time.now - this.startTime) / 1000);
        this.timeText.setText('Tempo: ' + this.gameTime + 's');
        
        // Atualizar posição do escudo se existir
        if (this.shield) {
            this.shield.setPosition(this.player.x, this.player.y - 40);
        }
        
        // Detectar tecla T para ativar escudo
        if (Phaser.Input.Keyboard.JustDown(this.keyT)) {
            if (this.boxesCollected >= 10 && !this.shield) {
                // tocar som ao chamar o escud
                this.sound.play('escudo');
                this.createShield();
            }
        }
        
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-350);
            // tocar som ao saltar
            this.sound.play('salto');
        }
    }

    collectBox (player,box){
        box.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('Pontuação: ' + this.score);
        
        // Incrementar contador de caixas para escudo
        this.boxesCollected += 1;
        this.shieldText.setText('Escudo: ' + this.boxesCollected + '/10');

        // tocar som ao apanhar a caixa
        this.sound.play('apanha');
        // verificar se ainda há caixas ativas
        if (this.boxes.countActive(true) === 0){
            // colocar caixas em posições aleatórias distintas
            this.boxes.children.iterate((child) => {
                const x = Phaser.Math.Between(20, this.scale.width - 20);
                const y = Phaser.Math.Between(20, 250);
                child.enableBody(true, x, y, true, true);
                child.setBounceY(Phaser.Math.FloatBetween(0.3, 0.4));
            });
            // não criar meteoros aqui mais — meteoros são gerados periodicamente pelo timer
        }
    }
    
    // cria o escudo acima do jogador
    createShield() {
        // criação do escudo
        this.shield = this.add.rectangle(this.player.x, this.player.y - 40, 60, 12, 0x00ff00, 0.6);
        this.physics.add.existing(this.shield);
        this.shield.body.setAllowGravity(false);
        this.shield.body.setImmovable(true);
        this.shield.setDepth(10);

        // colidir o escudo com meteoros: o escudo consome um meteoro e é destruído
        this.shieldCollider = this.physics.add.collider(this.shield, this.meteoros, this.shieldHit, null, this);

        // usar 10 caixas -> resetar contador para indicar consumo ao criar o escudo
        this.boxesCollected = 0;
        this.shieldText.setText('Escudo: 0/10');
    }

    // quando o meteoro atinge o escudo
    shieldHit(shieldObj, meteor) {
        // remover o meteoro
        meteor.disableBody(true, true);

        // tocar som ao destruir o escudo
        this.sound.play('quebrar');

        // destruir o escudo e limpar collider
        if (this.shieldCollider) {
            this.shieldCollider.destroy();
            this.shieldCollider = null;
        }
        if (this.shield) {
            this.shield.destroy();
            this.shield = null;
        }
    }
    
}
