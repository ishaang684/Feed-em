const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
const midScreenX = canvas.width / 2;
const midScreenY = canvas.height / 2;
playing = false

let sound = new Audio('Food Web Game/Jungle Web/collect_sound.wav');

let scoreChange = 0
let score = 0
let lives = 3

document.body.style.backgroundColor = 'limegreen';

let mouseX = mouseY = 0;
addEventListener('mousemove', function(event){
    mouseX = event.clientX;
    mouseY = event.clientY;
});

// method for loading in images
function newImage(src)
{
    var img = new Image();
    img.src = 'Food Web Game/Jungle Web/' + src;
    return img;
}

let playerImg
let foodImg
// let enemyImg
const cursorImg = newImage('cursor.png')
const backImg = new Image()
backImg.src = 'Food Web Game/Jungle Web/Jungle_Background.png'

const enemyImg = newImage('Boa_Constrictor.png')
const backWidth = 6000
const backHeight = 4000

var empty = new Image()
empty.src = 'Food Web Game/empty_heart.png'
var full = new Image()
full.src = 'Food Web Game/full_heart.png'

let biome = 1

const jungle1 = []
jungle1.push('Pistachios_Nuts.png');
jungle1.push('Berries.png')
jungle1.push('Plants.png')

const jungle2 = []
jungle2.push('Sloth.png')
jungle2.push('Macaw.png')
jungle2.push('Spider_Monkey.png')

const jungle3 = []
jungle3.push('Golden_Lion_Tamarin.png')
jungle3.push('Agouti.png')
jungle3.push('Tapir')

const jungle4 = []
jungle4.push('Jaguar.png')
jungle4.push('Boa_Constrictor.png')



class Player {
    static playerSpeed = 20;
    static dx = 0;
    static dy = 0;
    static animalSize = 96;

    constructor()
    {
        this.angle = 0;
        this.spriteWidth = 96;
        this.spriteHeight = 96;
        this.currentAnimal = ''

        this.rand1 = Math.floor(Math.random() * jungle2.length)
        this.rand2 = Math.floor(Math.random() * jungle3.length)
        this.rand3 = Math.floor(Math.random() * jungle4.length)
        playerImg = newImage(jungle2[this.rand1])

        switch(this.rand1)
        {
            case 0:
                this.currentAnimal = 'Sloth/Folivora/It takes sloths 30 days to digest a leaf'
                break
            case 1:
                this.currentAnimal = 'Blue and Yellow Macaw/Ara Ararauna/They can go up to 24km/h'
                break
            case 2:
                this.currentAnimal = 'Spider Monkey/Ateles/There are 7 species that are classified as Spider Monkey'
        } 
    }
    update()
    {
        Player.dx = midScreenX - mouseX;
        Player.dy = midScreenY - mouseY;
        let theta = Math.atan2(Player.dy, Player.dx);
        this.angle = theta - Math.PI /2;

        switch(biome)
        {
            case 1:
                if (290 < score && score < 600)
                {
                    switch(this.rand2)
                    {
                        case 0:
                            this.currentAnimal = 'Golden Lion Tamarin/Leontopitechus Rosalia/They can jump as high as 6 feet'
                            playerImg = newImage(jungle3[this.rand2])
                            break
                        case 1:
                            this.currentAnimal = 'Agouti/Dasyprocta/They are the only ones who can open a Brazil Nut'
                            playerImg = newImage(jungle3[this.rand2])
                            break
                        case 2:
                            this.currentAnimal = 'Tapir/Tapiridae/Their fossils date back to about 20 million years ago, and they have changed very little in that time'
                            playerImg = newImage(jungle3[this.rand2])
                            break

                    }
                }
                if (590 < score)
                {
                    switch(this.rand3)
                    {
                        case 0:
                            this.currentAnimal = 'Jaguar/Panthera onca/Jaguars have the strongest bite out of all cats, which is doubled the amount of a tiger'
                            playerImg = newImage(jungle4[this.rand3])
                            break
                        case 1:
                            this.currentAnimal = 'Boa_Constrictor/Boa Constrictor/They have more than 100 teeth'
                            playerImg = newImage(jungle4[this.rand3])
                            break
                    }
                }
        }
    }
    draw()
    {
        ctx.fillStyle = 'black';
        ctx.save();
        ctx.translate(midScreenX, midScreenY);
        ctx.rotate(this.angle);
        ctx.drawImage(playerImg, 0, 0, playerImg.width, playerImg.height, 0 - Player.animalSize, 0 - Player.animalSize, Player.animalSize * 2, Player.animalSize * 2); 
        ctx.restore();
    }
}

class Background
{
    static leftBound = canvas.width / 2 - Player.animalSize / 2
    static rightBound = canvas.width / 2 - backWidth + Player.animalSize / 2
    static upperBound  = canvas.height / 2 - Player.animalSize / 2
    static lowerBound = canvas.height / 2 - backHeight + Player.animalSize / 2

    // value - min / max - min
    xPercentDistance = 0
    yPercentDistance = 0

