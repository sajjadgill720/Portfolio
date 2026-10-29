import {profile, projects, projectUrl} from './data.js';
import {answerLocally} from './knowledge.js';
import {initMotion} from './motion.js';
import {icon, getSkillIcon} from './icons.js';
import {initStudio} from './studio.js';
import {initHeroVortex} from './hero-vortex.js';
import {initBrief} from './brief-experience.js';
import {revealVortex,initContactPortal} from './portal.js';

if (typeof document !== 'undefined') {
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
  $('#skills').innerHTML=profile.skills.map((s,i)=>`<span class="skill-pill" style="--skill-delay:${i*-.6}s"><i class="skill-icon" aria-hidden="true">${getSkillIcon(s)}</i><span class="skill-label">${escape(s)}</span></span>`).join('');
  window.addEventListener('scroll',()=>{$('.progress').style.width=`${window.scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*100}%`;},{passive:true});

  // The spiral is drawn locally; no downloaded animation or third-party assets.
  document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
  let theme='light';try{theme=localStorage.getItem('sajjad-theme')==='dark'?'dark':'light';}catch{}
  function applyTheme(){document.documentElement.dataset.theme=theme;const dark=theme==='dark',button=$('#theme-toggle');button.innerHTML=icon(dark?'moon':'sun');button.setAttribute('aria-pressed',String(dark));button.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');document.querySelector('meta[name="theme-color"]').content=dark?'#141618':'#f5f4eb';}
  applyTheme();$('#theme-toggle').onclick=()=>{theme=theme==='dark'?'light':'dark';applyTheme();try{localStorage.setItem('sajjad-theme',theme);}catch{}document.dispatchEvent(new Event('portfolio-theme-change'));};
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=motion.matches;
  function updateMotion(){const b=$('#motion-toggle');b.textContent=paused?'Play motion ▷':'Pause motion Ⅱ';b.setAttribute('aria-pressed',String(paused));document.documentElement.classList.toggle('motion-paused',paused);document.dispatchEvent(new CustomEvent('portfolio-motion-change',{detail:{paused}}));}
  $('#motion-toggle').onclick=()=>{paused=!paused;updateMotion();};motion.addEventListener('change',()=>{paused=motion.matches;updateMotion();});updateMotion();
  initHeroVortex({getTheme:()=>theme,isPaused:()=>paused});

  let conversation=[],busy=false,chatController=null,chatGeneration=0,cancelChatReveal=()=>{},activeTyping=null;
  try{const saved=JSON.parse(sessionStorage.getItem('sajjad-chat')||'[]');conversation=Array.isArray(saved)?saved.filter(m=>['user','assistant'].includes(m.role)&&typeof m.text==='string').slice(-30):[];}catch{}
  const greeting={role:'assistant',text:'Hi, I’m SR’s portfolio assistant. Explore the work, ask about the toolkit, or turn your idea into a project brief. Where would you like to start?',sources:[]};
  if(!conversation.length)conversation=[greeting];
  function persist(){try{sessionStorage.setItem('sajjad-chat',JSON.stringify(conversation.slice(-30)));}catch{}}

  function formatChatMarkdown(raw){
    if(!raw)return '';
    const safe=String(raw).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    let formatted=safe.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi,(_,lang,code)=>`<pre class="chat-code-block"><code>${code.trim()}</code></pre>`);
    formatted=formatted.replace(/`([^`\n]+)`/g,'<code class="chat-inline-code">$1</code>');
    formatted=formatted.replace(/^###\s+(.+)$/gm,'<h4 class="chat-md-h">$1</h4>');
    formatted=formatted.replace(/^##\s+(.+)$/gm,'<h3 class="chat-md-h">$1</h3>');
    formatted=formatted.replace(/^#\s+(.+)$/gm,'<h2 class="chat-md-h">$1</h2>');
    formatted=formatted.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
    formatted=formatted.replace(/(^|[^*])\*([^*\n]+)\*([^*]|$)/g,'$1<em>$2</em>$3');
    formatted=formatted.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer" class="chat-md-link">$1 ↗</a>');
    formatted=formatted.replace(/(?:^[*-]\s+.+(?:\r?\n|$))+/gm,block=>{
      const items=block.trim().split(/\r?\n/).map(line=>`<li>${line.replace(/^[*-]\s+/,'')}</li>`).join('');
      return `<ul class="chat-md-list">${items}</ul>`;
    });
    formatted=formatted.replace(/(?:^\d+\.\s+.+(?:\r?\n|$))+/gm,block=>{
      const items=block.trim().split(/\r?\n/).map(line=>`<li>${line.replace(/^\d+\.\s+/,'')}</li>`).join('');
      return `<ol class="chat-md-list">${items}</ol>`;
    });
    const parts=formatted.split(/\r?\n\r?\n+/);
    return parts.map(p=>{
      p=p.trim();
      if(!p)return '';
      if(/^<(?:h[1-4]|pre|ul|ol|div)/i.test(p))return p;
      return `<p class="chat-md-p">${p.replace(/\r?\n/g,'<br>')}</p>`;
    }).filter(Boolean).join('');
  }

  function cancelTyping(){
    if(activeTyping){
      activeTyping.skip();
      activeTyping=null;
    }
  }

  function renderMessages(){
   $('#messages').replaceChildren();
   for(const m of conversation){
    const el=document.createElement('div');
    el.className='message '+m.role;
    if(m.role==='assistant'){
      const content=document.createElement('div');
      content.className='chat-content';
      content.innerHTML=formatChatMarkdown(m.text.replace(/\bSajjad(?: Ur Rehman)?\b/gi,'SR'));
      el.append(content);
    }else{
      el.textContent=m.text;
    }
    if(m.sources?.length){
      const label=document.createElement('span');
      label.className='source-label';
      label.textContent=m.sourceLabel||'Project sources';
      el.append(label);
      const links=document.createElement('div');
      links.className='source-links';
      for(const source of m.sources){
        try{
          const u=new URL(source.url);
          if(u.protocol!=='https:'||u.hostname!=='github.com')continue;
          const a=document.createElement('a');
          a.href=u.href;
          a.target='_blank';
          a.rel='noreferrer';
          a.textContent=source.title+' ↗';
          links.append(a);
        }catch{}
      }
      el.append(links);
    }
    if(m.action==='brief'){
      const action=document.createElement('button');
      action.className='chat-brief-action';
      action.textContent='Prepare a project brief ↗';
      action.onclick=()=>$('#brief-tab').click();
      el.append(action);
    }
    if(m.note){
      const note=document.createElement('small');
      note.textContent=m.note;
      el.append(note);
    }
    $('#messages').append(el);
   }
   if(busy){
    const el=document.createElement('div');
    el.className='message assistant thinking-bubble';
    el.innerHTML='<span class="typing-dots"><span></span><span></span><span></span></span><span>Thinking through the architecture…</span>';
    el.setAttribute('role','status');
    $('#messages').append(el);
   }
   $('#messages').scrollTop=$('#messages').scrollHeight;
  }

  function typewriterAssistantMessage(result, generation){
    const cleanText=(result.text||'').replace(/\bSajjad(?: Ur Rehman)?\b/gi,'SR');
    const thinking=$('#messages .thinking-bubble');
    if(thinking)thinking.remove();

    const el=document.createElement('div');
    el.className='message assistant is-typing';
    const content=document.createElement('div');
    content.className='chat-content';
    const cursor=document.createElement('span');
    cursor.className='typing-cursor';
    cursor.textContent='▋';
    el.append(content,cursor);
    $('#messages').append(el);

    const tokens=cleanText.match(/(\S+\s*|\s+)/g)||[cleanText];
    let tokenIdx=0;
    let accumulated='';
    const batchSize=Math.max(1,Math.ceil(tokens.length/75));

    function finish(){
      if(el.parentNode){
        cursor.remove();
        el.classList.remove('is-typing');
        content.innerHTML=formatChatMarkdown(cleanText);
        if(result.sources?.length){
          const label=document.createElement('span');
          label.className='source-label';
          label.textContent=result.mode==='ai'?'Related repositories':'Project sources';
          el.append(label);
          const links=document.createElement('div');
          links.className='source-links';
          for(const source of result.sources){
            try{
              const u=new URL(source.url);
              if(u.protocol!=='https:'||u.hostname!=='github.com')continue;
              const a=document.createElement('a');
              a.href=u.href;
              a.target='_blank';
              a.rel='noreferrer';
              a.textContent=source.title+' ↗';
              links.append(a);
            }catch{}
          }
          el.append(links);
        }
        if(result.action==='brief'){
          const action=document.createElement('button');
          action.className='chat-brief-action';
          action.textContent='Prepare a project brief ↗';
          action.onclick=()=>$('#brief-tab').click();
          el.append(action);
        }
        const noteText=result.mode==='ai'
          ? 'AI response · senior engineering insights & authentic portfolio data.'
          : (result.notice||'Portfolio knowledge mode');
        const note=document.createElement('small');
        note.textContent=noteText;
        el.append(note);
      }
      conversation.push({
        role:'assistant',
        text:cleanText,
        sources:result.sources,
        action:result.action,
        sourceLabel:result.mode==='ai'?'Related repositories':'Project sources',
        note:result.mode==='ai'?'AI response · senior engineering insights & authentic portfolio data.':(result.notice||'Portfolio knowledge mode')
      });
      persist();
      $('#messages').scrollTop=$('#messages').scrollHeight;
      activeTyping=null;
      busy=false;
      $('#chat-form button').disabled=false;
      $('#message-input').focus();
    }

    activeTyping={
      skip:()=>{
        clearInterval(timer);
        finish();
      }
    };

    const timer=setInterval(()=>{
      if(generation!==chatGeneration){
        clearInterval(timer);
        activeTyping=null;
        return;
      }
      for(let b=0;b<batchSize&&tokenIdx<tokens.length;b++){
        accumulated+=tokens[tokenIdx++];
      }
      content.innerHTML=formatChatMarkdown(accumulated);
      $('#messages').scrollTop=$('#messages').scrollHeight;

      if(tokenIdx>=tokens.length){
        clearInterval(timer);
        finish();
      }
    },20);
  }

  function setChat(open){const panel=$('#chat-panel'),wasOpen=!panel.hidden;cancelChatReveal();panel.hidden=!open;$('#chat-launcher').setAttribute('aria-expanded',String(open));if(open){renderMessages();if(!wasOpen)cancelChatReveal=revealVortex(panel,{enabled:!motion.matches&&!paused,duration:1800,onComplete:()=>{if(!panel.hidden)$('#message-input').focus({preventScroll:true});}});else $('#message-input').focus({preventScroll:true});}else $('#chat-launcher').focus({preventScroll:true});}
  $('#chat-launcher').onclick=()=>setChat($('#chat-panel').hidden);$('#close-chat').onclick=()=>setChat(false);document.querySelectorAll('[data-chat]').forEach(b=>b.onclick=()=>setChat(true));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('dialog[open]')&&!$('#chat-panel').hidden)setChat(false);});
  $('#messages').addEventListener('click',()=>{if(activeTyping)activeTyping.skip();});

  async function send(question){
   if(busy||!question.trim())return;
   cancelTyping();
   question=question.trim().slice(0,1500);
   conversation.push({role:'user',text:question});
   conversation=conversation.slice(-30);
   persist();
   busy=true;
   const generation=chatGeneration;
   $('#chat-form button').disabled=true;
   $('#message-input').value='';
   renderMessages();
   try{
     chatController=new AbortController();
     const timeout=setTimeout(()=>chatController?.abort(),25000);
     let result;
     try{
       let config=await configReady;
       if(!config.ai){
         try{
           const recheck=await fetch('/api/config',{signal:AbortSignal.timeout(3000)});
           if(recheck.ok){
             config={...await recheck.json(),server:true};
             if(config.ai)$('#chat-mode').textContent='AI assistant · grounded in the portfolio';
           }
         }catch{}
       }
       if(!config.server){
         result={...answerLocally(question,conversation.slice(0,-1)),mode:'knowledge'};
       }else{
         const response=await fetch('/api/chat',{
           method:'POST',
           headers:{'Content-Type':'application/json'},
           body:JSON.stringify({messages:conversation.slice(-12).map(m=>({role:m.role,content:m.text}))}),
           signal:chatController.signal
         });
         if(!response.ok)throw Error(response.status===429?'Too many requests. Please wait a minute before trying again.':'The assistant could not connect.');
         result=await response.json();
       }
     }finally{
       clearTimeout(timeout);
     }
     if(generation!==chatGeneration)return;
     $('#chat-mode').textContent=result.mode==='ai'?'AI assistant · grounded in the portfolio':'Portfolio knowledge assistant';
     typewriterAssistantMessage(result, generation);
   }catch(error){
     if(generation!==chatGeneration)return;
     const local=answerLocally(question,conversation.slice(0,-1));
     const fallbackResult={
       ...local,
       mode:'knowledge',
       notice:error.message.includes('Too many')?error.message:'AI connection unavailable. Answered from the local portfolio knowledge.'
     };
     typewriterAssistantMessage(fallbackResult, generation);
   }
  }
  $('#chat-form').onsubmit=e=>{e.preventDefault();send($('#message-input').value);};$('#message-input').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(e.target.value);}};document.querySelectorAll('[data-question]').forEach(b=>b.onclick=()=>send(b.dataset.question));
  $('#new-chat').onclick=()=>{chatGeneration++;cancelTyping();chatController?.abort();busy=false;$('#chat-form button').disabled=false;conversation=[greeting];persist();renderMessages();$('#message-input').focus();};
  function download(text,name){const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  $('#export-chat').onclick=()=>download(conversation.map(m=>`${m.role==='user'?'You':'Assistant'}: ${m.text}${m.sources?.length?'\nSources: '+m.sources.map(s=>s.url).join('\n'):''}`).join('\n\n'),'SR-portfolio-conversation.txt');
  let contactEmail=profile.email;
  const guidedBrief=initBrief({download,getContactEmail:()=>contactEmail});
  const contactPortal=initContactPortal({email:profile.email,canAnimate:()=>!motion.matches&&!paused,openBrief:()=>guidedBrief.open()});
  function updateContact(email){contactEmail=email;$('#contact-link').href=`mailto:${email}`;$('#contact-link').textContent=email+' ↗';$('#contact-link').removeAttribute('target');guidedBrief.refreshContact();contactPortal.update(email);}
  updateContact(profile.email);
  const configReady=fetch('/api/config',{signal:AbortSignal.timeout(5000)}).then(async r=>r.ok?{...await r.json(),server:true}:{server:false}).then(config=>{if(config.email)updateContact(config.email);if(config.ai)$('#chat-mode').textContent='AI assistant · grounded in the portfolio';return config;}).catch(()=>({server:false}));
  const spiralPaths=Array.from({length:18},(_,arm)=>{const points=Array.from({length:35},(_,j)=>{const t=j/34,r=3+10*t,a=arm/18*Math.PI*2+2.7*(1-t);return `${j?'L':'M'}${(16+Math.cos(a)*r).toFixed(2)},${(16+Math.sin(a)*r).toFixed(2)}`;}).join(' ');return `<path d="${points}"/>`;}).join('');
  document.querySelectorAll('.chat-icon').forEach(icon=>{icon.innerHTML=`<svg viewBox="0 0 32 32" aria-hidden="true">${spiralPaths}</svg>`;});
  document.addEventListener('portfolio-motion-change',()=>{if(paused)cancelChatReveal();});
  initMotion({projects,projectUrl,escape,concept,openChat:setChat,send});
  initStudio();
}
