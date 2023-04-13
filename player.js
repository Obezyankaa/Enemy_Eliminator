export class Player {
  constructor(x, y, context) {
    this.x = x;
    this.y = y;
    this.context = context;
    this.cursorPosition = {
      x: 0,
      y: 0,
    };
    // слушатель курсора
    document.addEventListener("mousemove", (event) => {
      this.cursorPosition.x = event.clientX;
      this.cursorPosition.y = event.clientY;
    });

    // создаем экземпляр персонажа
    this.image = new Image();
    this.image.src = "./img/player.png";
    this.imageWidth = 50;
    this.imageHeight = 60;
  }

  drawImg() {
    // добавляем картинку в CANVAS в неподвижном состоянии спомощью встройного метода drawImg();
    this.context.drawImage(
      this.image,
      0,
      0,
      this.imageWidth,
      this.imageHeight,
      this.x - this.imageWidth / 2,
      this.y - this.imageHeight / 2,
      this.imageWidth,
      this.imageHeight
    );
  }
  // этот метод рисует нам картинку таким образом, что наш герой всегда всмотрит на курсор мышы
  // будем менять канвас, перерисовывать картинку каждый раз, и возвращаться в исходное состоявие
    draw() {
      // сохраняем контекст, чтоб вернуться к нему после

      this.context.save();
      let angle = Math.atan2(
        this.cursorPosition.y - this.y,
        this.cursorPosition.x - this.x
      );
      this.context.translate(this.x, this.y);
      this.context.rotate(angle + Math.PI / 2);
      this.context.translate(-this.x, -this.y);
      this.drawImg();
      this.context.restore();
    }
}