export class Player extends Phaser.Physics.Arcade.Sprite {

    static animationsCreated = false;

    constructor(scene, x = 100, y = 450, texture = 'heroi') {
        super(scene, x, y, texture);
        this.scene = scene;

        // Adiciona o jogador à cena e ativa física Arcade
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configurações iniciais do jogador
        // impede sair dos limites do mundo
        this.setCollideWorldBounds(true);
        this.setBounce(0.2);
        // desenhar acima de outros objetos
        this.setDepth(5);

        // entradas
        this.cursors = scene.input.keyboard.createCursorKeys();

        // Criar animações apenas uma vez
        if (!Player.animationsCreated) {
            scene.anims.create({
                key: 'left',
                frames: scene.anims.generateFrameNumbers('heroi', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });

            scene.anims.create({
                key: 'right',
                frames: scene.anims.generateFrameNumbers('heroi', { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
            
            scene.anims.create({
                key: 'turn',
                frames: [ { key: 'heroi', frame: 4 } ],
                frameRate: 10,
                repeat: 20
            });

            Player.animationsCreated = true;
        }
    }

    // Movimento e animações
    update() {
        if (this.cursors.left.isDown) {
            this.setVelocityX(-160);
            this.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(160);
            this.anims.play('right', true);
        } else {
            this.setVelocityX(0);
            this.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.body.touching.down) {
            this.setVelocityY(-350);
            // tocar som de salto 
            if (this.scene && this.scene.sound) {
                this.scene.sound.play('salto');
            }
        }
    }
}