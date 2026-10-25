import {icon} from './icons.js';
// Original motion graphics and interactions inspired by the reference browsing patterns.
export function initMotion({projects,projectUrl,escape,concept,openChat,send}){
 const $=s=>document.querySelector(s),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const canMove=()=>!reduced.matches&&!document.documentElement.classList.contains('motion-paused');
 const art={
  demo:`<div class="signal-pipeline"><div class="signal-node"><span>01</span><b>KNOWLEDGE</b><i>↥</i></div><div class="signal-wire"><i></i></div><div class="signal-node"><span>02</span><b>ORCHESTRATE</b><i>✳</i></div><div class="signal-wire"><i></i></div><div class="signal-node"><span>03</span><b>DEMO</b><i>↗</i></div></div><div class="signal-caption">LESS SETUP. MORE POSSIBILITY.</div>`,
  gym:`<div class="retention-orbit"><div class="retention-ring ring-one"></div><div class="retention-ring ring-two"></div><div class="retention-ring ring-three"></div><div class="retention-core">Keep<br><em>showing up.</em></div><span class="orbit-tag tag-one">CHECK IN ✓</span><span class="orbit-tag tag-two">BUILD A STREAK ↗</span></div>`,
  aqi:`<div class="forecast-art"><div class="forecast-sun"></div><div class="forecast-label">A CLEARER<br><em>view ahead.</em></div><svg viewBox="0 0 500 180"><path class="forecast-fill" d="M0 160Q50 150 90 100T180 85T260 60T350 80T500 15V180H0Z"/><path class="forecast-line" d="M0 160Q50 150 90 100T180 85T260 60T350 80T500 15"/></svg><span>COLLECT / TRAIN / FORECAST</span></div>`,
  automl:`<div class="model-art"><span class="model-title">A little less<br><em>trial and error.</em></span><div class="model-bars">${[52,78,65,92,84,100].map((h,i)=>`<i style="--bar:${h}%;--delay:${i*-.35}s"></i>`).join('')}</div><div class="model-labels"><span>PREPROCESS</span><span>TRAIN</span><span>EVALUATE ↗</span></div></div>`,
  psx:`<div class="screen-word">Clarity.<br><em>By the numbers.</em></div><div class="screen-checks"><span><i>✓</i> BUSINESS</span><span><i>✓</i> FINANCIAL RATIOS</span><span><i>↗</i> REVIEW</span></div>`,
  qa:`<div class="retrieval-art"><span class="retrieval-label">A HANDBOOK. A QUESTION. A START.</span><div class="retrieval-query">Where can I find the policy?<span>↗</span></div><div class="retrieval-doc"><i></i><i></i><i></i><i></i><b>RELEVANT CONTEXT FOUND ✓</b></div><span class="retrieval-cursor"></span></div>`,
  gift:`<div class="keepsake-motion"><div class="keepsake-frame frame-back">a place.</div><div class="keepsake-frame frame-front"><span>the moments<br><em>we keep.</em></span><small>PERSONAL. THOUGHTFUL. YOURS.</small></div></div>`,
  research:`<div class="research-art"><span>THEN / NOW / WHAT NEXT?</span><div class="research-type">Hype.<br><em>Or history?</em></div><div class="research-path"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>`
 };
 let active=0,switchTimer,channelAnimation;
 const buttons=$('#channel-buttons');buttons.innerHTML=projects.map((p,i)=>`<button data-channel="${i}" aria-label="Channel ${i+1}, ${escape(p.name)}" aria-pressed="${i===0}">${String(i+1).padStart(2,'0')}</button>`).join('');
 function showChannel(index,animate=true){
  active=(index+projects.length)%projects.length;const p=projects[active],n=String(active+1).padStart(2,'0');
  $('#broadcast-copy').innerHTML=`<span class="channel-kicker"><b>CH ${n}</b> ${escape(p.category.toUpperCase())}</span><h3>${escape(p.name)}</h3><p class="channel-short">${escape(p.short)}</p><p>${escape(p.description)}</p><ul class="channel-stack">${p.tags.map(t=>`<li>${escape(t)}</li>`).join('')}</ul><span class="channel-status">${escape(p.status)} · source available on GitHub</span><div class="channel-actions"><a class="button dark" href="${projectUrl(p)}" target="_blank" rel="noreferrer">Explore source <span>↗</span></a><button class="text-button" data-project="${p.slug}">Project notes ↗</button></div>`;
  $('#signal-art').innerHTML=art[p.theme];$('#tv-screen').className='tv-screen screen-'+p.theme;$('#screen-channel').innerHTML=icon(p.theme)+`<span>CH ${n} / ${escape(p.name.toUpperCase())}</span>`;$('#screen-title').textContent=p.short;$('#on-air-label').textContent=`ON AIR · CH ${n}`;$('#channel-dial').value=active;
  if(p.theme==='demo')document.querySelectorAll('.signal-node>i').forEach((el,i)=>el.innerHTML=icon(['qa','automl','demo'][i]));
  if($('#story-position'))$('#story-position').textContent=`${n} / 08`;
  if($('#story-escape'))$('#story-escape').textContent=active===projects.length-1?'Continue down ↓':'Skip to project grid ↓';
  document.querySelectorAll('[data-channel]').forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===active));b.classList.toggle('active',i===active);});
  $('.channel-knob').style.setProperty('--dial-angle',`${active*36-125}deg`);
  if(animate&&canMove()){
   channelAnimation?.cancel();channelAnimation=$('#signal-art').animate([{opacity:0,transform:'translateY(18px) scale(.97)',filter:'blur(8px)'},{opacity:1,transform:'translateY(0) scale(1)',filter:'blur(0)'}],{duration:520,easing:'cubic-bezier(.2,.8,.2,1)'});
   $('.television').classList.remove('is-tuning');void $('.television').offsetWidth;$('.television').classList.add('is-tuning');clearTimeout(switchTimer);switchTimer=setTimeout(()=>$('.television').classList.remove('is-tuning'),440);
  }
 }
 let storySeek=()=>{};
 function selectChannel(index){showChannel(index);storySeek(active);}
 buttons.onclick=e=>{const b=e.target.closest('[data-channel]');if(b)selectChannel(Number(b.dataset.channel));};$('#previous-channel').onclick=()=>selectChannel(active-1);$('#next-channel').onclick=()=>selectChannel(active+1);$('#channel-dial').oninput=e=>selectChannel(Number(e.target.value));
 $('.channel-controls').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();selectChannel(active+(e.key==='ArrowRight'?1:-1));buttons.querySelector(`[data-channel="${active}"]`).focus({preventScroll:true});}});
 let touchStart=null;$('#tv-screen').addEventListener('touchstart',e=>touchStart=e.changedTouches[0].clientX,{passive:true});$('#tv-screen').addEventListener('touchend',e=>{if(touchStart===null)return;const delta=e.changedTouches[0].clientX-touchStart;if(Math.abs(delta)>45)selectChannel(active+(delta<0?1:-1));touchStart=null;},{passive:true});showChannel(0,false);
 const master=$('#motion-master');function syncMotion(){const paused=document.documentElement.classList.contains('motion-paused');master.textContent=paused?'Play all motion ▷':'Pause all motion Ⅱ';master.setAttribute('aria-pressed',String(paused));$('.tv-screen-meta>span:last-child').textContent=paused?'Ⅱ PAUSED':'● PLAY';if(paused){channelAnimation?.cancel();document.querySelectorAll('[data-tilt]').forEach(el=>el.style.removeProperty('transform'));}}
 master.onclick=()=>$('#motion-toggle').click();document.addEventListener('portfolio-motion-change',syncMotion);syncMotion();

 // The fan scrolls natively on touch and with a pointer drag on desktop.
 const deck=$('#deck-track');
 deck.innerHTML=projects.map((p,i)=>`<button class="deck-card deck-${p.theme}" data-deck-channel="${i}" style="--card-angle:${[-11,-6,-2,5,10,4,-6,-10][i]}deg;--float-delay:${i*-.6}s" aria-label="Tune in to ${escape(p.name)}"><span class="deck-top">CH ${String(i+1).padStart(2,'0')}<span>${escape(p.category.split(' ')[0].toUpperCase())}</span></span><span class="deck-graphic" aria-hidden="true">${icon(p.theme)}</span><span class="deck-name">${escape(p.name)}</span><span class="deck-bottom">${escape(p.tags[0])}<span>↗</span></span></button>`).join('');
 let drag=null,ignoreClick=false;
 deck.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.button!==0)return;drag={x:e.clientX,scroll:deck.scrollLeft,moved:false};});
 deck.addEventListener('pointermove',e=>{if(!drag)return;const distance=e.clientX-drag.x;if(Math.abs(distance)>6){drag.moved=true;deck.classList.add('is-dragging');deck.setPointerCapture(e.pointerId);deck.scrollLeft=drag.scroll-distance;}});
 function endDrag(){if(!drag)return;ignoreClick=drag.moved;drag=null;deck.classList.remove('is-dragging');setTimeout(()=>ignoreClick=false,0);}
 deck.addEventListener('pointerup',endDrag);deck.addEventListener('pointercancel',endDrag);deck.addEventListener('lostpointercapture',endDrag);
 deck.addEventListener('click',e=>{if(ignoreClick){e.preventDefault();return;}const card=e.target.closest('[data-deck-channel]');if(card){selectChannel(Number(card.dataset.deckChannel));if(!$('.broadcast').classList.contains('scroll-story'))$('#playground').scrollIntoView({behavior:canMove()?'smooth':'instant'});}});
 deck.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const cards=[...deck.querySelectorAll('button')],current=cards.indexOf(document.activeElement),next=Math.max(0,Math.min(cards.length-1,current+(e.key==='ArrowRight'?1:-1)));cards[next].focus({preventScroll:true});cards[next].scrollIntoView({behavior:canMove()?'smooth':'instant',block:'nearest',inline:'center'});}});

 // Native document scrolling drives a sticky player; no wheel or touch scroll is cancelled.
 const section=$('#playground'),pin=document.createElement('div');pin.className='broadcast-pin';
 while(section.firstChild)pin.append(section.firstChild);section.append(pin);
 const toolbar=document.createElement('div');toolbar.className='story-toolbar';toolbar.innerHTML='<label class="story-switch"><input id="scroll-projects" type="checkbox" checked><span aria-hidden="true"></span>Scroll through projects</label><span class="story-hint">SCROLL TO TUNE <b id="story-position">01 / 08</b></span><a href="#work" id="story-escape">Skip to project grid ↓</a>';pin.append(toolbar);
 let storyEnabled=false,storyStart=0,storyStep=0,storyTravel=0,scrollFrame=null,userStory=true;
 function measureStory(){
  const wasInside=storyEnabled&&scrollY>=storyStart&&scrollY<storyStart+storyTravel;
  storyEnabled=userStory&&!reduced.matches&&innerHeight>=700&&innerWidth>=350;
  section.classList.toggle('scroll-story',storyEnabled);$('#scroll-projects').checked=storyEnabled;
  $('#scroll-projects').disabled=reduced.matches||innerHeight<700||innerWidth<350;
  $('.story-hint').firstChild.textContent=storyEnabled?'SCROLL TO TUNE ':'USE THE CHANNEL CONTROLS ';
  storyStep=Math.round(Math.max(320,innerHeight*.64));storyTravel=storyStep*(projects.length-1)+storyStep*.6;
  section.style.setProperty('--story-height',`${innerHeight+storyTravel}px`);section.style.setProperty('--stage-height',`${innerHeight}px`);
  storyStart=section.getBoundingClientRect().top+scrollY;
  if(wasInside&&!storyEnabled)window.scrollTo({top:storyStart,behavior:'instant'});
 }
 function onStoryScroll(){scrollFrame=null;if(!storyEnabled)return;const progress=scrollY-storyStart;if(progress<0||progress>storyTravel+innerHeight)return;const index=Math.max(0,Math.min(projects.length-1,Math.floor(progress/storyStep)));if(index!==active)showChannel(index);section.style.setProperty('--story-progress',String(Math.max(0,Math.min(1,progress/storyTravel))));}
 window.addEventListener('scroll',()=>{if(scrollFrame===null)scrollFrame=requestAnimationFrame(onStoryScroll);},{passive:true});
 storySeek=index=>{if(storyEnabled)window.scrollTo({top:storyStart+index*storyStep+1,behavior:'instant'});};
 $('#scroll-projects').onchange=e=>{userStory=e.target.checked;measureStory();if(storyEnabled)storySeek(active);};
 $('#story-escape').onclick=e=>{e.preventDefault();window.scrollTo({top:$('#work').getBoundingClientRect().top+scrollY-25,behavior:'instant'});$('#work').setAttribute('tabindex','-1');$('#work').focus({preventScroll:true});};
 let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(measureStory,100);});reduced.addEventListener('change',measureStory);measureStory();
 document.fonts?.ready.then(measureStory);window.addEventListener('load',measureStory,{once:true});

 const projectDialog=$('#project-dialog');
 document.addEventListener('click',e=>{const trigger=e.target.closest('[data-project]');if(!trigger)return;const p=projects.find(p=>p.slug===trigger.dataset.project);if(!p)return;
  $('#project-dialog-body').innerHTML=`<div class="project-art ${p.theme}">${concept(p)}</div><span class="eyebrow">${escape(p.category.toUpperCase())} / ${escape(p.status.toUpperCase())}</span><h2 id="project-dialog-title">${escape(p.name)}</h2><p class="notes-short">${escape(p.short)}</p><h3>The idea</h3><p>${escape(p.description)}</p><h3>The toolkit</h3><div class="tags">${p.tags.map(t=>`<span>${escape(t)}</span>`).join('')}</div><p class="notes-disclosure">Illustration is a visual concept. The repository is the source for implementation and current status.</p><div class="notes-actions"><a class="button dark" href="${projectUrl(p)}" target="_blank" rel="noreferrer">View repository ↗</a><button id="ask-project" class="text-button">Ask the assistant ↗</button></div>`;
  $('#ask-project').onclick=()=>{projectDialog.close();openChat(true);send(`Tell me about ${p.name}`);};projectDialog.showModal();
 });$('#close-project').onclick=()=>projectDialog.close();projectDialog.addEventListener('click',e=>{if(e.target===projectDialog){const r=projectDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)projectDialog.close();}});

 const observed=new WeakSet(),revealObserver=new IntersectionObserver(entries=>{entries.forEach(({target,isIntersecting})=>{if(isIntersecting){target.classList.add('is-visible');revealObserver.unobserve(target);}});},{threshold:.08});
 function enhance(){document.querySelectorAll('.section-heading,.project-card,.about>div,.process-grid article,.toolkit,.contact h2').forEach((el,i)=>{if(observed.has(el))return;observed.add(el);el.classList.add('reveal');el.style.setProperty('--reveal-delay',`${Math.min(i%2,1)*80}ms`);revealObserver.observe(el);});document.querySelectorAll('.project-art').forEach(el=>{if(el.dataset.tilt)return;el.dataset.tilt='true';el.addEventListener('pointermove',e=>{if(!canMove()||e.pointerType==='touch')return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateX(${-y*5}deg) rotateY(${x*7}deg)`;});el.addEventListener('pointerleave',()=>el.style.removeProperty('transform'));});}
 enhance();document.addEventListener('portfolio-render',enhance);
 const broadcastObserver=new IntersectionObserver(([entry])=>$('.broadcast').classList.toggle('player-offscreen',!entry.isIntersecting),{threshold:.01});broadcastObserver.observe($('.broadcast'));
 new IntersectionObserver(([entry])=>$('.project-deck').classList.toggle('deck-offscreen',!entry.isIntersecting),{threshold:.01}).observe($('.project-deck'));
 document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('page-hidden',document.hidden));
}
