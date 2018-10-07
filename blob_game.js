let config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 640,
    height: 640,
    parent: 'gamecontainer',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
},
music_config = {
    mute: false,
    volume: 0.8,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0
};

const game = new Phaser.Game(config);
const level = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 8, 8, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [3, 3, 3, 3, 3, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 3, 3, 3, 3, 3],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 0, 1, 9, 9, 1, 0, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
let gameOver = false,
invincible = false,
player,
rises,
blobs,
gems,
cursors,
worldMap,
music,
timer,
timerInterval,
invincibleTimer,
createSkeletons,
maxSkeletons = 50,
finalTime = 0;

function preload() {
    this.load.spritesheet('blob_death', 'public/images/blob_death_grayscale.png', { frameWidth: 80, frameHeight: 80 });
    this.load.spritesheet('blob_child', 'public/images/blob_child_grayscale.png', { frameWidth: 26, frameHeight: 32 });
    this.load.spritesheet('blob', 'public/images/blob_up_down_yellow.png', { frameWidth: 34, frameHeight: 34 });
    this.load.spritesheet('blob_left', 'public/images/blob_walk_left_yellow.png', { frameWidth: 34, frameHeight: 34 });
    this.load.spritesheet('blob_right', 'public/images/blob_walk_right_yellow.png', { frameWidth: 34, frameHeight: 34 });
    this.load.spritesheet('gem', 'public/images/gem.png', { frameWidth: 20, frameHeight: 30 });
    this.load.spritesheet('skeleton', 'public/images/skeleton_sprite_sheet.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('skeleton_rise', 'public/images/skeleton_rise.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('tiles', 'public/images/tileset.png');
    this.load.tilemapTiledJSON('map', 'public/images/blobmap.json');
    this.load.audio('victory', 'public/audio/victory.wav');
    this.load.audio('death', 'public/audio/death.wav');
    this.load.audio('pop', 'public/audio/pop.wav');
    this.load.audio('gem_on', 'public/audio/gem_on.wav');
    this.load.audio('gem_off', 'public/audio/gem_off.wav');
    this.load.audio('teleport', 'public/audio/teleport.wav');
    this.load.audio('rise', 'public/audio/rise.wav');
    this.load.audio('skeleton_death', 'public/audio/skeleton_death.wav');
    this.load.audio('game_track', 'public/audio/game_track.mp3');
}

function create() {
    music = this.sound.add('game_track', music_config);
    music.play();
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileset', 'tiles');
    const worldLayer = map.createStaticLayer('World', tileset, 0, 0);
    worldMap = worldLayer;
    
    worldLayer.setCollisionBetween(1, 213, true, 'World');
    worldLayer.setCollisionBetween(215, 270, true, 'World');
    worldLayer.setCollisionBetween(272, 407, true, 'World');
    worldLayer.setCollisionBetween(409, 512, true, 'World');
    
    blobs = this.physics.add.group();
    gems = this.physics.add.group();
    skeletons = this.physics.add.group();
    rises = this.physics.add.group();
    cursors = this.input.keyboard.createCursorKeys();
    
    for (let i = 0; i < level.length; i++) {
        for (let j = 0; j < level.length; j++) {
            if ( (level[i][j] === 1) || (level[i][j] === 8) )  {
                let col = Phaser.Display.Color.RandomRGB(0,255),
                randomColor = `0x${rgbToHex(col.r, col.g, col.b)}`;
                blobs.create((j * 32) + 16, (i * 32) + 16, 'blob_child').setTint(randomColor).setScale(0.75);
            }
            if (level[i][j] === 2) {
                gems.create((j * 32) + 16, (i * 32) + 16, 'gem').setScale(0.8);
            }
        }
    }
    let rise_sound = this.sound.add('rise', { volume: 3 });
    createSkeletons = setInterval(function() {
        if (skeletons.countActive(true) < maxSkeletons) {
            let rise = rises.create(320, 352, 'skeleton_rise');
            if (invincible) {
                rise.setTint(0x00DDFF)
            }
            rise.displayHeight = 32;
            rise.displayWidth = 21.333333;
            rise.anims.play('skeleton_rise');
            rise_sound.play();
            rise.on('animationcomplete', function() {
                rise.disableBody(true, true);
                let skeleton = skeletons.create(320, 352, 'skeleton');
                skeleton.displayHeight = 32;
                skeleton.displayWidth = 21.333333;
            });
        }
    }, 1000); //// risetime

    player = this.physics.add.sprite(320, 496, 'blob').setSize(32, 32);

    this.physics.add.collider(player, worldLayer);
    this.physics.add.collider(skeletons, worldLayer);

    this.physics.add.overlap(player, blobs, collectBlobs, null, this);
    this.physics.add.overlap(player, gems, collectGems, null, this);
    this.physics.add.overlap(player, skeletons, contactSkeletons, null, this);
    
    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // worldLayer.renderDebug(debugGraphics, {
    //     tileColor: 0xffff00, // Color of non-colliding tiles
    //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('blob_child', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'spin',
        frames: this.anims.generateFrameNumbers('gem', { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1
    });
    this.anims.create({
        key: 'collect',
        frames: this.anims.generateFrameNumbers('blob_death', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: 0
    })
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('blob_left', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('blob_right', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('blob', { start: 1, end: 6 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'blob', frame: 0 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'skeleton_down',
        frames: this.anims.generateFrameNumbers('skeleton', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'skeleton_up',
        frames: this.anims.generateFrameNumbers('skeleton', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'skeleton_right',
        frames: this.anims.generateFrameNumbers('skeleton', { start: 8, end: 11 }),
        flipX: false,
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'skeleton_left',
        frames: this.anims.generateFrameNumbers('skeleton', { start: 8, end: 11 }),
        flipX: true,
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'skeleton_rise',
        frames: this.anims.generateFrameNumbers('skeleton_rise', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: 0
    })
    this.anims.create({
        key: 'skeleton_turn',
        frames: [ { key: 'skeleton', frame: 1 } ],
        frameRate: 20
    });
    
    gems.playAnimation('spin',true);
    // plays half blob_child animations then starts the other half when first half is halfway through the anims
    for (let [i, blob] of blobs.children.entries.entries()) {
        if (i % 2 == 1) {
            blob.anims.play('idle', true);
        } else {
            setTimeout( () => {
                blob.anims.play('idle', true);
            }, 400);
        }
    }

    timer = this.add.text(320, 16, '0:00', {fontSize: '24px', fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 4}).setOrigin(0.5);
    let timer_sec = 1,
    timer_min = 0;
    gameTimer = setInterval(function gameTimer() {
        if (timer_sec < 10) {
            timer.setText(`${timer_min}:0${timer_sec}`);
        } else {
            timer.setText(`${timer_min}:${timer_sec}`);
        }
        finalTime = (timer_min * 60) + timer_sec;
        timer_sec++;
        if (timer_sec === 60) {
            timer_sec = 0;
            timer_min++;
        }
    }, 1000);
}

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function collectBlobs(player, blob) {
    blob.on('animationstart', function() {
        this.sound.play('pop');
    }.bind(this));
    blob.anims.play('collect', true);
    blob.on('animationcomplete', function() {
        blob.disableBody(true, false);
    });    
}

function contactSkeletons(player, skeleton) {
    if (invincible) {
        this.sound.play('skeleton_death')
        skeleton.disableBody(true, true);
    } else {
        this.sound.play('death')
        for (let blob of blobs.getChildren()) {
            if (blob.active) {
                blob.anims.play('collect');
            }
        }
        this.add.text(320, 240, 'You Lost In', {fontSize: '42px', fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 6}).setOrigin(0.5);
        this.add.text(320, 320, `${finalTime} Seconds`, {fontSize: '88px', fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 8}).setOrigin(0.5);
        gameOver = true;
    }
}

// Collect gems in corners to turn invincible for setTimeout amount of time
function collectGems(player, gem) {
    this.sound.play('gem_on')
    invincible = true;
    gem.disableBody(true, true);
    player.setTint(0xFF00FF);
    clearTimeout(invincibleTimer);
    invincibleTimer = setTimeout( () => {
        this.sound.play('gem_off')
        player.clearTint();
        invincible = false;
    }, 6000);
}

// If tile next to sprite can be walked on the sprite will be aligned with it
function turnLeft(sprite) {
    let i = Math.floor(sprite.x/32);
    let j = Math.floor(sprite.y/32);
    if (level[j][i - 1] != 0) {
        player.y = (j * 32) + 16;
    };
}
function turnRight(sprite) {
    let i = Math.floor(sprite.x/32);
    let j = Math.floor(sprite.y/32);
    if (level[j][i + 1] != 0) {
        player.y = (j * 32) + 16;
    };
}
function turnUp(sprite) {
    let i = Math.floor(sprite.x/32);
    let j = Math.floor(sprite.y/32);
    if (level[j - 1][i] != 0) {
        player.x = (i * 32) + 16;
    };
}
function turnDown(sprite) {
    let i = Math.floor(sprite.x/32);
    let j = Math.floor(sprite.y/32);
    if (level[j + 1][i] != 0) {
        player.x = (i * 32) + 16;
    };
}

// Finds the tile underneath and the tiles around the skeleton as well as getting the alignment coordinates
// Gives an id for the skeleton name to ensure the skeleton makes the decision to turn once and won't run again until a new intersection
function findTiles(skeleton) {
    let i = Math.floor(skeleton.x/32);
    let j = Math.floor(skeleton.y/32);
    return [
        level[j - 1][i], // [0] Tile UP
        level[j][i + 1], // [1] Tile RIGHT
        level[j + 1][i], // [2] Tile DOWN
        level[j][i - 1], // [3] Tile LEFT
        ((i * 32) + 16), // [4] Align X
        ((j * 32) + 16), // [5] Align Y
        level[j][i],     // [6] Current Tile
        i * j]           // [7] Unique Tile Id
}

function update() {
    if (gameOver) {
        music.stop();
        clearInterval(gameTimer);
        clearInterval(createSkeletons);
        this.physics.pause();
        skeletons.playAnimation('skeleton_turn');
        player.anims.play('turn');
        return;
    }

    if (blobs.countActive(true) === 0) {
        this.sound.play('victory');
        console.log(finalTime);
        this.add.text(320, 240, 'You Collected All Blobs In', {fontSize: '42px', fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 6}).setOrigin(0.5);
        this.add.text(320, 320, `${finalTime} Seconds`, {fontSize: '88px', fill: '#00FF2D', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 8}).setOrigin(0.5);
        gameOver = true;
    }
    
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.setVelocityY(0);
        player.anims.play('left', true);
        turnLeft(player);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.setVelocityY(0);
        turnRight(player);
        player.anims.play('right', true);
    } else if (cursors.up.isDown) {
        player.setVelocityY(-160);
        player.setVelocityX(0);
        turnUp(player);
        player.anims.play('up', true);
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
        player.setVelocityX(0);
        turnDown(player);
        player.anims.play('up', true);
    } else {
        player.setVelocity(0);
        player.anims.play('turn');
    }

    if (player.x < 0) {
        this.sound.play('teleport');
        player.setX(639).setY(336);
    } else if (player.x > 639) {
        this.sound.play('teleport');
        player.setX(0).setY(336);
    }

    for (let skeleton of skeletons.getChildren()) {
        if ( (skeleton.body.velocity.x === 0) && (skeleton.body.velocity.y === 0) ) {
            setTimeout(function() {
                skeleton.setVelocityY(-60);
            }, 500);
        }

        if (invincible) {
            skeleton.setTint(0x00DDFF);
        } else {
            skeleton.clearTint();
        }

        if (skeleton.body.velocity.x < 0) {
            skeleton.anims.play('skeleton_left', true);
            skeleton.flipX = true;
        } else if (skeleton.body.velocity.x > 0) {
            skeleton.anims.play('skeleton_right', true);
            skeleton.flipX = false;
        } else if (skeleton.body.velocity.y > 0) {
            skeleton.anims.play('skeleton_down', true);
        } else if (skeleton.body.velocity.y < 0) {
            skeleton.anims.play('skeleton_up', true);
        } else {
            skeleton.anims.play('skeleton_turn');
        }

        if (skeleton.x < 0) {
            skeleton.setX(639).setY(336);
        } else if (skeleton.x > 639) {
            skeleton.setX(0).setY(336);
        }

        let tiles = findTiles(skeleton);
        if (tiles[6] != 0) {
            let rand_two = Phaser.Math.Between(1,2),
            rand_three = Phaser.Math.Between(1,3),
            rand_four = Phaser.Math.Between(1,4),
            skeletonTileX = Math.abs(tiles[4] - skeleton.x),
            skeletonTileY = Math.abs(tiles[5] - skeleton.y);

            // Skeleton chooses to go left or right after rising from the crypt
            if ( (tiles[6] === 8) && (skeleton.name === '') && (skeletonTileY < 1) ) {
                if (rand_two === 1) {
                    skeleton.setVelocity(-130, 0);
                } else {
                    skeleton.setVelocity(130, 0);
                }
                skeleton.name = tiles[7];
            }

            // Skeleton chooses a random direction at each intersection
            if ( (skeleton.name != tiles[7]) && (skeletonTileX < 3) && (skeletonTileY < 3) ) {
                if ( (tiles[0] != 0) && (tiles[1] != 0) && (tiles[2] != 0) && (tiles[3] != 0) ) {
                    // 4 way intersection
                    if (rand_four === 1) {
                        skeleton.setVelocity(-110, 0);
                    } else if (rand_four === 2) {
                        skeleton.setVelocity(110, 0);
                    } else if (rand_four === 3) {
                        skeleton.setVelocity(0, -110);
                    } else {
                        skeleton.setVelocity(0, 110)
                    }
                } else if ( (tiles[0] != 0) && (tiles[1] != 0) && (tiles[2] != 0) && (tiles[3] === 0) ) {
                    // 3 way Left is blocked
                    if (rand_three === 1) {
                        skeleton.setVelocity(110, 0);
                    } else if (rand_three === 2) {
                        skeleton.setVelocity(0, -110);
                    } else {
                        skeleton.setVelocity(0, 110);
                    }
                } else if ( (tiles[0] != 0) && (tiles[1] != 0) && (tiles[2] === 0) && (tiles[3] != 0) ) {
                    // 3 way Down is blocked
                    if (rand_three === 1) {
                        skeleton.setVelocity(-110, 0);
                    } else if (rand_three === 2) {
                        skeleton.setVelocity(110, 0);
                    } else {
                        skeleton.setVelocity(0, -110);
                    }
                } else if ( (tiles[0] != 0) && (tiles[1] === 0) && (tiles[2] != 0) && (tiles[3] != 0) ) {
                    // 3 way Right is blocked
                    if (rand_three === 1) {
                        skeleton.setVelocity(-110, 0);
                    } else if (rand_three === 2) {
                        skeleton.setVelocity(0, -110);
                    } else {
                        skeleton.setVelocity(0, 110);
                    }
                } else if ( (tiles[0] === 0) && (tiles[1] != 0) && (tiles[2] != 0) && (tiles[3] != 0) ) {
                    // 3 way Up is blocked
                    if (rand_three === 1) {
                        skeleton.setVelocity(-110, 0);
                    } else if (rand_three === 2) {
                        skeleton.setVelocity(110, 0);
                    } else {
                        skeleton.setVelocity(0, 110);
                    }
                } else if ( (tiles[0] === 0) && (tiles[1] === 0) && (tiles[2] != 0) && (tiles[3] != 0) ) {
                    // 2 way Up & Right is blocked
                    if (rand_two === 1) {
                        skeleton.setVelocity(-110, 0);
                    } else {
                        skeleton.setVelocity(0, 110);
                    }
                } else if ( (tiles[0] != 0) && (tiles[1] === 0) && (tiles[2] === 0) && (tiles[3] != 0) ) {
                    // 2 way Right & Down is blocked
                    if (rand_two === 1) {
                        skeleton.setVelocity(-110, 0);
                    } else {
                        skeleton.setVelocity(0, -110);
                    }
                } else if ( (tiles[0] != 0) && (tiles[1] != 0) && (tiles[2] === 0) && (tiles[3] === 0) ) {
                    // 2 way Down & Left is blocked
                    if (rand_two === 1) {
                        skeleton.setVelocity(110, 0);
                    } else {
                        skeleton.setVelocity(0, -110);
                    }
                } else if ( (tiles[0] === 0) && (tiles[1] != 0) && (tiles[2] != 0) && (tiles[3] === 0) ) {
                    // 2 way Left & Up is blocked
                    if (rand_two === 1) {
                        skeleton.setVelocity(110, 0);
                    } else {
                        skeleton.setVelocity(0, 110);
                    }
                }

                if (skeleton.body.velocity.x != 0) {
                    skeleton.y = tiles[5];
                } else if (skeleton.body.velocity.y != 0) {
                    skeleton.x = tiles[4];
                } else {
                    skeleton.disableBody(true, true);
                    console.log("skeleton not moving // removed")
                }

                skeleton.name = tiles[7];
            }
        }
    }
}
