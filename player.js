// клавиши 

const MOVE_UP_KEY_CODES = ["ArrowUp", "KeyW"];
const MOVE_DOWN_KEYS_CODES = ["ArrowDown", "KeyS"];
const MOVE_LEFT_KEYS_CODES = ["ArrowLeft", "KeyA"];
const MOVE_RIGHT_KEYS_CODES = ["ArrowRight", "KeyD"];
const ALL_MOVE_KEY_CODES = [
  ...MOVE_UP_KEY_CODES,
  ...MOVE_DOWN_KEYS_CODES,
  ...MOVE_LEFT_KEYS_CODES,
  ...MOVE_RIGHT_KEYS_CODES,
];

export class Player {
  constructor(x, y, context, movementLimits) {
    this.velocity = 3;
    this.radius = 15;
    // this.velocity = 3 ( скорость персонажа )
    this.x = x;
    this.y = y;
    this.context = context;
    this.cursorPosition = {
      x: 0,
      y: 0,
    };

    this.movementLimits = {
      minX: movementLimits.minX + this.radius,
      maxX: movementLimits.maxX - this.radius,
      minY: movementLimits.minY + this.radius,
      maxY: movementLimits.maxY - this.radius,
    };

    this.keyMap = new Map();
    // слушатель курсора
    document.addEventListener("mousemove", (event) => {
      this.cursorPosition.x = event.clientX;
      this.cursorPosition.y = event.clientY;
    });
    document.addEventListener("keydown", (event) =>
      this.keyMap.set(event.code, true)
    );
    document.addEventListener("keyup", (event) =>
      this.keyMap.delete(event.code)
    );

    // создаем экземпляр персонажа
    this.image = new Image();
    this.image.src = "./img/player.png";
    this.imageWidth = 50;
    this.imageHeight = 60;
    this.isMoving = false;
    this.imageTick = 0;
  }

  drawImg() {
    const imageTickLimit = 18;
    let subX = 0;
    if (!this.isMoving) {
      subX = 0;
      this.imageTick = 0;
    } else {
      subX =
        this.imageTick > imageTickLimit ? this.imageWidth * 2 : this.imageWidth;
      this.imageTick++;
    }
    if (this.imageTick > imageTickLimit * 2) {
      this.imageTick = 0;
    }

    // добавляем картинку в CANVAS в неподвижном состоянии спомощью встройного метода drawImg();
    this.context.drawImage(
      this.image,
      subX,
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
  // вэтот методе мы будем рисовать персонажа и дальше его новую позицию, тем самам нам будет казаться что он ходит по полю
  update() {
    this.draw();
    this.isMoving = this.shouldMove(ALL_MOVE_KEY_CODES);
    this.updatePosition();
    this.checkPositionLimitAndUpdate();
  }
  //меняет координаты героя
  updatePosition() {
    if (this.shouldMove(MOVE_UP_KEY_CODES)) this.y -= this.velocity;
    if (this.shouldMove(MOVE_DOWN_KEYS_CODES)) this.y += this.velocity;
    if (this.shouldMove(MOVE_LEFT_KEYS_CODES)) this.x -= this.velocity;
    if (this.shouldMove(MOVE_RIGHT_KEYS_CODES)) this.x += this.velocity;
  }

  checkPositionLimitAndUpdate() {
    if (this.y < this.movementLimits.minY) this.y = this.movementLimits.minY;
    if (this.y > this.movementLimits.maxY) this.y = this.movementLimits.maxY;
    if (this.x < this.movementLimits.minX) this.x = this.movementLimits.minX;
    if (this.x > this.movementLimits.maxX) this.x = this.movementLimits.maxX;
  }

  //обновляет позицию
  shouldMove(keys) {
    return keys.some((key) => this.keyMap.get(key));
  }
}