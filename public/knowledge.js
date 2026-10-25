import {profile,projects,projectUrl} from './data.js';
const normalize=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const aliases={demo:['demo automation','automation platform'],gym:['gymretain','gym retain'],aqi:['aqi','air quality'],automl:['automl','auto ml','automated machine learning'],psx:['psx','halal screener'],qa:['academic policy','policy qa','policy q a','nust handbook'],gift:['giftify','keepsake'],research:['dot com','dotcom','market cycles','concentration trap']};
const stopwords=new Set('the and for with about what which tell show your his sr project projects work this that can does use uses how more please from have you are was would could want like make build'.split(' '));
function mentionedProjects(text){const q=` ${normalize(text)} `;return projects.filter(p=>[normalize(p.name),normalize(p.slug),...(aliases[p.theme]||[])].some(alias=>q.includes(` ${alias} `)));}
export function answerLocally(question,history=[]) {
 const q=question.toLowerCase();
 if (/\b(contact|email|hire|connect)\b/.test(q)) return {text:`You can email SR at ${profile.email}. For a collaboration, use Project brief to outline your idea, review it, and open an email draft. Nothing is sent automatically.`,sources:[{title:'GitHub profile',url:profile.github}],action:'brief'};
 if (/\b(prices?|pricing|budgets?|costs?|rates?|timeline|available|availability)\b/.test(q)) return {text:`Rates, availability, and timelines depend on the scope and aren’t published here. Prepare a project brief with your goals, preferred budget, and timing, then email SR at ${profile.email}.`,sources:[],action:'brief'};
 if(/\b(brief|enquiry|inquiry|collaborate|collaboration)\b/.test(q))return {text:'The project brief asks about the problem, audience, goals, budget, and timing. You can edit the result and choose to email, copy, or download it.',sources:[],action:'brief'};
 if(!mentionedProjects(q).length&&/\b(build|create|make|develop|generate|need|want)\b.+\b(app|website|dashboard|automation|platform|tool)\b/.test(q))return {text:'A useful starting point is who the product is for and the biggest problem it should solve. Add your idea to the guided project brief; you can review it before sharing it with SR.',sources:[],action:'brief'};
 let selected=mentionedProjects(q);
 if(!selected.length&&/\b(it|its|that|this|more|backend|frontend|stack|technologies|tools)\b/.test(q)){
  for(const message of [...history].slice(-12).reverse()){const found=mentionedProjects(message.content||message.text||'');if(found.length){selected=found.slice(0,1);break;}}
 }
 if(selected.length)return {text:selected.slice(0,2).map(p=>`${p.name}: ${p.description} Main tools: ${p.tags.join(', ')}. Status: ${p.status}.`).join('\n\n'),sources:selected.slice(0,2).map(p=>({title:p.name,url:projectUrl(p)}))};
 if (/\b(skills?|stack|technology|technologies|tools)\b/.test(q)) return {text:`SR works across ${profile.skills.join(', ')}. His focus spans full-stack applications, automation, and applied AI.`,sources:[{title:'Profile & technologies',url:profile.github+'/sajjadgill720'}]};
 const terms=normalize(q).split(' ').filter(t=>t.length>2&&!stopwords.has(t));
 const ranked=projects.map(p=>{const words=new Set(normalize(`${p.name} ${p.slug} ${p.description} ${p.category} ${p.tags.join(' ')}`).split(' '));return {p,score:terms.filter(t=>words.has(t)).length};}).sort((a,b)=>b.score-a.score);
 if(ranked[0]?.score>0 && !/^(show |what are |list )?(your |his |sr.s )?(projects|work)[? .]*$/.test(q)){const selected=ranked.filter(x=>x.score===ranked[0].score).slice(0,2).map(x=>x.p);return {text:selected.map(p=>`${p.name}: ${p.description} Built around ${p.tags.join(', ')}. Status: ${p.status}.`).join('\n\n'),sources:selected.map(p=>({title:p.name,url:projectUrl(p)}))};}
 if(/\b(projects?|work|build|portfolio)\b/.test(q)) return {text:'Explore Demo Automation for AI workflows, GymRetain for SaaS operations, AQI Predictor for forecasting, and AutoML for repeatable machine learning. Ask about a specific project to see its details and source.',sources:projects.slice(0,4).map(p=>({title:p.name,url:projectUrl(p)}))};
 if(/\b(about|who|hello|hi|sr)\b/.test(q)) return {text:profile.bio+' His current focus includes Knovera, a final-year project exploring personalized learning for children aged 4–14.',sources:[{title:'About SR',url:profile.github+'/sajjadgill720'}]};
 return {text:'I can help with SR’s projects, technology stack, background, or preparing a project brief. I don’t have verified information on that question yet. Try asking about GymRetain, AutoML, or Demo Automation.',sources:[]};
}
