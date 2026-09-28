// SkillBridge prototype. Plain JS, no build step. State is saved in localStorage.
const KEY = 'skillbridge-v1';
const fresh = () => ({role:null, skills:JSON.parse(JSON.stringify(SKILLS)), progress:{}, answers:[], q:0, assessed:false,
  apps:[{id:3,stage:1},{id:2,stage:0}], filters:{q:'',type:'',mode:''}});
let S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}'));
const save = () => localStorage.setItem(KEY, JSON.stringify(S));
const $ = s => document.querySelector(s);

const gap = k => Math.max(0, S.skills[k].need - S.skills[k].have);
// Priority = how big your gap is (60%) + how much employers ask for it (40%).
const ranked = () => Object.keys(COURSES).map(k => ({k, score:gap(k)*.6 + S.skills[k].demand*.4})).sort((a,b) => b.score - a.score);
const match = j => Math.round(40 + 60*j.skills.reduce((a,k) => a + Math.min(S.skills[k].have/S.skills[k].need, 1), 0)/j.skills.length);
const overall = () => { const v = Object.values(S.skills); return Math.round(v.reduce((a,s) => a + s.have, 0)/v.length); };

function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2200)}
const bridge = k => {const s=S.skills[k];return `<div class="bridge" role="img" aria-label="${k}: you ${s.have}%, employers want ${s.need}%"><span class="gap" style="left:${s.have}%;width:${Math.max(0,s.need-s.have)}%"></span><span class="have" style="width:${s.have}%"></span></div>`};
const greet = () => {const h=new Date().getHours();return h<12?'Good morning':h<17?'Good afternoon':'Good evening'};

