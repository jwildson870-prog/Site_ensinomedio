/* ======================================================================
   VETOR — script compartilhado por todas as páginas
   (fundo animado de partículas + carrossel de curiosidades)
====================================================================== */

/* Fundo — rede de partículas em canvas */
(function initBg(){
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w,h,particles;
  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function makeParticles(){
    const count = Math.min(70, Math.floor((w*h)/22000));
    particles = Array.from({length:count}, ()=>({
      x:Math.random()*w, y:Math.random()*h,
      vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25
    }));
  }
  resize(); makeParticles();
  window.addEventListener('resize', ()=>{ resize(); makeParticles(); });

  function tick(){
    ctx.clearRect(0,0,w,h);
    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>w) p.vx*=-1;
      if(p.y<0||p.y>h) p.vy*=-1;
    }
    for(let i=0;i<particles.length;i++){
      const a = particles[i];
      ctx.beginPath();
      ctx.arc(a.x,a.y,1.3,0,Math.PI*2);
      ctx.fillStyle='rgba(94,234,212,.5)';
      ctx.fill();
      for(let j=i+1;j<particles.length;j++){
        const b = particles[j];
        const d = Math.hypot(a.x-b.x, a.y-b.y);
        if(d<120){
          ctx.beginPath();
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.strokeStyle = `rgba(125,211,252,${.14*(1-d/120)})`;
          ctx.lineWidth=1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

/* Carrossel de curiosidades — funciona em qualquer página que tenha #c-track */
let carouselIndex = 0;

function updateCarousel(){
  const track = document.getElementById('c-track');
  if(!track) return;
  const cards = track.querySelectorAll('.carousel-card');
  const dots = document.querySelectorAll('#c-dots .c-dot');
  const total = cards.length;
  if(total === 0) return;

  cards.forEach((c,i)=> c.classList.toggle('is-active', i===carouselIndex));
  dots.forEach((d,i)=> d.classList.toggle('active', i===carouselIndex));

  const viewportWidth = track.parentElement.offsetWidth;
  const card = cards[0];
  const cardWidth = card.offsetWidth + 20; // margin-right
  const offset = (viewportWidth/2) - (cardWidth/2) - (carouselIndex*cardWidth);
  track.style.transform = `translateX(${offset}px)`;
}

function carouselMove(dir){
  const track = document.getElementById('c-track');
  if(!track) return;
  const total = track.querySelectorAll('.carousel-card').length;
  carouselIndex = (carouselIndex + dir + total) % total;
  updateCarousel();
}

function carouselGo(i){
  carouselIndex = i;
  updateCarousel();
}

window.addEventListener('resize', updateCarousel);
window.addEventListener('DOMContentLoaded', updateCarousel);
