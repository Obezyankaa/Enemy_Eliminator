import { Player } from "./player.js"

//сылка на контекст для рисования в конвасе 
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

//размеры канваса на вс/ ширину 
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

//создаем нашего героя, распологаем его в центре экрана и передаем в контекст для отрисовки персонажа 
let player = new Player(canvas.width / 2, canvas.height / 2, context);

animate();

// функция отрисовки анимации 
function animate() {
    // запускает перерисовку на следующим кадре 
  requestAnimationFrame(animate);

  // отрисовываем персонажа который создан в файле player.js
  player.drawImg();
}