    constructor()
    {
        this.x = (canvas.width / 2 - backWidth) / 2;
        this.y = (canvas.height / 2 - backHeight) / 2;
    }
    update()
    {   
        Background.leftBound = canvas.width / 2 - Player.animalSize / 2
        Background.rightBound = canvas.width / 2 - backWidth + Player.animalSize / 2
        Background.upperBound  = canvas.height / 2 - Player.animalSize / 2
        Background.lowerBound = canvas.height / 2 - backHeight + Player.animalSize / 2

        this.x += Player.dx / (canvas.width / Player.playerSpeed);
        this.y += Player.dy / (canvas.height / Player.playerSpeed);

        if (this.x > Background.leftBound)
        {
            this.x = Background.leftBound
        }
        if (this.x < Background.rightBound)
        {
            this.x = Background.rightBound
        }
        if (this.y > Background.upperBound)
        {
            this.y = Background.upperBound
        }
        if (this.y < Background.lowerBound)
        {
            this.y = Background.lowerBound
        }
        
        this.xPercentDistance = 100 - (this.x - Background.rightBound) / (Background.leftBound - Background.rightBound) * 100
        this.yPercentDistance = 100 - (this.y - Background.lowerBound) / (Background.upperBound - Background.lowerBound) * 100
    }
    draw()
    {
        ctx.drawImage(backImg, this.x, this.y);
    }
}

class Food {
    static buffer = 60

    constructor()
    {
        // Math.random() * (max - min) + min;
        this.x = Math.random() * backWidth - Player.animalSize + Food.buffer
        this.y = Math.random() * backHeight - Player.animalSize + Food.buffer
        this.angle = Math.random() * 360

        this.rand1 = Math.floor(Math.random() * jungle1.length)
        this.rand2 = Math.floor(Math.random() * jungle2.length)
        this.rand3 = Math.floor(Math.random() * jungle3.length)
        this.foodImg = newImage(jungle1[this.rand1])
    }
    update()
    {
        if (Math.abs((background.x + this.x) - midScreenX + Player.animalSize / 2) < Player.animalSize && Math.abs((background.y + this.y) - midScreenY + Player.animalSize / 2) < Player.animalSize)
        {
            sound.load()
            this.x = Math.random() * backWidth - Player.animalSize + Food.buffer
            this.y = Math.random() * backHeight - Player.animalSize + Food.buffer
            score += 10
            scoreChange += 10
            sound.play()
        }

        if (290 < score && score < 600)
        {
            this.foodImg = newImage(jungle2[this.rand2])
        }
        if (590 < score)
        {
            this.foodImg = newImage(jungle3[this.rand3])
        }
    }
    draw()
    {
            ctx.drawImage(this.foodImg, background.x + this.x, background.y + this.y)
    }
}

class Enemy {
    static enemySpeed = 2

    xPercentDistance = 0
    yPercentDistance = 0

    constructor()
    {
        // Math.random() * (max - min) + min;
        this.x = Math.random() * backWidth - Player.animalSize
        this.y = Math.random() * backHeight - Player.animalSize
    }
    update()
    {

        if (Math.abs((background.x + this.x) - midScreenX + Player.animalSize / 2) < Player.animalSize / 1.5 && Math.abs((background.y + this.y) - midScreenY + Player.animalSize / 2) < Player.animalSize / 1.5)
        {
            this.x = Math.random() * backWidth - Player.animalSize
            this.y = Math.random() * backHeight - Player.animalSize
            lives --
            scoreChange = 0
        }

        this.xPercentDistance = (this.x - 0) / (backWidth - 0) * 100
        this.yPercentDistance = (this.y - 0) / (backHeight - 0) * 100

        if (background.xPercentDistance > this.xPercentDistance)
            this.x += Enemy.enemySpeed
        if (background.xPercentDistance < this.xPercentDistance)
            this.x -= Enemy.enemySpeed
        if (background.yPercentDistance > this.yPercentDistance)
            this.y += Enemy.enemySpeed
        if (background.yPercentDistance < this.yPercentDistance)
            this.y -= Enemy.enemySpeed

        if (this.x > backWidth - Player.animalSize)
            this.x = backWidth - Player.animalSize
        if (this.x < 0)
            this.x = 0
        if (this.y > backHeight - Player.animalSizei)
            this.y = backHeight - Player.animalSize
        if (this.y < 0)
            this.y = 0
    }
    draw()
    {
        ctx.drawImage(enemyImg, background.x + this.x, background.y + this.y, Player.animalSize * 2, Player.animalSize * 2  )
    }
}

const player = new Player;
const background = new Background;

const foods = []
const enemies = []
for(let i = 0; i < 50; i++)
{
    foods.push(new Food)
    if (i % 5 == 0)
    enemies.push(new Enemy)
}

// console.log(food.x + ', ' + food.y)

// const foods = []
// for (let i = 0; i < 10; i++)
// {
//     foods.push(new Food)
// }
// foods.forEach(food => {
//     console.log(food.x + ', ' + food.y);
// });

