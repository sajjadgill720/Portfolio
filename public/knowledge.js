import {profile,projects,projectUrl} from './data.js';
export function answerLocally(question) {
 const q=question.toLowerCase();
 if (/price|budget|cost|rate|timeline|available|availability/.test(q)) return {text:'Rates, availability, and timelines depend on the scope and aren’t published here. Use “Project brief” to outline your idea, then connect with Sajjad through GitHub to discuss it.',sources:[{title:'GitHub profile',url:profile.github}]};
 if (/contact|email|hire|connect/.test(q)) return {text:`You can email Sajjad at ${profile.email}. For a collaboration, use Project brief to outline your idea, review it, and open an email draft. You can also copy or download it. Nothing is sent automatically.`,sources:[{title:'Connect on GitHub',url:profile.github}]};
 if (/skill|stack|technolog|tools/.test(q)) return {text:`Sajjad works across ${profile.skills.join(', ')}. His focus spans full-stack applications, automation, and applied AI.`,sources:[{title:'Profile & technologies',url:profile.github+'/sajjadgill720'}]};
 const terms=q.match(/[a-z0-9]+/g)||[];
 const ranked=projects.map(p=>({p,score:terms.filter(t=>t.length>2&&`${p.name} ${p.slug} ${p.description} ${p.category} ${p.tags.join(' ')}`.toLowerCase().includes(t)).length})).sort((a,b)=>b.score-a.score);
 if(ranked[0]?.score>0 && !/^(show |what are |list )?(your |his |sajjad.s )?(projects|work)[? .]*$/.test(q)){const selected=ranked.filter(x=>x.score===ranked[0].score).slice(0,2).map(x=>x.p);return {text:selected.map(p=>`${p.name}: ${p.description} Built around ${p.tags.join(', ')}. Status: ${p.status}.`).join('\n\n'),sources:selected.map(p=>({title:p.name,url:projectUrl(p)}))};}
 if(/project|work|build|portfolio/.test(q)) return {text:'Explore Demo Automation for AI workflows, GymRetain for SaaS operations, AQI Predictor for forecasting, and AutoML for repeatable machine learning. Ask about a specific project to see its details and source.',sources:projects.slice(0,4).map(p=>({title:p.name,url:projectUrl(p)}))};
 if(/about|who|hello|hi\b|sajjad/.test(q)) return {text:profile.bio+' His current focus includes Knovera, a final-year project exploring personalized learning for children aged 4–14.',sources:[{title:'About Sajjad',url:profile.github+'/sajjadgill720'}]};
 return {text:'I can help with Sajjad’s projects, technology stack, background, or preparing a project brief. I don’t have verified information on that question yet. Try asking about GymRetain, AutoML, or Demo Automation.',sources:[]};
}
