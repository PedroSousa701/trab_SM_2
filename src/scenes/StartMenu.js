export class StartMenu extends Phaser.Scene {

    constructor() {
        super('StartMenu');
    }

    create() {
        // Fundo simples — Start.js carrega as imagens quando a cena principal iniciar
        this.cameras.main.setBackgroundColor('#1a1a2e');

        // Título do jogo
        this.add.text(400, 180, 'Meteoros', { fontSize: '64px', fill: '#ffffff' }).setOrigin(0.5);

        // Instruções
        this.add.text(400, 260, 'Pressione ENTER ou clique em JOGAR', { fontSize: '20px', fill: '#ffffff' }).setOrigin(0.5);

        // Botão 'Jogar' como texto interativo
        const playText = this.add.text(400, 360, 'JOGAR', { fontSize: '48px', fill: '#ffd166', backgroundColor: '#073b4c', padding: { x: 20, y: 10 } }).setOrigin(0.5);
        playText.setInteractive({ useHandCursor: true });
        playText.on('pointerdown', () => {
            this.startGame();
        });

        // Começar com Enter
        this.input.keyboard.on('keydown-ENTER', () => {
            this.startGame();
        });

        // Botão 'Instruções' para abrir a cena de instruções
        const instrText = this.add.text(400, 440, 'INSTRUÇÕES', { fontSize: '36px', fill: '#ffffff', backgroundColor: '#05668d', padding: { x: 16, y: 8 } }).setOrigin(0.5);
        instrText.setInteractive({ useHandCursor: true });
        instrText.on('pointerdown', () => {
            this.scene.start('Instructions');
        });
    }

    startGame() {
        // Inicia a cena principal do jogo
        this.scene.start('Start');
    }

}
