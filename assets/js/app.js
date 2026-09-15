
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  const readProgress = () => {
    try { return JSON.parse(localStorage.getItem('vetor-progress') || '{}'); }
    catch { return {}; }
  };
  const writeProgress = (data) => localStorage.setItem('vetor-progress', JSON.stringify(data));
  const totalTopics = 72;

  function openMenu() {
    const side = $('.sidebar'), btn = $('[data-menu]');
    if (!side) return;
    side.classList.add('mobile-open');
    document.body.classList.add('menu-open');
    if (btn) btn.setAttribute('aria-expanded','true');
  }
  function closeMenu() {
    const side = $('.sidebar'), btn = $('[data-menu]');
    if (!side) return;
    side.classList.remove('mobile-open');
    document.body.classList.remove('menu-open');
    if (btn) btn.setAttribute('aria-expanded','false');
  }

  const menuBtn = $('[data-menu]');
  if (menuBtn) menuBtn.addEventListener('click', () => {
    document.body.classList.contains('menu-open') ? closeMenu() : openMenu();
  });
  $$('[data-menu-close]').forEach(el => el.addEventListener('click', closeMenu));
  $$('.sidebar a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  function markLastTopic() {
    const body = document.body;
    const id = body.dataset.topicId;
    const subject = body.dataset.subject;
    if (!id || !subject) return;
    const data = readProgress();
    data[id] = data[id] || { visited:true, completed:false, subject };
    data[id].visited = true;
    data[id].subject = subject;
    data[id].title = $('h1')?.textContent.trim() || '';
    data[id].updated = Date.now();
    writeProgress(data);
  }

  function setupTopicCompletion() {
    const btn = $('[data-complete-topic]');
    if (!btn) return;
    const id = document.body.dataset.topicId;
    if (!id) return;
    const data = readProgress();
    const completed = Boolean(data[id]?.completed);

    const paint = state => {
      btn.dataset.complete = String(state);
      btn.setAttribute('aria-pressed', String(state));
      btn.textContent = state ? '✓ Tópico concluído' : '○ Marcar como concluído';
    };
    paint(completed);

    btn.addEventListener('click', () => {
      const next = !Boolean(readProgress()[id]?.completed);
      const fresh = readProgress();
      fresh[id] = fresh[id] || {subject:document.body.dataset.subject};
      fresh[id].completed = next;
      fresh[id].visited = true;
      fresh[id].subject = document.body.dataset.subject;
      fresh[id].title = $('h1')?.textContent.trim() || '';
      fresh[id].updated = Date.now();
      writeProgress(fresh);
      paint(next);
      updateSubjectProgress();
    });
  }

  function subjectProgress(subject) {
    const data = readProgress();
    const entries = Object.values(data).filter(x => x.subject === subject && x.completed);
    return Math.min(6, entries.length);
  }

  function updateSubjectProgress() {
    const subject = document.body.dataset.subject;
    if (!subject || document.body.dataset.home !== undefined) return;
    const completed = subjectProgress(subject);
    const pct = Math.round((completed/6)*100);
    const bar = $('[data-progress-bar]');
    const label = $('[data-progress-label]');
    const mini = $('[data-progress-mini]');
    if (bar) bar.style.width = pct + '%';
    if (label) label.textContent = pct + '%';
    if (mini) mini.textContent = `${completed} / 6 concluídos`;
    const track = $('.hero-progress-card [role="progressbar"]');
    if (track) track.setAttribute('aria-valuenow', String(pct));

    $$('[data-topic-id]').forEach(card => {
      const id=card.dataset.topicId;
      const done=Boolean(readProgress()[id]?.completed);
      card.classList.toggle('is-complete',done);
      const status=card.querySelector('[data-topic-status]');
      if(status) status.textContent=done?'Concluído':'Disponível';
    });
  }

  function setupCarousel() {
    $$('[data-carousel]').forEach(carousel => {
      const track=$('[data-carousel-track]',carousel);
      if(!track) return;
      const slides=$$('.slide',track);
      if(!slides.length) return;
      let index=0, startX=null, startY=null;
      const countEl=$('[data-carousel-count]',carousel);

      const render=() => {
        const gap=parseFloat(getComputedStyle(track).gap)||14;
        const width=slides[0].getBoundingClientRect().width + gap;
        const max=Math.max(0, slides.length-1);
        index=Math.max(0,Math.min(index,max));
        track.style.transform=`translate3d(${-index*width}px,0,0)`;
        if(countEl) countEl.textContent=`${String(index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
      };
      const move=dir => { index=(index+dir+slides.length)%slides.length; render(); };
      $('[data-carousel-prev]',carousel)?.addEventListener('click',()=>move(-1));
      $('[data-carousel-next]',carousel)?.addEventListener('click',()=>move(1));
      carousel.addEventListener('touchstart',e=>{
        const t=e.changedTouches[0]; startX=t.clientX; startY=t.clientY;
      },{passive:true});
      carousel.addEventListener('touchend',e=>{
        if(startX===null) return;
        const t=e.changedTouches[0], dx=t.clientX-startX, dy=t.clientY-startY;
        startX=startY=null;
        if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)) move(dx<0?1:-1);
      },{passive:true});
      render();
      addEventListener('resize',render,{passive:true});
    });
  }

  function setupHome() {
    const search=$('#subject-search');
    const cards=$$('[data-subject-card]');
    const empty=$('#search-empty');
    if(search) {
      search.addEventListener('input',()=>{
        const q=search.value.trim().toLowerCase();
        let visible=0;
        cards.forEach(card=>{
          const show=!q || card.dataset.search.includes(q);
          card.classList.toggle('is-hidden',!show);
          if(show) visible++;
        });
        if(empty) empty.hidden=visible!==0;
      });
    }

    const data=readProgress();
    const completed=Object.values(data).filter(x=>x.completed);
    const subjects=new Set(completed.map(x=>x.subject)).size;
    const pct=Math.round((completed.length/totalTopics)*100);
    const sc=$('#stat-completed'), ss=$('#stat-subjects'), sp=$('#stat-percent');
    if(sc) sc.textContent=completed.length;
    if(ss) ss.textContent=subjects;
    if(sp) sp.textContent=pct+'%';
    const bar=$('#home-progress-bar'), label=$('#home-progress-label');
    if(bar) bar.style.width=pct+'%';
    if(label) label.textContent=pct+'%';
    const track=$('.home-card [role="progressbar"]');
    if(track) track.setAttribute('aria-valuenow',String(pct));

    const recent=Object.entries(data)
      .filter(([,x])=>x.visited)
      .sort((a,b)=>(b[1].updated||0)-(a[1].updated||0))[0];
    const link=$('#continue-link'), thumb=$('#continue-thumb'), title=$('#continue-title'), meta=$('#continue-meta');
    if(recent) {
      const [id,x]=recent, parts=id.split('-'), subject=parts.slice(0,-1).join('-'), num=parts.at(-1);
      if(x.subject && subject) {
        const href=`pages/materias/${x.subject}/topico-${num}.html`;
        if(link) link.href=href;
        if(thumb) { thumb.src=`assets/images/${x.subject}/topico-${num}.svg`; thumb.alt=''; }
        if(title) title.textContent=`${x.title || 'Retomar tópico'}`;
        if(meta) meta.textContent=`${slugNames[x.subject] || x.subject} · ${x.completed?'Concluído — revise quando quiser':'Continuar estudo'}`;
      }
    }

    const facts=window.VETOR_FACTS || [];
    if(facts.length) {
      const day=Math.floor(Date.now()/86400000)%facts.length;
      const f=facts[day];
      $('#fact-title').textContent=f.title;
      $('#fact-text').textContent=f.text;
      $('#fact-meta').textContent=`${f.name} · ${f.tag}`;
      $('#fact-link').href=`pages/materias/${f.slug}/index.html`;
    }
  }

  const slugNames={
    portugues:'Português',ingles:'Inglês',matematica:'Matemática',fisica:'Física',quimica:'Química',
    biologia:'Biologia',historia:'História',geografia:'Geografia',filosofia:'Filosofia',
    sociologia:'Sociologia',programacao:'Programação','autoria-web':'Autoria Web'
  };

  markLastTopic();
  setupTopicCompletion();
  updateSubjectProgress();
  setupCarousel();
  if(document.body.dataset.home !== undefined) setupHome();
})();
