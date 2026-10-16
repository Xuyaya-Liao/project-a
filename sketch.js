let x = 0;
let y = 0;
let mouseSize = 15;
let pointSpeedx = 0;
let pointSpeedy = 0;
let pointUnderMouse = false; //光标是否在鼠标范围内
let r, g, b, alphaMouse;
let seedPoints = [];
let seedGrowSpeed;
let maxRadius;
let radius = 0;
let radiusSpeed = 0;
let startPointX, startPointY;
let a;
let backGroundPoints = [];
let sound1;

//拖拽相关变量：
let isSelecting = false;
let selectStartX, selectStartY;
let microscopeRegions = [];
let pointUnderMouseAtStart = false;

//菌丝相关变量
let growPoints = [];
let maxDepth = 6;
let growSpeed = 1;
let framesPerBranch = 20;
let spliteAngle = Math.PI / 4;
let growR = 0;
let growG = 0;
let growB = 0;
let growStartFrame;
let microscopeChanged = false;

async function setup() {
  createCanvas(800, 500);
  for (let i = 0; i < 200; i++) {
    backGroundPoints.push({ x: random(0, width), y: random(0, height) });
  }
  sound1 = await loadSound("853900__alexzavesa__water-drop-tap-4.wav");
}

function draw() {
  noCursor();
  background(250, 197, 30);
  push();
  fill("#2010fe");
  for (let p of backGroundPoints) {
    circle(p.x, p.y, 1.2);
  }
  pop();

  if (mouseIsPressed && radius == 0) {
    radiusSpeed = 0.1;
    seedPoints.push({
      x: mouseX,
      y: mouseY,
      radius: 0,
      growSpeed: random(0.06, 0.1),
      maxRadius: random(25, 110),
      color1: [random(200, 255), random(60, 120), random(70, 130)],
      color2: [random(220, 255), random(17, 57), random(200, 240)],
      color3: [random(0, 30), random(30, 70), random(220, 255)],
      color4: [random(120, 160), random(55, 95), random(170, 220)],
      color5: [random(220, 255), random(77, 97), random(0, 20)],
      color6: [random(230, 253), random(180, 210), random(64, 84)],
      color7: [random(150, 230), random(30, 70), random(210, 250)],
      a: random(0, 1),
    });
    startPointX = mouseX;
    startPointY = mouseY;
    for (let i = 0; i < 39; i++) {
      let x, y;
      x = random(0, width);
      y = random(0, height);
      seedPoints.push({
        x: x,
        y: y,
        radius: 0,
        growSpeed: random(0.06, 0.1),
        maxRadius: random(15, 145),
        color1: [random(200, 255), random(60, 120), random(70, 130)],
        color2: [random(220, 255), random(17, 57), random(200, 240)],
        color3: [random(0, 40), random(30, 70), random(200, 255)],
        color4: [random(110, 160), random(55, 95), random(170, 220)],
        color5: [random(220, 255), random(67, 97), random(0, 40)],
        color6: [random(220, 255), random(180, 220), random(44, 84)],
        color7: [random(150, 230), random(30, 70), random(210, 250)],
        a: random(0, 1),
        deforming: false,
        deformStart: 0,
      });
    }
  }

  radius += radiusSpeed;

  // console.log(seedPoints);
  // console.log(radius)

  noStroke();
  for (let p of seedPoints) {
    if (dist(p.x, p.y, startPointX, startPointY) <= radius) {
      if (p.radius <= p.maxRadius) {
        p.radius += p.growSpeed;
      }
      if (p.a < 0.38) {
        p.color1 = p.color7;
      }
      //本体
      push();

      noStroke;
      fill(p.color1[0], p.color1[1], p.color1[2], 240);
      translate(p.x, p.y);
      if (p.deforming == true) {
        let deformTime = frameCount - p.deformStart;
        let duration = 91;
        if (deformTime < duration) {
          scale(
            1 + sin(frameCount * 0.16) * 0.06,
            1 + cos(frameCount * 0.16 + 1) * 0.06
          );
        }
      }
      circle(0, 0, p.radius);
      //

      //装饰
      if (p.a > 0.4) {
        fill(p.color2[1], p.color2[2], p.color2[0], 240);
        circle(0, 0, p.radius / 2.4);
      }
      if (p.a < 0.6) {
        stroke(p.color3[2], p.color3[1], p.color3[0], 240);
        noFill();
        circle(0, 0, p.radius * 1.1);
      }
      if (p.a < 0.5) {
        fill(p.color4[0], p.color4[2], p.color4[1], 240);
        circle(0, 0, p.radius / 5);
      }
      if (p.a > 0.75) {
        stroke(p.color5[2], p.color5[1], p.color5[0], 240);
        noFill();
        circle(0, 0, p.radius * 1.3);
      }
      if (p.a < 0.25) {
        fill(p.color6[1], p.color6[2], p.color6[0], 240);
        circle(0, 0, p.radius / 1.8);
      }
      pop();

      //
    }
  }

  //颜色吞并
  for (let i = 0; i < seedPoints.length; i++) {
    for (let j = i + 1; j < seedPoints.length; j++) {
      let p1 = seedPoints[i];
      let p2 = seedPoints[j];

      // 两个菌落中心的距离
      let d = dist(p1.x, p1.y, p2.x, p2.y);

      // 判断是否接触
      if (d <= p1.radius / 2 + p2.radius / 2) {
        // p1比较小
        if (p1.radius < p2.radius) {
          p1.color1[0] = lerp(p1.color1[0], p2.color1[0], 0.02);
          p1.color1[1] = lerp(p1.color1[1], p2.color1[1], 0.02);
          p1.color1[2] = lerp(p1.color1[2], p2.color1[2], 0.02);
          p1.color2[0] = lerp(p1.color2[0], p2.color2[0], 0.02);
          p1.color2[1] = lerp(p1.color2[1], p2.color2[1], 0.02);
          p1.color2[2] = lerp(p1.color2[2], p2.color2[2], 0.02);
          p1.color4[0] = lerp(p1.color4[0], p2.color4[0], 0.02);
          p1.color4[1] = lerp(p1.color4[1], p2.color4[1], 0.02);
          p1.color4[2] = lerp(p1.color4[2], p2.color4[2], 0.02);
          p1.color6[0] = lerp(p1.color6[0], p2.color6[0], 0.02);
          p1.color6[1] = lerp(p1.color6[1], p2.color6[1], 0.02);
          p1.color6[2] = lerp(p1.color6[2], p2.color6[2], 0.02);
        }

        // p2比较小
        else if (p2.radius < p1.radius) {
          p2.color1[0] = lerp(p2.color1[0], p1.color1[0], 0.02);
          p2.color1[1] = lerp(p2.color1[1], p1.color1[1], 0.02);
          p2.color1[2] = lerp(p2.color1[2], p1.color1[2], 0.02);
          p1.color2[0] = lerp(p1.color2[0], p2.color2[0], 0.02);
          p1.color2[1] = lerp(p1.color2[1], p2.color2[1], 0.02);
          p1.color2[2] = lerp(p1.color2[2], p2.color2[2], 0.02);
          p1.color4[0] = lerp(p1.color4[0], p2.color4[0], 0.02);
          p1.color4[1] = lerp(p1.color4[1], p2.color4[1], 0.02);
          p1.color4[2] = lerp(p1.color4[2], p2.color4[2], 0.02);
          p1.color6[0] = lerp(p1.color6[0], p2.color6[0], 0.02);
          p1.color6[1] = lerp(p1.color6[1], p2.color6[1], 0.02);
          p1.color6[2] = lerp(p1.color6[2], p2.color6[2], 0.02);
        }
      }
    }
  }

  //画microscope
  //调用拖拽函数：
  if (frameCount > 300) {
    push();
    //保持的rect外观
    for (let i of microscopeRegions) {
      strokeWeight(2);
      stroke(43, 149, 204, 80);
      // stroke(255 - (i[0] / 3) * 1.05, 190, (i[1] / 4) * 1.05, 225);
      // fill(0, 65, 255, 108);
      fill(255, 255, 255, 70);
      rect(i[0], i[1], i[2], i[3]);
    }
    pop();
    if (isSelecting == true) {
      drawMicroscopeRegion();
    }
  }

  //光标
  fill(r, g, b);
  circle(x, y, mouseSize);

  x += pointSpeedx;
  y += pointSpeedy;

  if (abs(x - mouseX) > 0.8 && abs(y - mouseY) > 0.8) {
    //如果光标在鼠标范围外
    if (abs(pointSpeedx) > 0.1 && abs(pointSpeedy) > 0.1) {
      pointSpeedx *= 0.9;
      pointSpeedy *= 0.9;
    } else {
      pointSpeedx = 0;
      pointSpeedy = 0;
      x = lerp(x, mouseX, 0.07);
      y = lerp(y, mouseY, 0.07);
    }
  } else {
    //如果光标回到鼠标，就不用lerp
    pointUnderMouse = true;
  }

  if (pointUnderMouse) {
    x = mouseX;
    y = mouseY;
  }
  noStroke();
  if (mouseIsPressed) {
    r = 200;
    g = 0;
    b = 0;
  } else {
    r = 0;
    g = 0;
    b = 200;
  }

  //画菌丝
  let age = frameCount - growStartFrame;
  for (let p of growPoints) {
    // 只绘制已经生长出来的点
    if (age >= p.time) {
      fill(p.color[0], p.color[1], p.color[2], p.color[3]);

      circle(p.x, p.y, 2);
    }
  }
}

