export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('fundo', 'assets/sky.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.spritesheet('heroi', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
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
        
    }

    update() {
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
        }
    }
    
}
