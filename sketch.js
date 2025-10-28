// 粒子系統
let particles = [];
let profileX, profileY;
let profileSize = 200;
let rotation = 0;
let targetRotation = 0;

function setup() {
  // 創建全螢幕畫布
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  
  // 初始化粒子
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
  
  // 設定個人照片位置（在卡片上方）
  profileX = width / 2;
  profileY = 150;
}

function draw() {
  // 漸層背景
  drawGradientBackground();
  
  // 更新和顯示粒子
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    
    // 移除死亡粒子
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
  
  // 繪製個人照片圓形
  drawProfilePhoto();
  
  // 滑鼠互動粒子
  if (frameCount % 3 === 0 && particles.length < 100) {
    particles.push(new Particle(mouseX, mouseY));
  }
}

// 繪製漸層背景
function drawGradientBackground() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(102, 126, 234), color(118, 75, 162), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

// 繪製個人照片
function drawProfilePhoto() {
  push();
  translate(profileX, profileY);
  
  // 平滑旋轉動畫
  rotation = lerp(rotation, targetRotation, 0.1);
  rotate(radians(rotation));
  
  // 外圈光暈效果
  for (let i = 5; i > 0; i--) {
    noFill();
    stroke(255, 255, 255, 30);
    strokeWeight(2);
    circle(0, 0, profileSize + i * 10);
  }
  
  // 主要圓形
  fill(118, 75, 162);
  stroke(255);
  strokeWeight(5);
  circle(0, 0, profileSize);
  
  // 人像符號
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(100);
  text('👤', 0, 0);
  
  // 檢測滑鼠是否在照片上
  let d = dist(mouseX, mouseY, profileX, profileY);
  if (d < profileSize / 2) {
    cursor(HAND);
    // 滑鼠懸停時的發光效果
    noFill();
    stroke(255, 255, 255, 100);
    strokeWeight(3);
    circle(0, 0, profileSize + 10);
  } else {
    cursor(ARROW);
  }
  
  pop();
}

// 滑鼠點擊照片旋轉
function mousePressed() {
  let d = dist(mouseX, mouseY, profileX, profileY);
  if (d < profileSize / 2) {
    targetRotation += 360;
    // 產生爆炸效果
    createExplosion(profileX, profileY);
  }
}

// 創建爆炸效果
function createExplosion(x, y) {
  for (let i = 0; i < 20; i++) {
    let angle = random(TWO_PI);
    let speed = random(2, 5);
    let p = new Particle(x, y);
    p.vx = cos(angle) * speed;
    p.vy = sin(angle) * speed;
    p.size = random(5, 12);
    particles.push(p);
  }
}

// 粒子類別
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-1, 1);
    this.vy = random(-2, -0.5);
    this.alpha = 255;
    this.size = random(3, 8);
    this.lifespan = 255;
    this.color = color(255, 255, 255);
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.lifespan -= 2;
    
    // 受滑鼠影響
    let d = dist(this.x, this.y, mouseX, mouseY);
    if (d < 100) {
      let force = map(d, 0, 100, 0.5, 0);
      let angle = atan2(this.y - mouseY, this.x - mouseX);
      this.vx += cos(angle) * force;
      this.vy += sin(angle) * force;
    }
    
    // 邊界檢測
    if (this.x < 0 || this.x > width) {
      this.vx *= -0.5;
    }
    if (this.y < 0 || this.y > height) {
      this.vy *= -0.5;
    }
  }
  
  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.lifespan);
    circle(this.x, this.y, this.size);
  }
  
  isDead() {
    return this.lifespan < 0;
  }
}

// 視窗大小改變時重新調整畫布
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  profileX = width / 2;
  profileY = 150;
}

// 鍵盤互動：按空白鍵產生爆炸效果
function keyPressed() {
  if (key === ' ') {
    createExplosion(profileX, profileY);
  }
  
  // 按 R 鍵重置旋轉
  if (key === 'r' || key === 'R') {
    targetRotation = 0;
    rotation = 0;
  }
  
  // 按 C 鍵清除所有粒子
  if (key === 'c' || key === 'C') {
    particles = [];
  }
}

// 滑鼠移動時產生軌跡
function mouseMoved() {
  if (frameCount % 5 === 0 && particles.length < 150) {
    let p = new Particle(mouseX, mouseY);
    p.size = random(2, 5);
    particles.push(p);
  }
}

// 滑鼠拖曳時產生更多粒子
function mouseDragged() {
  for (let i = 0; i < 3; i++) {
    let p = new Particle(
      mouseX + random(-10, 10), 
      mouseY + random(-10, 10)
    );
    p.size = random(4, 8);
    // 隨機顏色
    p.color = color(
      random(200, 255),
      random(200, 255),
      random(200, 255)
    );
    particles.push(p);
  }
}