// ---- pages ----
const pages = {
welcome:()=>`<div class="hero"><h1>College taught you a lot. Employers want a little more. Let's find the gap.</h1>
<p>SkillBridge checks your skills against what internships and graduate jobs actually ask for, then tells you what to learn first, and why.</p>
<p class="mute small">This is a prototype with demo data. Pick a view to look around.</p>
<div class="roles">
<button class="role" data-role="student"><b>I'm a student</b><span class="mute">Try the full journey as Aarohi</span></button>
<button class="role" data-role="college"><b>I work at a college</b><span class="mute">See how a whole batch is doing</span></button>
<button class="role" data-role="company"><b>I'm hiring</b><span class="mute">Browse candidates by skill match</span></button></div></div>`,

home:()=>{const top=ranked()[0].k,n=S.apps.length;return `<h2>${greet()}, Aarohi</h2><p class="mute">Working towards: Software Developer</p>
<div class="stats"><div><b>${overall()}%</b><span class="mute small">skill average</span></div><div><b>${Object.keys(S.skills).filter(k=>gap(k)>0).length}</b><span class="mute small">skills still short of the bar</span></div><div><b>${n}</b><span class="mute small">applications in progress</span></div></div>
<div class="note"><b>Your best next step:</b> ${COURSES[top]}. It has the biggest gap (${gap(top)} points) and employers keep asking for it. <a href="#/plan">See your plan</a></div>
${S.assessed?'':'<p>You haven\'t taken the quick check yet, so these numbers are our starting guess. <a href="#/check">It takes about two minutes.</a></p>'}
<h3 style="margin-top:24px">Where you stand</h3><div class="list">${Object.keys(S.skills).map(k=>`<div><div class="row"><b>${k}</b><span class="small mute">you ${S.skills[k].have}% · employers ${S.skills[k].need}%</span></div>${bridge(k)}</div>`).join('')}</div>
<p class="small mute">Solid bar is you. Striped stretch is what's left to reach the employer level.</p>`},

check:()=>{if(S.assessed)return `<h2>Quick check done</h2><p>Thanks for being honest with it. We blended your answers with what you told us earlier, so your bars have moved.</p><p><a href="#/plan">See what to learn next</a> or <button class="btn ghost sm" data-act="retake">retake the check</button></p>`;
const q=QUIZ[S.q];return `<h2>Quick check</h2><p class="mute">Five questions. Guess if you need to, it's not graded and nobody sees it.</p>
<div class="steps">${QUIZ.map((_,i)=>`<i class="${i<=S.q?'on':''}"></i>`).join('')}</div><h3 style="margin-top:20px">${q.q}</h3>
${q.o.map((o,i)=>`<button class="opt" aria-pressed="${S.answers[S.q]===i}" data-ans="${i}">${o}</button>`).join('')}
<div class="row" style="margin-top:14px"><button class="btn ghost sm" data-act="prev" ${S.q?'':'disabled'}>Back</button>
${S.q<QUIZ.length-1?`<button class="btn sm" data-act="next" ${S.answers[S.q]==null?'disabled':''}>Next</button>`:`<button class="btn sm" data-act="finish" ${S.answers[S.q]==null?'disabled':''}>See my results</button>`}</div>`},

plan:()=>`<h2>Your plan</h2><p class="mute">Ordered by gap size and employer demand. Finish a module and the order updates.</p>
<div class="list">${ranked().map(({k},i)=>{const s=S.skills[k],p=S.progress[k]||0;return `<div><div class="row"><h3>${i+1}. ${COURSES[k]}</h3>${i<2?'<span class="pill hot">start here</span>':gap(k)===0?'<span class="pill ok">you\'re there</span>':''}</div>
<p>You're at ${s.have}% and software roles usually want ${s.need}%. About ${s.demand}% of the listings we looked at mention it.</p>${bridge(k)}
<p class="small mute">Module progress: ${p}%</p><button class="btn sm" data-done="${k}" ${p>=100?'disabled':''}>${p?'Finish next module':'Start learning'}</button></div>`}).join('')}</div>`,

jobs:()=>{const f=S.filters;return `<h2>Roles that fit you</h2><p class="mute">Sorted by how well your current skills cover each role.</p>
<div class="filters"><input id="fq" placeholder="Search role, company or skill" value="${f.q}" aria-label="Search"><select id="ft" aria-label="Type"><option value="">Any type</option><option${f.type=='Internship'?' selected':''}>Internship</option><option${f.type=='Full-time'?' selected':''}>Full-time</option></select><select id="fm" aria-label="Work mode"><option value="">Remote or on-site</option><option${f.mode=='Remote'?' selected':''}>Remote</option><option${f.mode=='On-site'?' selected':''}>On-site</option></select></div><div class="list" id="jl">${jobList()}</div>`},

apps:()=>`<h2>Your applications</h2>${S.apps.length?`<div class="list">${S.apps.map(a=>{const j=JOBS.find(x=>x.id==a.id);return `<div><div class="row"><b>${j.role}</b><span class="mute">${j.co}</span></div><p class="small">${STAGES.map((s,i)=>i==a.stage?`<b>${s}</b>`:`<span class="mute">${s}</span>`).join(' → ')}</p></div>`}).join('')}</div>`:'<p>Nothing yet. <a href="#/jobs">Find a role you like.</a></p>'}`,

college:()=>`<h2>Batch overview</h2><p class="mute">Demo numbers for a college of 1,240 students.</p>
<div class="stats"><div><b>980</b><span class="mute small">students assessed</span></div><div><b>72%</b><span class="mute small">average skill score</span></div><div><b>68%</b><span class="mute small">placement ready</span></div></div>
<h3>Biggest gaps across the batch</h3><div class="list">${[['Data Structures',62],['Cloud Computing',58],['Communication',49],['Web development',44]].map(([n,v])=>`<div><div class="row"><span>${n}</span><b>${v}% of students short</b></div><div class="bridge"><span class="have" style="width:${v}%"></span></div></div>`).join('')}</div>
<p>Of 420 internship applications, 210 were shortlisted, 96 reached interviews and 58 were selected.</p>`,

company:()=>`<h2>Talent hub</h2><p class="mute">Candidates ranked against your Software Intern requirements.</p><div class="list">${[['Aarohi S.',match(JOBS[0])],['Rohan M.',82],['Sneha K.',79]].map(([n,m])=>`<div class="row"><span>${n}</span><b>${m}% match</b><button class="btn sm ghost" data-short="${n}">Shortlist</button></div>`).join('')}</div>`
};

