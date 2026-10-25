import {profile, projects, archive, projectUrl} from './data.js';
import {answerLocally} from './knowledge.js';
import {initMotion} from './motion.js';
const $=s=>document.querySelector(s);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const chart='<svg viewBox="0 0 300 80" aria-hidden="true"><path d="M0 65H300M0 40H300M0 15H300" stroke="currentColor" opacity=".12"/><path d="M0 65L25 52L45 60L75 25L100 39L130 15L160 32L185 20L215 33L245 9L270 16L300 2" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M0 65L25 52L45 60L75 25L100 39L130 15L160 32L185 20L215 33L245 9L270 16L300 2V80H0Z" fill="currentColor" opacity=".08"/></svg>';
function concept(p){
 const bar=`<div class="windowbar"><i></i><i></i><i></i><span>${escape(p.name.toLowerCase())} / concept</span></div>`;
 const visuals={
 demo:'<strong>Your next demo. Ready.</strong><div class="concept-label">ONE WORKFLOW. EVERY STEP.</div><div class="concept-flow"><span>Knowledge</span><i>→</i><span>Orchestrate</span><i>→</i><span>Demo</span></div><div class="concept-label">UPLOAD · UNDERSTAND · BUILD</div>',
 gym:'<strong>Small habits. Stronger members.</strong><div class="concept-grid"><div><b>↗</b>ENGAGEMENT</div><div><b>✳</b>RETENTION</div><div><b>✓</b>CHECK-INS</div></div>'+chart,
 aqi:'<div class="concept-label">AIR QUALITY / FORECAST EXPLORER</div><strong style="margin-top:12px">A clearer view ahead.</strong>'+chart+'<div class="concept-label">COLLECT → TRAIN → FORECAST</div>',
 automl:'<strong>Good models. Less guesswork.</strong><div class="concept-flow"><span>Dataset</span><i>→</i><span>Train & tune</span><i>→</i><span>Evaluate</span></div><div class="concept-grid"><div>PREPROCESSING</div><div>SELECTION</div><div>PERSISTENCE</div></div>',
 psx:'<div class="concept-label">PAKISTAN STOCK EXCHANGE</div><strong style="margin-top:12px">A more considered portfolio.</strong><div class="concept-grid"><div><b>01</b>BUSINESS</div><div><b>02</b>RATIOS</div><div><b>03</b>REVIEW</div></div>'+chart,
 qa:'<strong>The handbook, made searchable.</strong><div class="concept-question">Ask a policy question ↗</div><div class="concept-lines"></div><div class="concept-lines"></div><div class="concept-lines"></div><div class="concept-label">TF-IDF · SIMHASH · MINHASH</div>',
 research:'<div class="concept-label">RESEARCH / TECHNOLOGY MARKET CYCLES</div><strong style="margin-top:12px">A familiar kind of future?</strong>'+chart+'<div class="concept-label">VALUATION · CONCENTRATION · CONTEXT</div>'
 };
 return p.theme==='gift'?'<div class="gift-art">The moments<br>we keep.<small>KEEPSAKE / ARTWORK CONCEPT</small></div>':`<div class="concept">${bar}${visuals[p.theme]}</div>`;
}
function renderProjects(filter='All'){
 const list=projects.filter(p=>filter==='All'||p.category===filter);
 $('#projects').innerHTML=list.map(p=>`<article class="project-card"><a href="${projectUrl(p)}" target="_blank" rel="noreferrer" aria-label="Explore ${escape(p.name)} source on GitHub"><div class="project-art ${p.theme}"><div class="art-meta"><span>${String(projects.indexOf(p)+1).padStart(2,'0')} / ${escape(p.category.toUpperCase())}</span><span>${escape(p.status.toUpperCase())}</span></div>${concept(p)}<span class="art-arrow">↗</span></div><div class="project-title"><h3>${escape(p.name)}</h3><span>EXPLORE PROJECT ↗</span></div></a><p>${escape(p.description)}</p><div class="tags">${p.tags.map(t=>`<span>${escape(t)}</span>`).join('')}</div></article>`).join('');
 $('#project-count').textContent=String(list.length).padStart(2,'0')+' PROJECTS';
 document.querySelectorAll('.project-card').forEach((card,i)=>{const button=document.createElement('button');button.className='project-notes';button.dataset.project=list[i].slug;button.textContent='Behind the build ↗';card.append(button);});
 document.dispatchEvent(new Event('portfolio-render'));
}
renderProjects();
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});renderProjects(b.dataset.filter);}));
$('#archive-list').innerHTML=archive.map(name=>`<a href="${profile.github}/${name}" target="_blank" rel="noreferrer">${escape(name.replaceAll('-',' ').replaceAll('_',' '))} ↗</a>`).join('');
$('#skills').innerHTML=profile.skills.map(s=>`<span>${escape(s)}</span>`).join('');
$('#year').textContent=new Date().getFullYear();
window.addEventListener('scroll',()=>{$('.progress').style.width=`${window.scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*100}%`;},{passive:true});

