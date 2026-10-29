import {icon, getSkillIcon} from './icons.js';
export function initStudio(){
 const $=s=>document.querySelector(s),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const canMove=()=>!reduce.matches&&!document.documentElement.classList.contains('motion-paused');
 $('.about>div:first-child').innerHTML=`<span class="eyebrow">02 / THE PERSON BEHIND THE CODE</span><div class="automation-art"><div class="automation-grid"></div><canvas class="avatar-neural-canvas" aria-hidden="true"></canvas><div class="avatar-photo-frame"><div class="avatar-glow-ring"></div><div class="avatar-glow-ring ring-two"></div><img src="./assets/avatar.jpg" alt="SR — AI automation engineer and full-stack builder" class="avatar-photo" width="400" height="400" loading="lazy"/><div class="avatar-scan-line"></div></div><div class="automation-orbit orbit-one"><i></i></div><div class="automation-orbit orbit-two"><i></i></div><div class="automation-node task-node"><span>01</span><b>INGEST</b><i>↥</i></div><div class="automation-node ai-node"><span>02</span><b>AI REASONING</b><i>✳</i></div><div class="automation-node done-node"><span>03</span><b>AUTOMATE</b><i>✓</i></div><div class="automation-node eng-node"><span>04</span><b>DEPLOY</b><i>↗</i></div><div class="avatar-code-spark spark-1" aria-hidden="true"><span>const</span> flow = <em>agent</em>({</div><div class="avatar-code-spark spark-2" aria-hidden="true">task: <em>"automate"</em>,</div><div class="avatar-code-spark spark-3" aria-hidden="true">result: <em>"done ✓"</em></div><span class="automation-caption caption-top">NOTICE THE PATTERN.</span><span class="automation-caption caption-bottom">ENGINEER THE FLOW.</span></div><span class="eyebrow">CURIOUS BY DEFAULT. BUILDER BY CHOICE.</span>`;
 /* Avatar neural network canvas animation */
 const neuralCanvas=$('.avatar-neural-canvas');
 if(neuralCanvas){const nctx=neuralCanvas.getContext('2d');let nW=0,nH=0,nT=0,nRaf=null,nVis=false;
  const particles=[];for(let i=0;i<40;i++)particles.push({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.002,vy:(Math.random()-.5)*.002,r:Math.random()*1.5+.5});
  function drawNeural(){nRaf=null;const rect=neuralCanvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);
   if(nW!==rect.width||nH!==rect.height){nW=rect.width;nH=rect.height;neuralCanvas.width=nW*dpr;neuralCanvas.height=nH*dpr;}
   nctx.setTransform(dpr,0,0,dpr,0,0);nctx.clearRect(0,0,nW,nH);
   const cx=nW*.5,cy=nH*.5,maxR=Math.min(nW,nH)*.48;
   for(const p of particles){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>1)p.vx*=-1;if(p.y<0||p.y>1)p.vy*=-1;
    const px=cx+(p.x-.5)*nW*.9,py=cy+(p.y-.5)*nH*.9;
    const distFromCenter=Math.hypot(px-cx,py-cy);
    if(distFromCenter>maxR)continue;
    for(const q of particles){const qx=cx+(q.x-.5)*nW*.9,qy=cy+(q.y-.5)*nH*.9;const d=Math.hypot(px-qx,py-qy);
     if(d<maxR*.35&&d>0){const alpha=.12*(1-d/(maxR*.35));nctx.strokeStyle=`rgba(184,221,113,${alpha})`;nctx.lineWidth=.6;nctx.beginPath();nctx.moveTo(px,py);nctx.lineTo(qx,qy);nctx.stroke();}}
    const glow=.3+.2*Math.sin(nT*2+p.x*10);nctx.fillStyle=`rgba(191,235,119,${glow})`;nctx.beginPath();nctx.arc(px,py,p.r*dpr*.6,0,Math.PI*2);nctx.fill();}
   if(nVis&&canMove()&&!document.hidden){nT+=.008;nRaf=requestAnimationFrame(drawNeural);}}
  function refreshNeural(){if(nRaf)cancelAnimationFrame(nRaf);drawNeural();}
  new IntersectionObserver(([e])=>{nVis=e.isIntersecting;refreshNeural();},{threshold:.01}).observe(neuralCanvas);
  new ResizeObserver(refreshNeural).observe(neuralCanvas);
  document.addEventListener('portfolio-motion-change',refreshNeural);
  document.addEventListener('visibilitychange',refreshNeural);
 }
 $('.about').classList.add('studio-about');
 $('.about>div:last-child').innerHTML=`<div class="engineer-dashboard">
  <div class="engineer-hero-header">
   <div class="engineer-titles">
    <h2>Software engineer.<br><em>Built to hold up.</em></h2>
   </div>
   <div class="engineer-actions">
    <a href="#playground" class="eng-btn eng-btn-white">View my work</a>
    <a href="#contact" class="eng-btn eng-btn-dark">Connect</a>
   </div>
  </div>
  <div class="engineer-timeline" aria-label="Experience timeline">
   <div class="timeline-header">
    <span class="timeline-role">Software engineer</span>
    <span class="timeline-now">Now</span>
   </div>
   <div class="timeline-rail"><div class="timeline-fill"><span class="timeline-head" aria-hidden="true"></span><i></i></div></div>
   <div class="timeline-years"><span>2022</span><span>2023</span><span>2024</span><span>2025</span><span>2026</span></div>
  </div>
  <div class="engineer-stats-grid">
   <div class="eng-stat-card"><span class="eng-stat-val">8+</span><span class="eng-stat-desc">projects shipped</span><div class="eng-stat-line"><i style="--fill:100%"></i></div></div>
   <div class="eng-stat-card"><span class="eng-stat-val">98%</span><span class="eng-stat-desc">peak accuracy</span><div class="eng-stat-line"><i style="--fill:98%"></i></div></div>
   <div class="eng-stat-card"><span class="eng-stat-val">5</span><span class="eng-stat-desc">certifications</span><div class="eng-stat-line"><i style="--fill:100%"></i></div></div>
  </div>
  <div class="engineer-pipelines-grid">
   <div class="eng-pipeline-card">
    <span class="pipeline-card-title">Convoa</span>
    <div class="pipeline-flow-wrap">
     <div class="pipeline-flow-row"><span class="flow-pill">Intake</span><span class="flow-connector"><i></i></span><span class="flow-pill">Agents</span></div>
     <div class="pipeline-flow-row"><span class="flow-pill">Voice</span></div>
    </div>
    <div class="audio-equalizer" aria-label="Audio wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
   </div>
   <div class="eng-pipeline-card">
    <span class="pipeline-card-title">Bloom</span>
    <div class="pipeline-flow-wrap">
     <div class="pipeline-flow-row"><span class="flow-pill">Search</span><span class="flow-connector"><i></i></span><span class="flow-pill">Rerank</span><span class="flow-connector"><i></i></span><span class="flow-pill">Answer</span></div>
    </div>
   </div>
   <div class="eng-pipeline-card">
    <span class="pipeline-card-title">AQI Forecast</span>
    <div class="pipeline-flow-wrap">
     <div class="pipeline-flow-row"><span class="flow-pill">Data</span><span class="flow-connector"><i></i></span><span class="flow-pill">Model</span><span class="flow-connector"><i></i></span><span class="flow-pill">App</span></div>
    </div>
   </div>
  </div>
 </div>`;

 const serviceData=[
  {theme:'ai',title:'AGENTIC WORKFLOW ENGINE · AUTONOMOUS ORCHESTRATION',foot:'INGEST (RAG) → MULTI-AGENT REASONING → TOOL EXECUTION',visual:`<div class="ai-agent-stage"><svg class="ai-agent-wires" viewBox="0 0 540 180" preserveAspectRatio="none"><defs><linearGradient id="aiWireGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#7ea844" stop-opacity="0.3"/><stop offset="50%" stop-color="#c7f653" stop-opacity="0.95"/><stop offset="100%" stop-color="#7ea844" stop-opacity="0.3"/></linearGradient><filter id="aiGlow"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M120 48 C 200 48, 205 90, 270 90" stroke="#7ea84433" stroke-width="1.5" fill="none"/><path d="M120 132 C 200 132, 205 90, 270 90" stroke="#7ea84433" stroke-width="1.5" fill="none"/><path d="M270 90 C 335 90, 340 48, 420 48" stroke="#7ea84433" stroke-width="1.5" fill="none"/><path d="M270 90 C 335 90, 340 132, 420 132" stroke="#7ea84433" stroke-width="1.5" fill="none"/><path class="ai-wire-pulse" d="M120 48 C 200 48, 205 90, 270 90" stroke="url(#aiWireGrad)" stroke-width="2" fill="none" filter="url(#aiGlow)"/><path class="ai-wire-pulse wire-delay-1" d="M120 132 C 200 132, 205 90, 270 90" stroke="url(#aiWireGrad)" stroke-width="2" fill="none" filter="url(#aiGlow)"/><path class="ai-wire-pulse wire-delay-2" d="M270 90 C 335 90, 340 48, 420 48" stroke="url(#aiWireGrad)" stroke-width="2" fill="none" filter="url(#aiGlow)"/><path class="ai-wire-pulse wire-delay-3" d="M270 90 C 335 90, 340 132, 420 132" stroke="url(#aiWireGrad)" stroke-width="2" fill="none" filter="url(#aiGlow)"/></svg><div class="ai-node-col ai-input-col"><div class="ai-node-card ai-node-rag"><span class="ai-card-badge"><i></i> RAG PIPELINE</span><div class="ai-card-content">${icon('qa')}<div><b>Knowledge Base</b><small>Vector DB · Hybrid Search</small></div></div></div><div class="ai-node-card ai-node-context"><span class="ai-card-badge"><i></i> CONTEXT</span><div class="ai-card-content">${icon('demo')}<div><b>User Intent & State</b><small>Event Trigger · Schema</small></div></div></div></div><div class="ai-core-hub"><div class="ai-core-rings"><div class="ai-orbit-ring ring-outer"></div><div class="ai-orbit-ring ring-inner"></div></div><div class="ai-core-sphere">${icon('brain')}<span class="ai-core-title">Agent Core</span></div><div class="ai-telemetry-tag"><span class="pulse-dot"></span><span>REASONING · 180ms</span></div></div><div class="ai-node-col ai-output-col"><div class="ai-node-card ai-node-action"><span class="ai-card-badge badge-active"><i></i> TOOL EXECUTION</span><div class="ai-card-content">${icon('automl')}<div><b>Autonomous Action</b><small>APIs · SQL · Webhooks</small></div></div></div><div class="ai-node-card ai-node-verified"><span class="ai-card-badge badge-done"><i></i> VERIFIED</span><div class="ai-card-content">${icon('code')}<div><b>Output Delivery</b><small>98.4% Accuracy · Guardrails</small></div></div></div></div></div>`},
  {theme:'web',title:'ONE PRODUCT. EVERY LAYER.',foot:'INTERFACE / SYSTEMS / DATA',visual:`<div class="blueprint-flow">${[['code','Interface'],['demo','API & logic'],['automl','Data']].map(([name,label],j)=>`<div class="blueprint-node" style="--node-delay:${j*-1.2}s">${icon(name)}<b>${label}</b></div>${j<2?'<div class="blueprint-connector"><i></i></div>':''}`).join('')}</div>`},
  {theme:'data',title:'FROM RAW DATA TO A CLEARER PICTURE.',foot:'COLLECT / MODEL / UNDERSTAND',visual:`<div class="data-scene"><div class="data-axis"><span>SIGNAL</span><span>OBSERVATIONS →</span></div><div class="data-bars">${[26,43,36,58,48,69,62,83,76,96].map((h,j)=>`<i style="--height:${h}%;--bar-delay:${j*-.3}s"></i>`).join('')}</div><svg class="data-trend" viewBox="0 0 500 150" preserveAspectRatio="none"><path d="M0 125C40 125 45 95 90 105S155 70 200 75S280 35 325 45S420 15 500 8"/><circle cx="325" cy="45" r="5"/><circle cx="500" cy="8" r="5"/></svg><span class="data-badge">${icon('automl')}Patterns into insight</span></div>`}
];
 document.querySelectorAll('.services>details').forEach((detail,i)=>{
  const p=detail.querySelector('p'),body=document.createElement('div'),data=serviceData[i];detail.dataset.service=data.theme;body.className='service-body';p.before(body);body.append(p);
  body.insertAdjacentHTML('beforeend',`<div class="service-blueprint" aria-hidden="true"><span>${data.title}</span>${data.visual}<div class="blueprint-foot"><i></i>${data.foot}</div></div>`);
  let entrance;detail.addEventListener('toggle',()=>{if(detail.open){document.querySelectorAll('.services>details').forEach(other=>{if(other!==detail)other.open=false;});entrance?.cancel();if(canMove())entrance=body.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'});}});
  document.addEventListener('portfolio-motion-change',()=>{if(!canMove())entrance?.cancel();});
 });

 const processIcons=['qa','code','demo','automl'];document.querySelectorAll('.process-symbol').forEach((el,i)=>el.innerHTML=icon(processIcons[i]));
 $('.process-grid').insertAdjacentHTML('afterbegin','<div class="process-line" aria-hidden="true"><span></span></div>');
 const skillGroups=[['01','Interfaces',['React','TanStack Start','TypeScript','JavaScript']],['02','Systems',['FastAPI','Node.js','Express','PostgreSQL','Supabase','MongoDB']],['03','Intelligence',['Python','Pandas','NumPy','scikit-learn','LangGraph','Vector search']],['04','Foundations',['SQL','Java','Docker','Git']]];
 $('#skills').innerHTML=skillGroups.map(([n,title,skills])=>`<article class="toolkit-group"><header><span>${n}</span><h3>${title}</h3><span>↗</span></header><div>${skills.map((skill,i)=>`<span class="skill-pill" style="--skill-delay:${i*-.6}s"><i class="skill-icon" aria-hidden="true">${getSkillIcon(skill)}</i><span class="skill-label">${skill}</span></span>`).join('')}</div></article>`).join('');
 $('.toolkit>.eyebrow').insertAdjacentHTML('afterend','<h2>The tools change.<br><em>The curiosity stays.</em></h2>');
 const contact=$('#contact');contact.insertAdjacentHTML('afterbegin','<canvas id="contact-field" aria-hidden="true"></canvas><div class="contact-orbit orbit-one" aria-hidden="true"></div><div class="contact-orbit orbit-two" aria-hidden="true"></div><span class="contact-stamp" aria-hidden="true">GOOD THINGS<br>START WITH<br><em>a conversation.</em></span>');
 contact.querySelector('.eyebrow').textContent='YOUR NEXT IDEA STARTS HERE / LET’S CONNECT';
 contact.insertAdjacentHTML('beforeend','<div class="contact-endnote"><span>UNDERSTAND. BUILD. KEEP IMPROVING.</span><span>MADE WITH INTENTION. AND A LITTLE CURIOSITY.</span></div>');
 const canvas=$('#contact-field'),ctx=canvas.getContext('2d');let raf=null,visible=false,t=0,width=0,height=0;
 function draw(){raf=null;const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);if(width!==rect.width||height!==rect.height){width=rect.width;height=rect.height;canvas.width=width*dpr;canvas.height=height*dpr;}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);const cx=width*.78,cy=height*.45,r=Math.min(width*.3,height*.64);const points=[];
  for(let i=0;i<65;i++){const a=i*2.39996+t*.08,dist=r*Math.sqrt(i/65);points.push({x:cx+Math.cos(a)*dist,y:cy+Math.sin(a)*dist*.7});}
  ctx.lineWidth=.7;for(let i=0;i<points.length;i++){const p=points[i];for(let j=i+1;j<points.length;j++){const q=points[j],distance=Math.hypot(p.x-q.x,p.y-q.y);if(distance<r*.24){ctx.strokeStyle=`rgba(184,221,113,${.14*(1-distance/(r*.24))})`;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}ctx.fillStyle=`rgba(191,235,119,${.14+.25*(Math.sin(t+i)+1)/2})`;ctx.beginPath();ctx.arc(p.x,p.y,i%8===0?2.6:1.1,0,Math.PI*2);ctx.fill();}
  if(visible&&canMove()&&!document.hidden){t+=.012;raf=requestAnimationFrame(draw);}
 }
 function refresh(){if(raf)cancelAnimationFrame(raf);draw();}
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;contact.classList.toggle('studio-offscreen',!visible);refresh();},{threshold:.01}).observe(contact);
 new ResizeObserver(refresh).observe(canvas);document.addEventListener('portfolio-motion-change',refresh);document.addEventListener('visibilitychange',refresh);reduce.addEventListener('change',refresh);
 const sectionObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>target.classList.toggle('studio-in-view',isIntersecting)),{threshold:.15});document.querySelectorAll('.studio-about,.process,.toolkit,.services').forEach(el=>sectionObserver.observe(el));
}