function mousePressed() {
  if (radius > 0) {
    for (let p of seedPoints) {
      let d = dist(mouseX, mouseY, p.x, p.y);

      if (d <= p.radius / 2 &&dist(x,y,mouseX,mouseY)<1) {
        let pMouse;
        r = 200;
        g = 0;
        b = 0;
        pMouse = random(0, 1);
        if (pMouse >= 0.5) {
          pointSpeedx = random(6, 9);
          pointSpeedy = random(6, 9);
        } else {
          pointSpeedx = random(-6, -9);
          pointSpeedy = random(-6, -9); //随机方向速度弹出
        }

        pointUnderMouse = false;

        p.deforming = true;
        p.deformStart = frameCount;

        sound1.play();
      }
    }
  }

  //拖拽判定
  if (frameCount > 300) {
    if (pointUnderMouse) {
      pointUnderMouseAtStart = true;
      isSelecting = true;
      selectStartX = mouseX;
      selectStartY = mouseY;
    } else {
      pointUnderMouseAtStart = false;
    }
  }
}

function mouseReleased() {
  if (frameCount > 300) {
    if (pointUnderMouse) {
      isSelecting = false;
      if (pointUnderMouseAtStart) {
        if (microscopeRegions.length >= 1) {
          microscopeRegions.splice(0, 1);
        }
        microscopeRegions.push([
          selectStartX,
          selectStartY,
          mouseX - selectStartX,
          mouseY - selectStartY,
        ]);
        microscopeChanged = true;
      }
    }
    console.log(microscopeRegions);
  }
  if (microscopeRegions.length > 0 && microscopeChanged) {
    startGrowth(microscopeRegions[0][0], microscopeRegions[0][1], PI / 4);
    microscopeChanged = false;
  }
}