// The spiral is drawn locally; no downloaded animation or third-party assets.
const canvas=$('#vortex'),ctx=canvas.getContext('2d'),motion=matchMedia('(prefers-reduced-motion: reduce)');
let paused=motion.matches,frame=0,raf=null,visible=true,phase=0;
function drawVortex(){
 const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
 const w=rect.width,h=rect.height;if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);const cx=w/2,cy=h/2,r=Math.min(w,h)*.44;
 for(let arm=0;arm<78;arm++){
  ctx.beginPath();
  for(let j=0;j<=100;j++){const t=j/100;const rad=r*(.16+.84*t);const a=arm/78*Math.PI*2+phase+2.7*Math.pow(1-t,1.1);const x=cx+Math.cos(a)*rad;const y=cy+Math.sin(a)*rad*.92; j?ctx.lineTo(x,y):ctx.moveTo(x,y);}
  ctx.strokeStyle=arm%6===0?'#536331':'#93b74a';ctx.lineWidth=arm%6===0?1.3:.7;ctx.globalAlpha=.4+.3*(Math.sin(arm)+1)/2;ctx.stroke();
 }
 ctx.globalAlpha=1;ctx.beginPath();ctx.arc(cx,cy,r*.16,0,Math.PI*2);ctx.fillStyle='#f5f4eb';ctx.fill();
 if(!paused&&visible&&!document.hidden){phase+=.0018;frame++;raf=requestAnimationFrame(drawVortex);}else raf=null;
}
function updateMotion(){const b=$('#motion-toggle');b.textContent=paused?'Play motion ▷':'Pause motion Ⅱ';b.setAttribute('aria-pressed',String(paused));document.documentElement.classList.toggle('motion-paused',paused);document.dispatchEvent(new CustomEvent('portfolio-motion-change',{detail:{paused}}));if(raf)cancelAnimationFrame(raf);drawVortex();}
$('#motion-toggle').onclick=()=>{paused=!paused;updateMotion();};motion.addEventListener('change',()=>{paused=motion.matches;updateMotion();});
new ResizeObserver(()=>{if(raf)cancelAnimationFrame(raf);drawVortex();}).observe(canvas);
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(raf)cancelAnimationFrame(raf);drawVortex();}).observe(canvas);
document.addEventListener('visibilitychange',()=>{if(raf)cancelAnimationFrame(raf);drawVortex();});updateMotion();

