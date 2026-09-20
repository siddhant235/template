const reduced=matchMedia('(prefers-reduced-motion: reduce)');
document.head.insertAdjacentHTML('beforeend','<link rel="stylesheet" href="timeline.css">');
document.querySelector('#chapters-toggle').textContent='Timeline';
document.querySelector('#chapters').innerHTML=`<div class="timeline-shell"><div class="timeline-head"><div><span class="eyebrow">SHAADI KA SAFAR</span><h2 id="chapters-title">Our celebration <em>timeline.</em></h2><p>Har pal khaas. Har rasam dil ke paas.</p></div><button id="chapters-close" aria-label="Close timeline">✕</button></div><div class="timeline-scroll"><section class="timeline-day"><div class="timeline-date"><span>09</span><div><b>MARCH 2027</b><small>THE CELEBRATIONS BEGIN</small></div></div><div class="timeline-track"><button class="timeline-event story" data-scene="1"><i></i><span class="timeline-time">OUR STORY</span><strong>Ek nayi kahaani</strong><small>Where forever found its beginning</small><em>View scene →</em></button><button class="timeline-event promise" data-scene="3"><i></i><span class="timeline-time">THE PROMISE</span><strong>Ring Ceremony</strong><small>Ek ring, aur forever ki shuruaat</small><em>View scene →</em></button><button class="timeline-event mehendi-dot" data-scene="4"><i></i><span class="timeline-time">THE COLOURS</span><strong>Mehendi</strong><small>Mehendi ke rang, apno ke sang</small><em>View scene →</em></button><button class="timeline-event tilak-dot" data-scene="5"><i></i><span class="timeline-time">THE BLESSINGS</span><strong>Tilak</strong><small>Shagun, aashirvaad aur apno ka pyaar</small><em>View scene →</em></button><button class="timeline-event sangeet-dot" data-scene="6"><i></i><span class="timeline-time">THE CELEBRATION</span><strong>Sangeet</strong><small>Sur, taal aur full-on dhamaal</small><em>View scene →</em></button></div></section><div class="timeline-night"><span>✦</span> One magical night later <span>✦</span></div><section class="timeline-day day-two-timeline"><div class="timeline-date"><span>10</span><div><b>MARCH 2027</b><small>FROM SUNSHINE TO FOREVER</small></div></div><div class="timeline-track"><button class="timeline-event haldi-dot" data-scene="7"><i></i><span class="timeline-time">A LITTLE SUNSHINE</span><strong>Haldi</strong><small>Thodi haldi, thodi masti, bahut saara pyaar</small><em>View scene →</em></button><button class="timeline-event wedding-dot" data-scene="8"><i></i><span class="timeline-time">THE BEGINNING OF ALWAYS</span><strong>The Wedding</strong><small>Saat phere, saat vachan, ek zindagi</small><em>View scene →</em></button><button class="timeline-event invitation-dot" data-scene="9"><i></i><span class="timeline-time">DIL SE, AAPKE LIYE</span><strong>Your Invitation</strong><small>Aap aayenge, toh baat ban jaayegi</small><em>View scene →</em></button></div></section><p class="timeline-note">Event timings and the final running order will be shared closer to the celebrations.</p></div></div>`;
const scenes=[...document.querySelectorAll('.show-scene')],curtain=document.querySelector('.scene-curtain'),entry=document.querySelector('.entry'),chapters=document.querySelector('#chapters');
document.head.insertAdjacentHTML('beforeend','<link rel="stylesheet" href="interactions.css?v=2">');
const rituals=[
  ['seal','S & A','Khushiyon ka darwaza kholein','Hamaari shaadi mein aapka swagat hai','Ek nayi kahaani…'],
  ['ribbon','∞','Untie our forever','Meet Siddhant & Aanchal','Do dil, ek kahaani…'],
  ['promise','♡','Bring our hearts together','Let the celebrations begin','Khushiyon ki shuruaat…'],
  ['rings','∞','Join the rings','Reveal the next celebration','Ek vaada, hamesha ka…'],
  ['bloom','✺','Let the colours bloom','Continue to Tilak','Rang aur khushiyaan…'],
  ['blessing','✧','Open the shagun','Continue to Sangeet','Apno ka aashirvaad…'],
  ['rhythm','♫','Light up the night','Continue to Haldi','Ab toh jashn hoga…'],
  ['sunshine','☀','Shower a little sunshine','Reveal our wedding','Pyaar ka rang…'],
  ['vows','✧','Unfold our forever','Your personal invitation','Saat vachan. Ek zindagi.'],
  ['replay','↺','Relive the magic','Return to the beginning','Phir se, dil se…']
];
scenes.forEach((scene,i)=>{const [kind,symbol,label,hint]=rituals[i],button=scene.querySelector('[data-next]');button.className='ritual-action action-'+kind;button.setAttribute('aria-label',label+'. '+hint);button.innerHTML=`<span class="ritual-token" aria-hidden="true"><span class="token-orbit"></span><span class="token-symbol">${symbol}</span><span class="token-rays"></span></span><span class="ritual-label">${label}</span><span class="ritual-hint">${hint} <span aria-hidden="true">→</span></span>`;scene.dataset.ritual=kind;});
document.querySelector('.show-hint').textContent='TOUCH THE MAGIC · OR SWIPE';
document.querySelector('#calendar').innerHTML='<span aria-hidden="true">✧</span> Keep these dates close';
let current=0,busy=false;
function activate(index,focus=true){current=index;scenes.forEach((s,i)=>{s.classList.toggle('is-active',i===index);s.inert=i!==index;s.setAttribute('aria-hidden',String(i!==index));s.scrollTop=0});document.querySelector('#scene-counter').textContent=`${String(index+1).padStart(2,'0')} / ${scenes.length}`;document.querySelector('.scene-progress span').style.width=`${(index+1)/scenes.length*100}%`;document.querySelector('#previous').disabled=index===0;document.querySelector('#next').setAttribute('aria-label',index===scenes.length-1?'Replay invitation':'Next scene');history.replaceState(null,'',`#${scenes[index].id}`);if(focus)scenes[index].querySelector('h1').focus({preventScroll:true});const next=scenes[index+1]?.querySelector('img');if(next)next.loading='eager';}
async function go(index){
  if(busy||entry.open)return;
  index=(index+scenes.length)%scenes.length;
  if(index===current)return;
  if(reduced.matches){activate(index);return}
  busy=true;
  const source=scenes[current],ritual=rituals[current];
  source.classList.add('ritual-awakening');
  curtain.className='scene-curtain ritual-curtain curtain-'+ritual[0];
  curtain.querySelector('span').textContent=ritual[4];
  const night=['rhythm','vows'].includes(ritual[0]);
  curtain.style.background=night?'#302437':ritual[0]==='sunshine'?'#ecd28f':'#f0e0ce';
  curtain.style.color=night?'#f6ddb2':'#653e48';
  const easing='cubic-bezier(.22,.61,.36,1)';
  let veil;
  try{
    veil=curtain.animate([{opacity:0},{opacity:1}],{duration:650,easing,fill:'forwards'});
    await veil.finished;
    curtain.style.opacity='1';veil.cancel();
    activate(index);
    veil=curtain.animate([{opacity:1},{opacity:0}],{duration:850,delay:100,easing,fill:'forwards'});
    await veil.finished;
  }finally{
    if(veil)veil.cancel();curtain.style.opacity='';curtain.className='scene-curtain';
    source.classList.remove('ritual-awakening');busy=false;
  }
}
document.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>go(current+1)));document.querySelector('#next').onclick=()=>go(current+1);document.querySelector('#previous').onclick=()=>{if(current>0)go(current-1)};
document.querySelector('#chapters-toggle').onclick=()=>{document.querySelectorAll('.timeline-event').forEach(item=>item.classList.toggle('is-current',Number(item.dataset.scene)===current));chapters.showModal();requestAnimationFrame(()=>{chapters.classList.add('timeline-open');const active=chapters.querySelector('.is-current');if(active)active.scrollIntoView({block:'center',behavior:reduced.matches?'auto':'smooth'})})};document.querySelector('#chapters-close').onclick=()=>{chapters.classList.remove('timeline-open');setTimeout(()=>chapters.close(),250)};document.querySelectorAll('[data-scene]').forEach(b=>b.onclick=()=>{chapters.classList.remove('timeline-open');setTimeout(()=>{chapters.close();go(Number(b.dataset.scene))},220)});document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const i=scenes.findIndex(s=>'#'+s.id===a.getAttribute('href'));if(i>=0){e.preventDefault();go(i)}}));
document.addEventListener('keydown',e=>{if(entry.open||chapters.open||e.target.matches('input,textarea,button'))return;if(e.key==='ArrowRight'){e.preventDefault();go(current+1)}if(e.key==='ArrowLeft'&&current>0){e.preventDefault();go(current-1)}});
let touchStart=null;document.querySelector('.show-stage').addEventListener('touchstart',e=>{touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});document.querySelector('.show-stage').addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5){if(dx<0)go(current+1);else if(current>0)go(current-1)}touchStart=null},{passive:true});
// One native player keeps music continuous across scenes without synthesis timers.
const music=document.createElement('audio');
music.id='wedding-music';
music.preload='none';
music.loop=true;
music.volume=.45;
music.src='assets/kudmayi.mp3';
document.body.append(music);
let musicOn=false,playRequest=0,resumeOnVisible=false;
function renderSound(){const b=document.querySelector('#sound-toggle');b.setAttribute('aria-pressed',String(musicOn));b.setAttribute('aria-label',musicOn?'Mute music':'Turn music on');b.querySelector('span').textContent=musicOn?'Sound on':'Sound off'}
async function startMusic(){const request=++playRequest;musicOn=true;renderSound();try{await music.play();if(request!==playRequest)return;renderSound()}catch(error){if(request!==playRequest)return;musicOn=false;renderSound();if(error.name!=='AbortError')document.querySelector('#sound-toggle span').textContent=error.name==='NotAllowedError'?'Tap for music':'Sound unavailable'}}
function stopMusic(){playRequest++;music.pause();musicOn=false;renderSound()}
music.addEventListener('error',()=>{stopMusic();document.querySelector('#sound-toggle span').textContent='Sound unavailable'});
document.querySelector('#sound-toggle').onclick=()=>{resumeOnVisible=false;musicOn?stopMusic():startMusic()};
document.addEventListener('visibilitychange',()=>{if(document.hidden){resumeOnVisible=musicOn;if(musicOn)stopMusic()}else if(resumeOnVisible){resumeOnVisible=false;startMusic()}});
window.addEventListener('pagehide',()=>{resumeOnVisible=false;stopMusic()});
const initialHash=location.hash;const initial=scenes.findIndex(s=>'#'+s.id===initialHash);activate(initial>=0?initial:0,false);entry.showModal();
function openInvitation(skip=false){startMusic();if(skip||reduced.matches){entry.close();scenes[current].querySelector('h1').focus({preventScroll:true});return}entry.classList.add('opening');setTimeout(()=>{entry.close();scenes[current].querySelector('h1').focus({preventScroll:true})},1550)}
document.querySelector('.entry-open').onclick=()=>openInvitation();document.querySelector('.entry-skip').onclick=()=>openInvitation(true);
document.querySelector('#calendar').addEventListener('click',()=>{const content=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Siddhant and Aanchal//Wedding//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:siddhant-aanchal-wedding-20270309','DTSTAMP:20260918T000000Z','DTSTART;VALUE=DATE:20270309','DTEND;VALUE=DATE:20270311','SUMMARY:Siddhant & Aanchal — Wedding Celebrations','DESCRIPTION:9 March: Ring ceremony\\, Mehendi\\, Tilak and Sangeet. 10 March: Haldi and Wedding. Timings and venue to follow.','END:VEVENT','END:VCALENDAR'].join('\r\n');const url=URL.createObjectURL(new Blob([content],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Siddhant-and-Aanchal-Wedding.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#calendar-status').textContent='Your calendar invitation is ready to add.'});
