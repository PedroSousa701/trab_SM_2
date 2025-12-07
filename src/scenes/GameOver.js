export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        // data should contain { time: seconds, score: number }
        this.survived = data.time || 0;
        this.score = data.score || 0;
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');

        this.add.text(400, 140, 'Game Over', { fontSize: '64px', fill: '#ff4d4d' }).setOrigin(0.5);

        this.add.text(400, 230, `Tempo: ${this.survived} s`, { fontSize: '28px', fill: '#ffffff' }).setOrigin(0.5);
        this.add.text(400, 270, `Pontuação: ${this.score}`, { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);

        const retry = this.add.text(400, 360, 'JOGAR NOVAMENTE', { fontSize: '36px', fill: '#ffd166', backgroundColor: '#073b4c', padding: { x: 20, y: 10 } }).setOrigin(0.5);
        retry.setInteractive({ useHandCursor: true });
        retry.on('pointerdown', () => {
            this.restartGame();
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.restartGame();
        });
    }

    restartGame() {
        // Reinicia a cena Start
        this.scene.start('Start');
    }
}