let conversation=[],busy=false,chatController=null,chatGeneration=0;
try{const saved=JSON.parse(sessionStorage.getItem('sajjad-chat')||'[]');conversation=Array.isArray(saved)?saved.filter(m=>['user','assistant'].includes(m.role)&&typeof m.text==='string').slice(-30):[];}catch{}
const greeting={role:'assistant',text:'Hi, I’m Sajjad’s portfolio assistant. Explore the work, ask about the toolkit, or turn your idea into a project brief. Where would you like to start?',sources:[]};
if(!conversation.length)conversation=[greeting];
function persist(){try{sessionStorage.setItem('sajjad-chat',JSON.stringify(conversation.slice(-30)));}catch{}}
function renderMessages(){
 $('#messages').replaceChildren();
 for(const m of conversation){const el=document.createElement('div');el.className='message '+m.role;el.textContent=m.text;
  if(m.sources?.length){const links=document.createElement('div');links.className='source-links';for(const source of m.sources){try{const u=new URL(source.url);if(u.protocol!=='https:'||u.hostname!=='github.com')continue;const a=document.createElement('a');a.href=u.href;a.target='_blank';a.rel='noreferrer';a.textContent=source.title+' ↗';links.append(a);}catch{}}el.append(links);}
  if(m.note){const note=document.createElement('small');note.textContent=m.note;el.append(note);}$('#messages').append(el);
 }
 if(busy){const el=document.createElement('div');el.className='message';el.textContent='Thinking through the work…';el.setAttribute('role','status');$('#messages').append(el);}$('#messages').scrollTop=$('#messages').scrollHeight;
}
function setChat(open){$('#chat-panel').hidden=!open;$('#chat-launcher').setAttribute('aria-expanded',String(open));if(open){renderMessages();$('#message-input').focus();}else $('#chat-launcher').focus();}
$('#chat-launcher').onclick=()=>setChat($('#chat-panel').hidden);$('#close-chat').onclick=()=>setChat(false);document.querySelectorAll('[data-chat]').forEach(b=>b.onclick=()=>setChat(true));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#brief-dialog').open&&!$('#chat-panel').hidden)setChat(false);});
async function send(question){
 if(busy||!question.trim())return;question=question.trim().slice(0,1500);conversation.push({role:'user',text:question});conversation=conversation.slice(-30);persist();busy=true;const generation=chatGeneration;$('#chat-form button').disabled=true;$('#message-input').value='';renderMessages();
 try{chatController=new AbortController();const timeout=setTimeout(()=>chatController?.abort(),25000);let result;
  try{const config=await configReady;if(!config.server){result={...answerLocally(question),mode:'knowledge'};}else{const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:conversation.slice(-12).map(m=>({role:m.role,content:m.text}))}),signal:chatController.signal});if(!response.ok)throw Error(response.status===429?'Too many requests. Please wait a minute before trying again.':'The assistant could not connect.');result=await response.json();}}finally{clearTimeout(timeout);}
  if(generation!==chatGeneration)return;conversation.push({role:'assistant',text:result.text,sources:result.sources,note:result.mode==='ai'?'AI response · verify details in the source repositories.':result.notice||'Portfolio knowledge mode'});$('#chat-mode').textContent=result.mode==='ai'?'AI assistant · grounded in the portfolio':'Portfolio knowledge assistant';
 }catch(error){if(generation!==chatGeneration)return;const local=answerLocally(question);conversation.push({role:'assistant',...local,note:error.message.includes('Too many')?error.message:'AI connection unavailable. Answered from the local portfolio knowledge.'});}
 finally{if(generation===chatGeneration){busy=false;chatController=null;$('#chat-form button').disabled=false;persist();renderMessages();$('#message-input').focus();}}
}
$('#chat-form').onsubmit=e=>{e.preventDefault();send($('#message-input').value);};$('#message-input').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(e.target.value);}};document.querySelectorAll('[data-question]').forEach(b=>b.onclick=()=>send(b.dataset.question));
$('#new-chat').onclick=()=>{chatGeneration++;chatController?.abort();busy=false;$('#chat-form button').disabled=false;conversation=[greeting];persist();renderMessages();$('#message-input').focus();};
function download(text,name){const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('#export-chat').onclick=()=>download(conversation.map(m=>`${m.role==='user'?'You':'Assistant'}: ${m.text}${m.sources?.length?'\nSources: '+m.sources.map(s=>s.url).join('\n'):''}`).join('\n\n'),'sajjad-portfolio-conversation.txt');
const briefDialog=$('#brief-dialog'),briefForm=$('#brief-form');
function openBrief(){briefDialog.showModal();}
$('#start-brief').onclick=openBrief;$('#brief-tab').onclick=openBrief;
try{const draft=JSON.parse(sessionStorage.getItem('sajjad-brief')||'{}');for(const key of ['name','idea','budget','timeline'])if(typeof draft[key]==='string')briefForm.elements[key].value=draft[key];}catch{}
briefForm.addEventListener('input',()=>{try{sessionStorage.setItem('sajjad-brief',JSON.stringify(Object.fromEntries(new FormData(briefForm))));}catch{}});
function briefText(){const data=Object.fromEntries(new FormData(briefForm));return `PROJECT BRIEF FOR SAJJAD UR REHMAN\n\nName: ${data.name||'Not provided'}\n\nIdea & goals:\n${data.idea}\n\nBudget: ${data.budget||'To discuss'}\nTimeline: ${data.timeline||'To discuss'}\n\nPrepared via Sajjad’s portfolio.\nConnect: ${profile.github}`;}
$('#copy-brief').onclick=async()=>{if(!briefForm.reportValidity())return;try{await navigator.clipboard.writeText(briefText());$('#brief-status').textContent='Brief copied. You can now share it with Sajjad.';}catch{$('#brief-status').textContent='Clipboard unavailable. Use Download to save your brief.';}};
$('#download-brief').onclick=()=>{if(!briefForm.reportValidity())return;download(briefText(),'project-brief-for-sajjad.txt');$('#brief-status').textContent='Brief downloaded. Nothing has been sent automatically.';};
const configReady=fetch('/api/config',{signal:AbortSignal.timeout(5000)}).then(async r=>r.ok?{...await r.json(),server:true}:{server:false}).then(config=>{if(config.email){$('#contact-link').href=`mailto:${config.email}`;$('#contact-link').textContent='Send an email ↗';$('#contact-link').removeAttribute('target');}if(config.ai)$('#chat-mode').textContent='AI assistant · grounded in the portfolio';return config;}).catch(()=>({server:false}));
const spiralPaths=Array.from({length:18},(_,arm)=>{const points=Array.from({length:35},(_,j)=>{const t=j/34,r=3+10*t,a=arm/18*Math.PI*2+2.7*(1-t);return `${j?'L':'M'}${(16+Math.cos(a)*r).toFixed(2)},${(16+Math.sin(a)*r).toFixed(2)}`;}).join(' ');return `<path d="${points}"/>`;}).join('');
document.querySelectorAll('.chat-icon').forEach(icon=>{icon.innerHTML=`<svg viewBox="0 0 32 32" aria-hidden="true">${spiralPaths}</svg>`;});
initMotion({projects,projectUrl,escape,concept,openChat:setChat,send});
