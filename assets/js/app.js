
(function(){
  const toggle=document.querySelector('[data-menu]'), side=document.querySelector('.sidebar');
  if(toggle&&side){toggle.addEventListener('click',()=>side.classList.toggle('mobile-open'));}
})();
let slideIndex=0;
function renderCarousel(){
 const track=document.querySelector('[data-carousel-track]'); if(!track)return;
 const slides=[...track.children]; if(!slides.length)return;
 const step=slides[0].getBoundingClientRect().width+14;
 const visible=innerWidth<700?0:1;
 slideIndex=Math.max(0,Math.min(slideIndex,slides.length-1));
 track.style.transform=`translateX(${-slideIndex*step}px)`;
 document.querySelectorAll('[data-dot]').forEach((d,i)=>d.classList.toggle('active',i===slideIndex));
}
function moveSlide(dir){const track=document.querySelector('[data-carousel-track]');if(!track)return;const n=track.children.length;slideIndex=(slideIndex+dir+n)%n;renderCarousel()}
window.moveSlide=moveSlide;
addEventListener('resize',renderCarousel);addEventListener('load',renderCarousel);
