import {icon} from './icons.js';
export function initStudio(){
 const $=s=>document.querySelector(s),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const canMove=()=>!reduce.matches&&!document.documentElement.classList.contains('motion-paused');
 $('.about>div:first-child').innerHTML=`<span class="eyebrow">02 / THE PERSON BEHIND THE CODE</span><div class="about-sculpture"><div class="sculpture-grid"></div><div class="sculpture-ring ring-a"></div><div class="sculpture-ring ring-b"></div><img src="./assets/curiosity-knot.png" alt="An original lime ceramic ribbon sculpture, looping into a continuous knot" loading="lazy" width="1024" height="1024"><span class="sculpture-label label-top">CURIOSITY IS THE STARTING POINT.</span><span class="sculpture-label label-bottom">ALWAYS A WORK IN PROGRESS ↗</span><span class="sculpture-pin pin-a">BUILD</span><span class="sculpture-pin pin-b">LEARN</span><span class="sculpture-pin pin-c">REPEAT</span></div><span class="eyebrow">A LITTLE EXPERIMENTATION GOES A LONG WAY.</span>`;
 $('.about').classList.add('studio-about');
 $('.about .focus').insertAdjacentHTML('beforeend','<div class="focus-signal" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>');

 const serviceData=[
  {theme:'web',title:'ONE PRODUCT. EVERY LAYER.',foot:'INTERFACE / SYSTEMS / DATA',visual:`<div class="blueprint-flow">${[['code','Interface'],['demo','API & logic'],['automl','Data']].map(([name,label],j)=>`<div class="blueprint-node" style="--node-delay:${j*-1.2}s">${icon(name)}<b>${label}</b></div>${j<2?'<div class="blueprint-connector"><i></i></div>':''}`).join('')}</div>`},
  {theme:'ai',title:'LESS REPETITION. MORE MOMENTUM.',foot:'KNOWLEDGE / REASONING / ACTION',visual:`<div class="neural-scene"><svg class="neural-wires" viewBox="0 0 500 170" preserveAspectRatio="none"><path d="M65 45C160 45 150 85 250 85S350 35 435 35M65 125C150 125 155 85 250 85S350 135 435 135M65 45Q250 170 435 35M65 125Q250 0 435 135"/></svg><span class="neural-input input-one">${icon('qa')}<b>Knowledge</b></span><span class="neural-input input-two">${icon('demo')}<b>Context</b></span><div class="neural-core"><i></i><i></i>${icon('brain')}<b>Reasoning</b></div><span class="neural-output output-one"><i></i> Decide</span><span class="neural-output output-two"><i></i> Act</span></div>`},
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
 $('#skills').innerHTML=skillGroups.map(([n,title,skills])=>`<article class="toolkit-group"><header><span>${n}</span><h3>${title}</h3><span>↗</span></header><div>${skills.map((skill,i)=>`<span style="--skill-delay:${i*-.6}s">${skill}</span>`).join('')}</div></article>`).join('');
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
