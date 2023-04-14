import { Player } from "./player.js"
import { Projectile } from "./projectile.js";
import { Enemy } from "./enemy.js";
import { distanceBetweenTwoPoints } from "./utilities.js";

//сылка на контекст для рисования в конвасе 
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

//размеры канваса на вс/ ширину 
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

const wastedElement = document.querySelector(".wasted");
const scoreElement = document.querySelector("#score");

let player;
let projectiles = [];
let enemies = [];
let particles = [];
let score = 0;
let animateId;
let spawnIntervalId;
let countIntervalId;

startGame();

function startGame() {
  init();
  animate();
  //функция врагов
  spawnEnemies();
}

function init() {
  const movementLimits = {
    minX: 0,
    maxX: canvas.width,
    minY: 0,
    maxY: canvas.height,
  }
  //создаем нашего героя, распологаем его в центре экрана и передаем в контекст для отрисовки персонажа 
  player = new Player(
    canvas.width / 2,
    canvas.height / 2,
    context,
    movementLimits
  );
  addEventListener("click", createProjectile)
}

function createProjectile(event) {
  projectiles.push(
    new Projectile(
      player.x,
      player.y,
      event.clientX,
      event.clientY,
      context
    )
  )
}

function spawnEnemies() {
  let countOfSpawnEnemis = 1;
  // каждые 30 секунд появляются больше и больше врагов
  countIntervalId = setInterval(() => countOfSpawnEnemis++, 40000);
  // враги появляются каждую секунду 
  spawnIntervalId = setInterval(() => spawnCountEnemies(countOfSpawnEnemis), 1000);
  spawnCountEnemies(countOfSpawnEnemis);
}

// накидывает всё больше и больше врагов 
function spawnCountEnemies(count) {
  for (let i = 0; i < count; i++) {
      enemies.push(new Enemy(canvas.width, canvas.height, context, player));
  }
}

// функция отрисовки анимации 
function animate() {
    // запускает перерисовку на следующим кадре 
  animateId = requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);

  // удаляет прозрачные частицы крови 
  particles = particles.filter((particle) => particle.alpha > 0);
  projectiles = projectiles.filter(projectileInsideWindow);
  enemies.forEach((enemy) => checkHittingEnemy(enemy));
  enemies = enemies.filter((enemy) => enemy.health > 0);

  // если нас коснулся враг, мы останавливаем игру 
  const isGameOver = enemies.some(checkHittingPlayer);
  if (isGameOver) {
    wastedElement.style.display = "block";
      // после окончания игры новые враги не появляются на карте 
      clearInterval(countIntervalId);
      clearInterval(spawnIntervalId);
      cancelAnimationFrame(animateId);
    }

    
    
  //запускает эффект крови 
  particles.forEach((particle) => particle.update());
  // пускает сняряды 
  projectiles.forEach((projectile) => projectile.update());
  // отрисовываем персонажа который создан в файле player.js
  player.update();
  enemies.forEach((enemies) => enemies.update());
}

function projectileInsideWindow(projectile) {
  return (
    projectile.x + projectile.radius > 0 &&
    projectile.x - projectile.radius < canvas.width &&
    projectile.y + projectile.radius > 0 &&
    projectile.y - projectile.radius < canvas.height
  );
}

function checkHittingPlayer(enemy) {
  const distance = distanceBetweenTwoPoints(player.x, player.y, enemy.x, enemy.y);
  return distance - enemy.radius - player.radius < 0;
}

function checkHittingEnemy(enemy) {
  projectiles.some((projectile, index) => {
    const distance = distanceBetweenTwoPoints(
      projectile.x,
      projectile.y,
      enemy.x,
      enemy.y
    );
    if (distance - enemy.radius - projectile.radius > 0) return false;

    removeProjectileByIndex(index);
    enemy.health--;

    if (enemy.health < 1) {
      // увеличиваем очки 
      iscreaseScroll();
      // уберает убитого врага 
      enemy.createExplosion(particles);
    }

    return true;
  });
}

// она 
function removeProjectileByIndex(index) {
  projectiles.splice(index, 1);
}

function iscreaseScroll() {
  score += 250;
  scoreElement.innerHTML = score;
}
