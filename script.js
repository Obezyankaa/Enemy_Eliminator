import { Player } from "./player.js"
import { Projectile } from "./projectile.js";
import { Enemy } from "./enemy.js";

//сылка на контекст для рисования в конвасе 
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

//размеры канваса на вс/ ширину 
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

let player;
let projectiles = [];
let enemies = [];

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
  enemies.push(new Enemy(canvas.width, canvas.height, context, player)); 
}

// функция отрисовки анимации 
function animate() {
    // запускает перерисовку на следующим кадре 
  requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);

  projectiles = projectiles.filter(projectileInsideWindow);

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