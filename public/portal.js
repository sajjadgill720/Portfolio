// Procedural spiral ribbon mask, calculated from the real panel dimensions.
// Reveals the actual UI rather than placing a loading animation over it.
export function revealVortex(element,{enabled=true,onComplete=()=>{}}={}){
 let frame=null,cancelled=false;
 function clean(){if(frame!==null)cancelAnimationFrame(frame);element.style.removeProperty('clip-path');element.classList.remove('is-vortex-revealing');}
 if(!enabled){clean();onComplete();return clean;}
 const {width,height}=element.getBoundingClientRect(),cx=width/2,cy=height/2,diagonal=Math.hypot(width,height)/2;
 const pathSupported=CSS.supports('clip-path','path("M 0 0 L 1 1 Z")');
 function mask(p){
  if(!pathSupported)return `circle(${p*160}% at 50% 50%)`;
  const radius=diagonal*(.08+1.55*p),half=diagonal*(.001+.68*p*p),rotation=-Math.PI*1.3*(1-p),outer=[],inner=[];
  for(let i=0;i<=200;i++){const t=i/200,angle=t*Math.PI*4.4+rotation,r=radius*t;const a=r+half,b=Math.max(0,r-half);outer.push(`${(cx+Math.cos(angle)*a).toFixed(1)} ${(cy+Math.sin(angle)*a).toFixed(1)}`);inner.unshift(`${(cx+Math.cos(angle)*b).toFixed(1)} ${(cy+Math.sin(angle)*b).toFixed(1)}`);}
  return `path("M ${outer.join(' L ')} L ${inner.join(' L ')} Z")`;
 }
 element.style.clipPath=mask(0);element.classList.add('is-vortex-revealing');const started=performance.now();
 function tick(now){if(cancelled)return;const t=Math.min(1,(now-started)/780),p=1-(1-t)**2.2;element.style.clipPath=mask(p);if(t<1)frame=requestAnimationFrame(tick);else{clean();onComplete();}}
 frame=requestAnimationFrame(tick);
 return ()=>{cancelled=true;clean();};
}

export function initContactPortal({email,canAnimate,openBrief}){
 let contact=email,cancelReveal=()=>{};
 const dialog=document.createElement('dialog');dialog.id='contact-dialog';dialog.className='contact-portal';dialog.setAttribute('aria-labelledby','contact-portal-title');
 dialog.innerHTML='<div class="brief-heading"><span class="eyebrow">GOOD THINGS START WITH A CONVERSATION.</span><button id="close-contact" aria-label="Close contact">×</button></div><div class="contact-portal-mark" aria-hidden="true">SR<span>↗</span></div><h2 id="contact-portal-title">Say hello.<br><em>Let’s make it useful.</em></h2><p>A project idea, a collaboration, or a new opportunity.<br>Send me a little context and we’ll take it from there.</p><a class="portal-address" id="portal-address"></a><div class="portal-actions"><a id="compose-contact" class="button dark">Compose email <span>↗</span></a><button id="copy-contact" class="text-button">Copy address</button></div><button id="portal-brief" class="portal-brief">Have a project in mind? Prepare a brief ↗</button><p id="contact-portal-status" role="status">Compose email opens your mail app. Nothing is sent automatically.</p>';
 document.body.append(dialog);
 function update(next){contact=next;for(const id of ['portal-address','compose-contact']){dialog.querySelector('#'+id).href=`mailto:${contact}`;}dialog.querySelector('#portal-address').textContent=contact;}
 function open(){dialog.showModal();cancelReveal=revealVortex(dialog,{enabled:canAnimate(),onComplete:()=>{if(dialog.open)dialog.querySelector('#compose-contact').focus({preventScroll:true});}});}
 document.querySelector('#contact-link').addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();open();});
 dialog.querySelector('#close-contact').onclick=()=>dialog.close();dialog.addEventListener('close',()=>cancelReveal());
 dialog.querySelector('#copy-contact').onclick=async()=>{try{await navigator.clipboard.writeText(contact);dialog.querySelector('#contact-portal-status').textContent='Email address copied.';}catch{dialog.querySelector('#contact-portal-status').textContent='Select the address above to copy it, or use Compose email.';}};
 dialog.querySelector('#portal-brief').onclick=()=>{dialog.close();openBrief();};
 document.addEventListener('portfolio-motion-change',()=>{if(!canAnimate())cancelReveal();});update(email);
 return {update};
}
