// Adicionar importações no topo do ficheiro
import { Player } from './Player.js';
import { Meteoro } from './Meteoro.js';
import { Escudo } from './Escudo.js';
import { Plataforma } from './Plataforma.js';
import { Caixa } from './Caixa.js';

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
        
        // variáveis do jogo
        this.score = 0;
        this.lives = 1;
        this.gameTime = 0;
        this.startTime = 0;
        this.boxesCollected = 0;
        this.shield = null;
        this.meteoroDelay = 1500;
    }

    preload() {
        this.load.image('fundo', 'assets/sky.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.spritesheet('heroi', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('caixa', 'assets/box.png');
        this.load.image('meteoro', 'assets/meteor.png');
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
        
        // Criar uma plataforma através da classe Plataforma
        this.plataforma = new Plataforma(this, { defaultKey: 'platform', defaultScale: 3 });
        this.plataforma.createMainPlatform(400, 568);

        // criação do player usando a classe Player
        this.player = new Player(this, 100, 450, 'heroi');
        this.plataforma.setColliderWith(this.player);

        // Criar as caixas através da classe Caixa 
        this.caixas = new Caixa(this, { boxCount: 1, scale: 0.15 });
        this.caixas.setPlatformCollider(this.plataforma.getGroup());
        this.caixas.setPlayerOverlap(this.player, this.caixas.collectBox.bind(this.caixas));

        // reiniciar valores para novo jogo 
        this.score = 0;
        this.lives = 1;
        this.gameTime = 0;
        this.boxesCollected = 0;
        this.shield = null;
        this.meteoroDelay = 1500;
        
        // Inicializar startTime no primeiro update após criar a cena
        this.startTime = null;

        // adicionar texto da pontuação, vidas e progresso para o escudo 
        this.scoreText = this.add.text(16, 16, 'Pontuação: ' + this.score, { fontSize: '24px', fill: '#000', fontStyle: 'bold' });
        this.livesText = this.add.text(16, 44, 'Vidas: ' + this.lives, { fontSize: '24px', fill: '#000', fontStyle: 'bold' });
        this.timeText = this.add.text(16, 72, 'Tempo: ', { fontSize: '24px', fill: '#000', fontStyle: 'bold' });
        this.shieldText = this.add.text(16, 100, 'Escudo: ' + this.boxesCollected + '/10', { fontSize: '24px', fill: '#000', fontStyle: 'bold' });

         // tecla T para ativar escudo 
         this.keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
         
         // Criar instância de Meteoro e iniciar os timers/respawn
         this.meteoro = new Meteoro(this, { initialDelay: 5000, minDelay: 300, step: 1000, interval: 10000 });
         this.meteoro.start();
         this.meteoro.setPlatformCollider(this.plataforma.getGroup());
         this.meteoro.setPlayerOverlap(this.player, this.meteoro.handlePlayerCollision.bind(this.meteoro));
     }
    
    update() {
        // Inicializar startTime no primeiro update
        if (this.startTime === null) {
            this.startTime = this.time.now;
        }
        
        // Atualizar tempo de jogo
        this.gameTime = Math.floor((this.time.now - this.startTime) / 1000);
        if (this.timeText && typeof this.timeText.setText === 'function') {
            this.timeText.setText('Tempo: ' + this.gameTime + 's');
        }
        
        // Detectar tecla T para ativar escudo
        if (Phaser.Input.Keyboard.JustDown(this.keyT)) {
            if (this.boxesCollected >= 10 && !this.shield) {
                // Som de ativação
                this.sound.play('escudo');

                // criar escudo
                const meteoroGroup = this.meteoro ? this.meteoro.meteoros : null;
                this.shield = new Escudo(this, this.player, meteoroGroup, (shieldObj, meteor) => {
                    // Som de quebra
                    this.sound.play('quebrar');
                    this.shield = null;
                });

                // reset contador de caixas e atualizar UI
                // consumir 10 caixas para o escudo (reduzir contador em 10, mínimo 0)
                this.boxesCollected = Math.max(0, (this.boxesCollected || 0) - 10);
                if (this.shieldText && typeof this.shieldText.setText === 'function') {
                    this.shieldText.setText('Escudo: ' + this.boxesCollected + '/10');
                }
            }
        }

        // delegar movimento e saltos ao Player
        if (this.player && typeof this.player.update === 'function') {
            this.player.update();
        }
    }
}
