export function initHeroVortex({getTheme,isPaused}){
 const stage=document.querySelector('.vortex-stage'),canvas=stage.querySelector('canvas'),ctx=canvas.getContext('2d');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let raf=0,visible=true,last=0,phase=0,px=0,py=0,x=0,y=0,energy=0,ripple=0,hover=false;
 const canMove=()=>!isPaused()&&!reduce.matches;
 function draw(now=0){
  raf=0;const rect=canvas.getBoundingClientRect(),w=rect.width,h=rect.height,dpr=Math.min(devicePixelRatio||1,1.75);
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
  const dt=last?Math.min((now-last)/1000,.04):.016;last=now;
  if(canMove()){phase+=dt*(.11+energy*.24);x+=(px-x)*.055;y+=(py-y)*.055;energy+=((hover?.65:0)-energy)*.035;ripple=Math.max(0,ripple-dt*.65);}else{x=0;y=0;energy=0;ripple=0;}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const cx=w/2+x*15,cy=h/2+y*13,r=Math.min(w,h)*.43,dark=getTheme()==='dark';
  for(let arm=0;arm<120;arm++){
   ctx.beginPath();for(let j=0;j<=100;j++){
    const t=j/100,a=arm/120*Math.PI*2+phase+(3.6+energy*.35)*Math.pow(1-t,1.15),wave=Math.sin(t*10-ripple*7)*ripple*.035;
    const rad=r*(.14+.86*t)*(1+wave),bend=1+.06*Math.sin(a*2+phase)+x*.055*Math.cos(a)+y*.055*Math.sin(a);
    const vx=cx+Math.cos(a)*rad*bend,vy=cy+Math.sin(a)*rad*(.94+energy*.025);j?ctx.lineTo(vx,vy):ctx.moveTo(vx,vy);
   }
   const shade=(Math.sin(arm/120*Math.PI*2+phase)+1)/2;ctx.strokeStyle=dark?(shade>.7?'#c6ed83':'#759f46'):(shade>.68?'#345326':'#9abf56');ctx.lineWidth=shade>.68?1.25:.8;ctx.globalAlpha=.3+.55*shade;ctx.stroke();
  }
  ctx.globalAlpha=1;ctx.beginPath();ctx.arc(cx,cy,r*.135,0,Math.PI*2);ctx.fillStyle=dark?'#171d18':'#f5f4eb';ctx.fill();
  if(visible&&canMove()&&!document.hidden)raf=requestAnimationFrame(draw);
 }
 function refresh(){cancelAnimationFrame(raf);last=0;draw();}
 stage.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const rect=stage.getBoundingClientRect();px=((e.clientX-rect.left)/rect.width-.5)*2;py=((e.clientY-rect.top)/rect.height-.5)*2;});
 stage.addEventListener('pointerenter',()=>{hover=true;stage.classList.add('vortex-engaged');});
 stage.addEventListener('pointerleave',()=>{hover=false;px=py=0;stage.classList.remove('vortex-engaged');});
 canvas.addEventListener('pointerdown',()=>{if(canMove()){ripple=1;energy=1;refresh();}});
 stage.querySelectorAll('[data-feature-channel]').forEach(card=>card.addEventListener('click',()=>{
  document.querySelector(`[data-channel="${card.dataset.featureChannel}"]`)?.click();
  if(!document.querySelector('.broadcast.scroll-story'))document.querySelector('#playground').scrollIntoView({behavior:canMove()?'smooth':'instant'});
 }));
 new ResizeObserver(refresh).observe(canvas);new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;refresh();}).observe(stage);
 document.addEventListener('portfolio-motion-change',refresh);document.addEventListener('visibilitychange',refresh);document.addEventListener('portfolio-theme-change',refresh);reduce.addEventListener('change',refresh);refresh();
}
