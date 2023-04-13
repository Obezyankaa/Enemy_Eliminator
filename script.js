import { Player } from "./player.js"

//сылка на контекст для рисования в конвасе 
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

//размеры канваса на вс/ ширину 
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

let player

startGame();

function startGame() {
  init();
  animate();
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
}

// функция отрисовки анимации 
function animate() {
    // запускает перерисовку на следующим кадре 
  requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);

  // отрисовываем персонажа который создан в файле player.js
  player.update();
}