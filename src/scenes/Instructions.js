export class Instructions extends Phaser.Scene {

    constructor() {
        super('Instructions');
    }

    create() {
        this.cameras.main.setBackgroundColor('#0f1724');

        this.add.text(400, 80, 'INSTRUÇÕES', { fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5);

         // Lista de instruções a mostrar ao jogador
        const lines = [
            'Movimentação: use as setas para mover o jogador para os lados e saltar',
            'Escudo: clique na tecla T, depois de apanhar 10 caixas',
            'Objetivo: apanhar caixas para ganhar pontos e sobreviver',
        ];

        // adicionar as linhas de instrução
        for (let i = 0; i < lines.length; i++) {
            this.add.text(400, 160 + i * 48, lines[i], { fontSize: '18px', fill: '#e6eef8' }).setOrigin(0.5);
        }

        // Botão voltar
        const back = this.add.text(400, 420, 'VOLTAR', { fontSize: '36px', fill: '#ffffff', backgroundColor: '#6a8caf', padding: { x: 16, y: 8 } }).setOrigin(0.5);
        back.setInteractive({ useHandCursor: true });
        back.on('pointerdown', () => {
            this.scene.start('StartMenu');
        });

        // Também permitir voltar com ESC ou ENTER
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('StartMenu');
        });
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('StartMenu');
        });
    }

}
