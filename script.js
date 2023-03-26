// ОПРЕДЕЛЯЕМ И ОТРИСОВЫВАЕМ ПОЛЕ
class Field {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.cells = [];
    this.create();
  }

  create() {
 // определяем ширину и высоту поля
    const fieldElement = document.querySelector('.field');
    fieldElement.style.width = `${this.width * 25}px`;
    fieldElement.style.height = `${this.height * 25}px`;
    
// отрисовываем "клеточки"
    for (let i = 0; i < this.width * this.height; i++) {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      
    this.cells.push(cellElement);
    fieldElement.appendChild(cellElement);
    }
  }
  
// очищаем поле
  clear() {
    this.cells.forEach(cell => cell.className = 'cell');
  }
  
// определяем координаты
  getCell(x, y) {
    return this.cells[y * this.width + x];
  }
}

// определяем змею
class Snake {
  constructor() {
    this.body = [{x: 10, y: 10},
                {x: 10, y: 11}];
    this.direction = {x: 1, y: 0};
    this.isAlive = true;
    
 // определяем поля счёта и рекорда
    this.score = 0;
    this.highScore = localStorage.getItem("highScore") || 0;
    document.querySelector('.high-score').textContent = `Рекорд: ${this.highScore}`;
  }
  
  move() {
    const head = this.getNextHead();
    if (this.isCollision(head)) {
      this.isAlive = false;
      isGameOn = false;
      return;
    }

    this.body.unshift(head);
    
// проверяем, не съели ли змея еду, если съела, увеличиваем счет на 1
    if (head.x === food.x && head.y === food.y) {
      this.score++;
// поверяем, не бьёт ли счёт рекорд, если бьёт, записываем новый   
      this.highScore = this.score >= this.highScore ? this.score : this.highScore;
// записываем рекорд в локальное хранилище
      localStorage.setItem("highScore", this.highScore);
      food.generate();
    } else {
      this.body.pop();
    }
  }
  
// перемещаем змейку, держим голову всегда впереди массива
  getNextHead() {
    const head = this.body[0];
    return {x: head.x + this.direction.x, y: head.y + this.direction.y};
  }
  
// проверяем, не врезаемся ли в стену или самих себя
  isCollision(point) {
    return (
      point.x < 0 || point.x >= field.width || point.y < 0 || point.y >= field.height ||
      this.body.some(cell => cell.x === point.x && cell.y === point.y)
    );
  }
  
// устанавливаем новое направление змеи, проверяем, что не развернёмся на 180 и не врежемся в хвост
  setDirection(direction) {
    if (direction.x !== -this.direction.x || direction.y !== -this.direction.y) {
      this.direction = direction;
    }
  }

// отрисовываем тело змейки
  draw() {
    this.body.forEach((cell, index) => {
      const element = field.getCell(cell.x, cell.y);
      if (index === 0) {
        element.classList.add('head');
      } else if (index === this.body.length - 1) {
        element.classList.add('tail');
      } else {
        element.classList.add('tail');
      }
    });
  }
  
// метод "перезагрузки" игры, стираем предыдущие данные и устанавливаем начальные
  reset() {
    this.body = [{x: 10, y: 10},
                {x: 10, y: 11}];
    this.direction = {x: 1, y: 0};
    this.isAlive = true;
    this.score = 0;
    this.highScore = localStorage.getItem("highScore") || 0;
    field.cells.forEach(cell => {
    cell.classList.remove('head', 'tail', 'food');
  });
    
    food.generate();
    food.draw();
    this.draw();
  }
}

// определяем еду
class Food {
  constructor() {
    this.generate();
  }
  
// генерируем рандомную ячейку появления еды
  generate() {
      do {
      this.x = Math.floor(Math.random() * field.width);
      this.y = Math.floor(Math.random() * field.height);
    } while (snake.body.some(cell => cell.x === this.x && cell.y === this.y)); // проверяем, не занята ли клетка змеёй, цикл идёт, пока не найдётся свободная клетка
  }
  
// помещаем еду в сгенерированную ячейку
  draw() {
// добавляю проверку на существование свойства cells в поле field, так как похоже, еда генирировалась за пределами поля(??)
    if (field.cells) {
    const element = field.getCell(this.x, this.y);
    element.classList.add('food');
    }
  }
}

// создаём поле, змею, еду
const field = new Field(20, 20);
const snake = new Snake();
let food = new Food();
let isGameOn = false;

// пишем функцию начала игры
function initGame() {
    if (!snake.isAlive) {
      alert(`Игра окончена! Ваш счет: ${snake.score}. Рекорд: ${snake.highScore}`);
      snake.reset();
      return;
    }

    field.clear();
    snake.draw();
    food.draw();
    snake.move();
    document.querySelector('.score').textContent = `Счет: ${snake.score}`;
    document.querySelector('.high-score').textContent = `Рекорд: ${snake.highScore}`;
    
    setTimeout(initGame, 100);
}

// прописываем логику движения змеи по полю,  управление на стрелочки и WASD 
document.addEventListener('keydown', event => {
  switch (event.code) {
    case 'KeyW':
    case 'ArrowUp':
    snake.setDirection({x: 0, y: -1});
  break;
    case 'KeyS':
    case 'ArrowDown':
    snake.setDirection({x: 0, y: 1});
  break;
    case 'KeyA':
    case 'ArrowLeft':
    snake.setDirection({x: -1, y: 0});
  break;
    case 'KeyD':
    case 'ArrowRight':
    snake.setDirection({x: 1, y: 0});
  break;
  }
});

// вешаем обработчик на поле для начала игры по клику мышки
document.querySelector('.field').addEventListener('click', function() {
  if (!isGameOn) {
  initGame();
  isGameOn = true;
  }
});