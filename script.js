// ========= خلفية متحركة (Canvas) =========
const bg = document.getElementById("bgCanvas");
const ctx = bg.getContext("2d");
let W = 0, H = 0, shapes = [];

function resizeCanvas(){
  W = bg.width = window.innerWidth;
  H = bg.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function rand(a,b){ return Math.random()*(b-a)+a; }

function spawnShape(){
  const types = ["x","o","sq","tri"];
  const t = types[Math.floor(Math.random()*types.length)];
  shapes.push({
    t,
    x: rand(0,W),
    y: rand(0,H),
    s: rand(8,24),
    vx: rand(-0.2,0.2),
    vy: rand(-0.15,0.15),
    a: 0,
    life: rand(3,6),
    rot: rand(0,Math.PI*2),
    vr: rand(-0.01,0.01)
  });
}

function drawShape(sh){
  ctx.save();
  ctx.translate(sh.x, sh.y);
  ctx.rotate(sh.rot);
  ctx.globalAlpha = Math.min(0.4, sh.a);

  ctx.strokeStyle = "rgba(200,200,200,0.8)";
  ctx.lineWidth = 1.2;

  const s = sh.s;
  switch(sh.t){
    case "x":
      ctx.beginPath();
      ctx.moveTo(-s/2, -s/2); ctx.lineTo(s/2, s/2);
      ctx.moveTo(s/2, -s/2); ctx.lineTo(-s/2, s/2);
      ctx.stroke();
      break;
    case "o":
      ctx.beginPath();
      ctx.arc(0,0,s/2,0,Math.PI*2);
      ctx.stroke();
      break;
    case "sq":
      ctx.beginPath();
      ctx.rect(-s/2,-s/2,s,s);
      ctx.stroke();
      break;
    case "tri":
      ctx.beginPath();
      ctx.moveTo(0,-s/1.2);
      ctx.lineTo(s/1.1, s/1.5);
      ctx.lineTo(-s/1.1, s/1.5);
      ctx.closePath();
      ctx.stroke();
      break;
  }
  ctx.restore();
}

let last = performance.now();
function animate(ts){
  const dt = (ts - last)/1000; last = ts;
  ctx.clearRect(0,0,W,H);

  if(Math.random() < 0.35) spawnShape();

  shapes = shapes.filter(sh => {
    sh.x += sh.vx;
    sh.y += sh.vy;
    sh.rot += sh.vr;
    sh.a = Math.min(1, sh.a + dt*0.6);
    sh.life -= dt;

    if(sh.life < 1) sh.a = Math.max(0, sh.a - dt*0.8);

    if(sh.x < -30) sh.x = W+30;
    if(sh.x > W+30) sh.x = -30;
    if(sh.y < -30) sh.y = H+30;
    if(sh.y > H+30) sh.y = -30;

    drawShape(sh);
    return sh.life > 0;
  });

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ========= لعبة XO =========
const cells = [...document.querySelectorAll(".cell")];
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const resetMatchBtn = document.getElementById("resetMatchBtn");
const modeLabel = document.getElementById("modeLabel");
const turnLabel = document.getElementById("turnLabel");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDrawEl = document.getElementById("scoreDraw");
const maxLabel = document.getElementById("maxLabel");

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const maxPointsSel = document.getElementById("maxPoints");

const endScreen = document.getElementById("endScreen");
const endTitle = document.getElementById("endTitle");
const endMsg = document.getElementById("endMsg");
const newMatchBtn = document.getElementById("newMatchBtn");
const closeEndBtn = document.getElementById("closeEndBtn");

let board = Array(9).fill(null);
let xTurn = true;
let vsCpu = true;
let lock = true;
let score = { X:0, O:0, D:0 };
let MAX_POINTS = 3;
let difficultyLevel = "high"; // ← مستوى الذكاء المتغير

const LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

function setStatus(msg){ statusEl.textContent = msg; }
function