// animation loop
function animate(){
    playing = true
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    background.update();
    background.draw();

    foods.forEach(food => {
        food.update()
        food.draw()
    });

    enemies.forEach(enemy => {
        enemy.update()
        enemy.draw()
    });

    for(let i = 0; i < enemies.length; i++)
    {
        for(let j = 0; j < enemies.length; j++)
        {
            if (i == j)
                j++
            else
            {
            if (Math.abs(enemies[i].x - enemies[j].x) < Player.animalSize && Math.abs(enemies[i].y - enemies[j].y) < Player.animalSize)
            {
                enemies[i].x = Math.random() * backWidth - Player.animalSize
                enemies[i].y = Math.random() * backHeight - Player.animalSize
            }
            }
        }
    }

    heartSize = 80
    heartWidth = 50
    heartHeight = 120
    if (lives == 3)
    {
        for(let i = 0; i < 3; i++)
        {
            ctx.drawImage(full, i * heartSize*1.1 + 50, heartHeight, heartSize, heartSize)
        }
    }
    else if(lives == 2)
    {
        ctx.drawImage(full, 50, heartHeight, heartSize, heartSize)
        ctx.drawImage(full, heartSize * 1.1 + 50, heartHeight, heartSize, heartSize)
        ctx.drawImage(empty, 2 * heartSize * 1.1 + 50, heartHeight, heartSize, heartSize)
    }
    else if(lives == 1)
    {
        ctx.drawImage(full, 50, heartHeight, heartSize, heartSize)
        ctx.drawImage(empty, heartSize * 1.1 + 50, heartHeight, heartSize, heartSize)
        ctx.drawImage(empty, 2 * heartSize * 1.1 + 50, heartHeight, heartSize, heartSize)
    }

    ctx.font = '100px Serif'
    ctx.fillStyle = 'white'   
    ctx.fillText("Score: " + score, 30, 100)
    ctx.fillStyle = 'black'
    ctx.fillText("Score: " + score, 31, 101)

    if(scoreChange == 100 && lives != 3)
    {
        scoreChange = 0
        lives ++
    }

    info = player.currentAnimal.split('/')
    commonName = info[0]
    scientificName = info[1]
    funFact = info[2]

    ctx.font = '50px Serif'
    ctx.fillText(commonName, midScreenX - commonName.length * 10, 50)
    ctx.font = '40px Serif'
    ctx.fillText(scientificName, midScreenX - scientificName.length * 5, 90)
    ctx.font = '25px Serif'
    ctx.fillText(funFact, midScreenX - funFact.length * 5, 120)

    // ctx.font = '30px Serif'
    // ctx.fillText('Background pos: ' + Math.floor(background.x) + ', ' + Math.floor(background.y), 30, 70)
    // ctx.fillText('Canvas dimensions: ' + canvas.width + ', ' + canvas.height, 30, 110 )
    // ctx.fillText('Background percent: ' + background.xPercentDistance +', ' + background.yPercentDistance, 30, 150)

    // console.log('food: ' + food.x + ', ' + food.y)
    // console.log(background.x + ', ' + background.y)

    // ctx.font = '30px Serif'
    // ctx.fillText((background.x + food.x) + ', ' + (background.y + food.y), 30, 30)
    // ctx.fillText(background.x + ', ' + background.y, 30, 70)

    // console.log(Background.leftBound)
    // console.log(Background.rightBound)
    // console.log(Background.upperBound)
    // console.log(Background.lowerBound)
    // console.log(dx + '\n' + dy)
    // console.log('background \nx: ' + x + '\ny: ' + y)
    // console.log('screen width: ' + canvas.width)
    // console.log('screen height  : ' + canvas.height)
    // console.log('backgroundimg width: ' + backgroundImg.width)
    // console.log('backhroundimg height: ' + backgroundImg.height)  

    // player stuff
    player.update();
    player.draw();

    ctx.drawImage(cursorImg, mouseX, mouseY, 70, 70)

    if (lives == 0)
    {
        ctx.fillStyle = 'red'
        ctx.font = '200px SamSun'
        ctx.fillText('GAME OVER', canvas.width / 2 - 600, canvas.height / 2)
        ctx.font = '50px SamSun'
        ctx.fillText('Press any key to play again', canvas.width / 2 - 300, canvas.height / 2 + 100)
        playing = false
    }

    if (playing)
    {
    requestAnimationFrame(animate);
    }
}


ctx.fillStyle = 'white'
ctx.font = '100px SamSun';
ctx.fillText('PRESS ANY KEY TO START', canvas.width / 2 - 600, canvas.height / 2)


window.addEventListener('keypress', (event) =>
{
    if (!playing)
    {
    lives = 3
    score = 0
    scoreChange = 0
    background.x = (canvas.width / 2 - backWidth) / 2;
    background.y = (canvas.height / 2 - backHeight) / 2;
    animate()
    }
})


window.addEventListener('resize', function(){
  canvasPosition = canvas.getBoundingClientRect();
  mouseX = canvas.width / 2;
  mouseY = canvas.height / 2;
});
