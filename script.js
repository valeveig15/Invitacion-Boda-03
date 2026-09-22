(() => {
  'use strict';
  const invite = document.querySelector('.invite');
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  const audio = document.querySelector('audio[data-invite-track]');
  const musicFab = document.getElementById('musicFab');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const qs = (s, root=document) => root.querySelector(s);
  const qsa = (s, root=document) => [...root.querySelectorAll(s)];

  // Scroll reveal
  const reveals = qsa('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: .14, rootMargin: '0px 0px -6% 0px'});
    reveals.forEach(el => observer.observe(el));
  } else reveals.forEach(el => el.classList.add('is-visible'));

  qsa('[data-scroll]').forEach(btn => btn.addEventListener('click', () => {
    qs(btn.dataset.scroll)?.scrollIntoView({behavior:'smooth', block:'start'});
  }));

  // Countdown rings
  const maxima = [365,24,60,60];
  function countdownData(target){
    const diff = Math.max(0, target - Date.now());
    return [
      ['Días',Math.floor(diff/86400000)],
      ['Horas',Math.floor(diff%86400000/3600000)],
      ['Min',Math.floor(diff%3600000/60000)],
      ['Seg',Math.floor(diff%60000/1000)]
    ];
  }
  function updateCountdown(){
    const target = new Date(invite?.dataset.date).getTime();
    if(!Number.isFinite(target)) return;
    const values = countdownData(target);
    qsa('[data-countdown="rings"]').forEach(el => {
      el.innerHTML = values.map(([label,value],i) => {
        const progress = Math.min(1, value / maxima[i]) * 360;
        return `<div class="ring" style="--p:${progress}deg"><b>${String(value).padStart(2,'0')}</b><span>${label}</span></div>`;
      }).join('');
    });
  }
  updateCountdown();
  setInterval(updateCountdown,1000);

  // Modal helpers
  function openModal(markup){
    if(!modal || !modalBody) return;
    modalBody.innerHTML = markup;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function closeModal(){
    if(!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }
  qsa('[data-close]').forEach(btn => btn.addEventListener('click',closeModal));

  qsa('[data-map]').forEach(btn => btn.addEventListener('click', () => {
    const q = encodeURIComponent(btn.dataset.map || '');
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`,'_blank','noopener');
  }));

  qsa('[data-rsvp]').forEach(btn => btn.addEventListener('click', () => {
    openModal(`<h2 id="modalTitle">Confirmación de asistencia</h2><p>Nos encantará saber si vas a acompañarnos.</p><form id="rsvpForm"><input required autocomplete="name" placeholder="Nombre y apellido"><select aria-label="Asistencia"><option>Confirmo asistencia</option><option>No podré asistir</option></select><textarea placeholder="Mensaje o requerimiento alimentario"></textarea><button class="solid-btn" type="submit">ENVIAR</button></form>`);
    qs('#rsvpForm')?.addEventListener('submit', e => {
      e.preventDefault();
      openModal('<h2 id="modalTitle">¡Gracias!</h2><p>Tu respuesta quedó registrada en esta demostración. Para publicar, conectá el formulario con el servicio de RSVP real.</p>');
    });
  }));

  qsa('[data-gift]').forEach(btn => btn.addEventListener('click', () => {
    openModal('<h2 id="modalTitle">Luna de miel</h2><p>Banco Demo<br><b>Alias: NUESTRA.LUNA</b><br><br>Reemplazá estos datos por los reales antes de publicar.</p>');
  }));

  qsa('[data-song]').forEach(btn => btn.addEventListener('click', () => {
    openModal('<h2 id="modalTitle">¿Qué canción no puede faltar?</h2><form id="songForm"><input required placeholder="Canción"><input placeholder="Artista"><button class="solid-btn" type="submit">ENVIAR SUGERENCIA</button></form>');
    qs('#songForm')?.addEventListener('submit', e => {
      e.preventDefault();
      openModal('<h2 id="modalTitle">¡Gracias!</h2><p>La sugerencia quedó guardada en esta demostración.</p>');
    });
  }));

  qs('[data-instagram]')?.addEventListener('click', () => {
    openModal('<h2 id="modalTitle">@SofiMateo</h2><p>Vinculá este botón con la cuenta real de Instagram de la pareja antes de publicar.</p>');
  });

  // Calendar
  function eventRange(){
    const start = new Date(invite?.dataset.date);
    const hours = Number(invite?.dataset.duration || 6);
    return {start, end:new Date(start.getTime()+hours*3600000)};
  }
  function compactUTC(d){ return d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z'); }
  function escapeICS(v=''){ return String(v).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;'); }
  function googleCalendarUrl(){
    const {start,end}=eventRange();
    const couple=invite?.dataset.couple || 'Boda';
    const location=invite?.dataset.location || '';
    const p=new URLSearchParams({action:'TEMPLATE',text:`Boda ${couple}`,dates:`${compactUTC(start)}/${compactUTC(end)}`,details:`Celebración de ${couple}`,location});
    return `https://calendar.google.com/calendar/render?${p.toString()}`;
  }
  function downloadICS(){
    const {start,end}=eventRange();
    const couple=invite?.dataset.couple || 'Boda';
    const location=invite?.dataset.location || '';
    const uid=`${start.getTime()}-${couple.replace(/\W+/g,'').toLowerCase()}@invitacion.local`;
    const body=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Artdeco Studio//Invitacion Digital//ES','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT',`UID:${uid}`,`DTSTAMP:${compactUTC(new Date())}`,`DTSTART:${compactUTC(start)}`,`DTEND:${compactUTC(end)}`,`SUMMARY:${escapeICS('Boda '+couple)}`,`DESCRIPTION:${escapeICS('Celebración de '+couple)}`,`LOCATION:${escapeICS(location)}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
    const blob=new Blob([body],{type:'text/calendar;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download='boda-sofia-mateo.ics'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1200);
  }
  qsa('[data-calendar]').forEach(btn => btn.addEventListener('click', () => {
    openModal(`<h2 id="modalTitle">Agendar evento</h2><p>Elegí cómo querés guardar la fecha.</p><div class="calendar-actions"><a class="solid-btn" target="_blank" rel="noopener" href="${googleCalendarUrl()}">GOOGLE CALENDAR</a><button class="ghost-btn" id="downloadIcs" type="button">DESCARGAR .ICS</button></div>`);
    qs('#downloadIcs')?.addEventListener('click',downloadICS);
  }));

  // Carousel
  const slides = [
    'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=1100&q=88',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1100&q=88',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1100&q=88'
  ];
  let slideIndex=0;
  const slideImg=qs('#s5Slide');
  const slideCurrent=qs('#slideCurrent');
  const dots=qsa('.dot');
  function renderSlide(){
    if(!slideImg) return;
    slideImg.classList.remove('active');
    slideImg.src=slides[slideIndex];
    slideImg.alt=`Sofía y Mateo · foto ${slideIndex+1}`;
    void slideImg.offsetWidth;
    slideImg.classList.add('active');
    if(slideCurrent) slideCurrent.textContent=String(slideIndex+1).padStart(2,'0');
    dots.forEach((d,i)=>d.classList.toggle('active',i===slideIndex));
  }
  qs('.carousel .next')?.addEventListener('click',()=>{slideIndex=(slideIndex+1)%slides.length;renderSlide()});
  qs('.carousel .prev')?.addEventListener('click',()=>{slideIndex=(slideIndex+slides.length-1)%slides.length;renderSlide()});
  dots.forEach(dot=>dot.addEventListener('click',()=>{slideIndex=Number(dot.dataset.slide)||0;renderSlide()}));

  // Music control. Browser autoplay rules require the first user tap.
  let musicOn=false;
  function syncMusicButton(){
    if(!musicFab) return;
    musicFab.classList.toggle('is-playing',musicOn);
    musicFab.setAttribute('aria-pressed',String(musicOn));
    musicFab.setAttribute('aria-label',musicOn?'Desactivar música':'Activar música');
  }
  musicFab?.addEventListener('click',async()=>{
    if(!audio) return;
    if(musicOn){ audio.pause(); musicOn=false; syncMusicButton(); return; }
    audio.volume=.34;
    try{ await audio.play(); musicOn=true; }catch{ musicOn=false; }
    syncMusicButton();
  });
  syncMusicButton();

  // Lightbox for carousel photos
  let lightboxIndex=0;
  function openLightbox(index){
    if(!lightbox || !lightboxImg) return;
    lightboxIndex=index;
    lightboxImg.src=slides[lightboxIndex];
    if(lightboxCaption) lightboxCaption.textContent=`Sofía y Mateo · ${lightboxIndex+1} / ${slides.length}`;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function closeLightbox(){
    if(!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    lightboxImg?.removeAttribute('src');
    document.body.style.overflow='';
  }
  function stepLightbox(delta){
    lightboxIndex=(lightboxIndex+delta+slides.length)%slides.length;
    if(lightboxImg) lightboxImg.src=slides[lightboxIndex];
    if(lightboxCaption) lightboxCaption.textContent=`Sofía y Mateo · ${lightboxIndex+1} / ${slides.length}`;
  }
  slideImg?.addEventListener('click',()=>openLightbox(slideIndex));
  qsa('[data-lightbox-close]').forEach(btn=>btn.addEventListener('click',closeLightbox));
  qs('#lightboxPrev')?.addEventListener('click',()=>stepLightbox(-1));
  qs('#lightboxNext')?.addEventListener('click',()=>stepLightbox(1));

  document.addEventListener('keydown',e=>{
    if(lightbox?.classList.contains('open')){
      if(e.key==='Escape') closeLightbox();
      if(e.key==='ArrowLeft') stepLightbox(-1);
      if(e.key==='ArrowRight') stepLightbox(1);
      return;
    }
    if(e.key==='Escape') closeModal();
  });
})();
