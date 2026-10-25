// Original procedural sculpture: no model downloads or animation dependencies.
export function initSignalLab(){
 const section=document.querySelector('#signal-lab'),canvas=section.querySelector('canvas'),ctx=canvas.getContext('2d');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),status=section.querySelector('#lab-status');
 const count=innerWidth<650?520:920,points=[];
 for(let i=0;i<count;i++){
  const u=i/count*Math.PI*2,v=i*2.399963;
  const a=2+Math.cos(3*u),k=[a*Math.cos(2*u),a*Math.sin(2*u),Math.sin(3*u)];
  // A thin tube around the knot adds depth without a dense mesh.
  k[0]+=.17*Math.cos(v);k[1]+=.17*Math.sin(v);k[2]+=.17*Math.sin(v+u);
  const y=1-2*(i+.5)/count,r=Math.sqrt(1-y*y),sphere=[2.55*r*Math.cos(v),2.55*y,2.55*r*Math.sin(v)];
  points.push({k,sphere,scatter:[Math.cos(v)*5,Math.sin(v*1.7)*5,Math.sin(v)*5]});
 }
 let width=0,height=0,raf=0,visible=false,last=0,angle=0,morph=0,target=0,burst=0,burstTarget=0,pointerX=0,pointerY=0,turnX=0,turnY=0,scatterTimer;
 const moving=()=>!reduce.matches&&!document.documentElement.classList.contains('motion-paused');
 function draw(now=0){
  raf=0;const animate=moving(),dt=last?Math.min((now-last)/1000,.04):.016;last=now;
  if(animate){angle+=dt*.13;morph+=(target-morph)*.055;burst+=(burstTarget-burst)*.065;turnX+=(pointerX-turnX)*.035;turnY+=(pointerY-turnY)*.035;}
  else{morph=target;burst=burstTarget;turnX=pointerX;turnY=pointerY;}
  const dpr=Math.min(devicePixelRatio||1,1.75);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
  const a=angle+turnX,b=.35+turnY,ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b),scale=Math.min(width,height)*.115;
  const projected=points.map(p=>{
   const base=p.k.map((n,i)=>n+(p.sphere[i]-n)*morph+p.scatter[i]*burst);
   const x=base[0]*ca-base[2]*sa,z=base[0]*sa+base[2]*ca,y=base[1]*cb-z*sb,depth=base[1]*sb+z*cb,f=8/(8+depth);
   return{x:width/2+x*scale*f,y:height*.51+y*scale*f,z:depth,f};
  }).sort((p,q)=>q.z-p.z);
  for(const p of projected){const opacity=.24+.65*Math.max(0,Math.min(1,(4-p.z)/8));ctx.fillStyle=`rgba(196,245,100,${opacity})`;ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.6,1.15*p.f),0,Math.PI*2);ctx.fill();}
  if(visible&&animate&&!document.hidden)raf=requestAnimationFrame(draw);
 }
 function refresh(){cancelAnimationFrame(raf);last=0;draw();}
 function resize(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);refresh();}
 section.querySelectorAll('[data-shape]').forEach(button=>button.addEventListener('click',()=>{
  target=button.dataset.shape==='sphere'?1:0;burstTarget=0;clearTimeout(scatterTimer);
  section.querySelectorAll('[data-shape]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  status.textContent=`${target?'The orbit':'The knot'} selected.`;refresh();
 }));
 function scatter(){clearTimeout(scatterTimer);burstTarget=burstTarget?0:1;status.textContent=burstTarget?'Scattered. Select a shape to bring it together.':'Sculpture reassembled.';refresh();if(moving())scatterTimer=setTimeout(()=>{burstTarget=0;refresh();},1400);}
 section.querySelector('#lab-scatter').addEventListener('click',scatter);
 let down=null;canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});
 canvas.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<10)scatter();down=null;});
 canvas.addEventListener('pointercancel',()=>down=null);
 canvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const rect=canvas.getBoundingClientRect();pointerX=(e.clientX-rect.left)/width-.5;pointerY=((e.clientY-rect.top)/height-.5)*.6;if(!moving())refresh();});
 canvas.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;if(!moving())refresh();});
 new ResizeObserver(resize).observe(canvas);
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;refresh();},{threshold:.05}).observe(section);
 document.addEventListener('portfolio-motion-change',refresh);document.addEventListener('visibilitychange',refresh);reduce.addEventListener('change',refresh);resize();
}