function jobList(){const f=S.filters,q=f.q.toLowerCase();
const L=JOBS.filter(j=>(j.role+j.co+j.skills.join()).toLowerCase().includes(q)&&(!f.type||j.type==f.type)&&(!f.mode||j.mode==f.mode)).sort((a,b)=>match(b)-match(a));
if(!L.length)return '<div><p>Nothing matches those filters. Try clearing the search.</p></div>';
return L.map(j=>{const short=j.skills.filter(k=>S.skills[k].have/S.skills[k].need<.75),done=S.apps.some(a=>a.id==j.id);
return `<div><div class="row"><h3>${j.role}</h3><b>${match(j)}% match</b></div><p class="mute small">${j.co} · ${j.city} · ${j.type}, ${j.len} · ${j.pay}</p>
<p class="small">${short.length?`Worth brushing up first: ${short.join(', ')}.`:'You already cover everything they list.'}</p>
<button class="btn sm" data-apply="${j.id}" ${done?'disabled':''}>${done?'Applied':'Apply'}</button></div>`}).join('')}

// ---- router & rendering ----
const NAVS={student:[['home','Home'],['check','Quick check'],['plan','Your plan'],['jobs','Roles'],['apps','Applications']],college:[['college','Batch overview']],company:[['company','Talent hub']]};
function render(){let p=(location.hash.replace('#/','')||'welcome');
if(!S.role&&p!='welcome')p='welcome';if(S.role&&p=='welcome')p=NAVS[S.role][0][0];
if(S.role&&!NAVS[S.role].some(n=>n[0]==p))p=NAVS[S.role][0][0];
const body=pages[p]();
$('#app').innerHTML=p=='welcome'?body:`<div class="shell"><nav aria-label="Main"><a class="brand" href="#/">SkillBridge</a>${NAVS[S.role].map(([id,l])=>`<a class="l" href="#/${id}" ${id==p?'aria-current="page"':''}>${l}</a>`).join('')}<a class="l" href="#/" data-act="logout">Switch view</a></nav><main>${body}</main></div>`}

document.addEventListener('click',e=>{const t=e.target.closest('button,a');if(!t)return;const d=t.dataset;
if(d.role){S.role=d.role;save();location.hash='#/'+NAVS[d.role][0][0];render()}
else if(d.act=='logout'){S.role=null;save()}
else if(d.ans!=null){S.answers[S.q]=+d.ans;save();render()}
else if(d.act=='next'){S.q++;save();render()}else if(d.act=='prev'){S.q--;save();render()}
else if(d.act=='finish'){const by={};QUIZ.forEach((z,i)=>{if(z.skill){(by[z.skill]=by[z.skill]||[]).push(S.answers[i]==z.a?100:0)}});
 Object.entries(by).forEach(([k,r])=>{const sc=r.reduce((a,b)=>a+b)/r.length;S.skills[k].have=Math.round((S.skills[k].have+sc)/2)});
 S.assessed=true;save();render();toast('Results saved. Your bars have updated.')}
else if(d.act=='retake'){S=Object.assign(S,{q:0,answers:[],assessed:false,skills:JSON.parse(JSON.stringify(SKILLS))});save();render()}
else if(d.done){const k=d.done;S.progress[k]=Math.min(100,(S.progress[k]||0)+25);S.skills[k].have=Math.min(S.skills[k].need,S.skills[k].have+10);save();render();
 toast(gap(k)?`Nice. ${k} gap is now ${gap(k)} points.`:`${k} is at employer level. Well done.`)}
else if(d.apply){const j=JOBS.find(x=>x.id==d.apply);S.apps.push({id:j.id,stage:0});save();$('#jl').innerHTML=jobList();toast(`Application sent to ${j.co}. Good luck!`)}
else if(d.short){toast(`${d.short} shortlisted`)}});
document.addEventListener('input',e=>{if(e.target.id=='fq'||e.target.id=='ft'||e.target.id=='fm'){S.filters={q:$('#fq').value,type:$('#ft').value,mode:$('#fm').value};save();$('#jl').innerHTML=jobList()}});
addEventListener('hashchange',()=>{render();scrollTo(0,0)});render();
