const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Cargar imágenes
const playerImage = new Image();
playerImage.src = 'imgs/joaco.jpeg';

const bulletImage = new Image();
bulletImage.src = 'imgs/corazón-caro.png';

const enemyImage = new Image();
enemyImage.src = 'imgs/mi-amor.jpeg';

// Configuración inicial del jugador
const player = {
    width: 60,
    height: 60,
    x: canvas.width / 2 - 30,
    y: canvas.height - 70,
    speed: 15,
    moveLeft: false,
    moveRight: false
};

// Balas
const bullets = [];
const bulletSpeed = 10;

// Enemigos
const enemies = [];
const enemySpeed = 2;

// Función para dibujar al jugador
function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

// Función para dibujar las balas
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.drawImage(bulletImage, bullet.x, bullet.y, 50, 50);
        bullet.y -= bulletSpeed; // Mover la bala hacia arriba

        // Eliminar la bala si sale del canvas
        if (bullet.y < -50) {
            bullets.splice(bullets.indexOf(bullet), 1);
        }
    });
}

// Función para dibujar los enemigos
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, 60, 60);
        enemy.y += enemySpeed; // Mover el enemigo hacia abajo

        // Eliminar el enemigo si sale del canvas
        if (enemy.y > canvas.height) {
            enemies.splice(enemies.indexOf(enemy), 1);
        }
    });
}

// Generar enemigos aleatoriamente
function generateEnemies() {
    if (Math.random() < 0.05) {
        const x = Math.random() * (canvas.width - 60);
        enemies.push({ x: x, y: -60 });
    }
}

// Detectar colisiones
function detectCollisions() {
    bullets.forEach(bullet => {
        enemies.forEach(enemy => {
            if (
                bullet.x < enemy.x + 60 &&
                bullet.x + 50 > enemy.x &&
                bullet.y < enemy.y + 60 &&
                bullet.y + 50 > enemy.y
            ) {
                // Colisión detectada, eliminar bala y enemigo
                enemies.splice(enemies.indexOf(enemy), 1);
                bullets.splice(bullets.indexOf(bullet), 1);
            }
        });
    });

    enemies.forEach(enemy => {
        if (
            player.x < enemy.x + 60 &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + 60 &&
            player.y + player.height > enemy.y
        ) {
            // Colisión entre jugador y enemigo (game over)
            alert('Game Over');
            document.location.reload();
        }
    });
}

// Control de teclas
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        player.moveLeft = true;
    } else if (event.key === 'ArrowRight') {
        player.moveRight = true;
    } else if (event.key === ' ') {
        // Disparar una bala
        bullets.push({ x: player.x + player.width / 2 - 25, y: player.y });
    }
});

document.addEventListener('keyup', event => {
    if (event.key === 'ArrowLeft') {
        player.moveLeft = false;
    } else if (event.key === 'ArrowRight') {
        player.moveRight = false;
    }
});

// Actualizar posición del jugador
function updatePlayer() {
    if (player.moveLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (player.moveRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}

// Bucle principal del juego
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar la pantalla

    drawPlayer();
    drawBullets();
    drawEnemies();
    generateEnemies();
    detectCollisions();
    updatePlayer();

    requestAnimationFrame(gameLoop); // Bucle del juego
}

gameLoop();