function drawMicroscopeRegion() {
  fill(255, 255, 255, 150);
  stroke(0);
  rect(
    selectStartX,
    selectStartY,
    mouseX - selectStartX,
    mouseY - selectStartY
  );
}

function startGrowth(x, y, angle) {
  growPoints = [];
  growStartFrame = frameCount;
  grow(x, y, angle, 0, 0);
}

//菌丝生长递归函数
function grow(x, y, angle, depth, startTime) {
  if (depth > maxDepth) {
    return;
  }

  //参数和rect区域大小有关
  growSpeed = random(1, 3);
  framesPerBranch = microscopeRegions[0][2] / 19 + microscopeRegions[0][3] / 19;
  let randomColor = random(0, 1);
  // if (randomColor > 0.4) {
  // growColor = [
  //   230 + depth * random(1, 8),
  //   45 + depth * random(10, 30),
  //   depth * random(2, 15),
  //   255 - depth * random(10,12),
  // ];
  // } else {
  growColor = [
    0 + depth * random(12, 40),
    150 + depth * random(4, 35),
    200 + depth * random(2, 20),
    255 - depth * random(12, 18),
  ];
  // }
  // growR+=random(3,15)*depth
  // growG+=random(3,15)*depth
  // growB+=random(3,15)*depth
  for (let i = 0; i < framesPerBranch; i++) {
    x += cos(angle) * growSpeed;
    y += sin(angle) * growSpeed;
    x = constrain(
      x,
      microscopeRegions[0][0],
      microscopeRegions[0][0] + microscopeRegions[0][2]
    );
    y = constrain(
      y,
      microscopeRegions[0][1],
      microscopeRegions[0][1] + microscopeRegions[0][3]
    );
    growPoints.push({
      x: x,
      y: y,
      time: startTime + i,
      color: growColor,
    });
  }

  //第一个分支
  grow(x, y, angle + spliteAngle, depth + 1, startTime + framesPerBranch);
  //第二个分支
  grow(x, y, angle - spliteAngle, depth + 1, startTime + framesPerBranch);
}
