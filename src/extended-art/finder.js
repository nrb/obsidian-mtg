// Ported from the "Extended Art Finder" artifact. The parsing, picking and rewrite logic
// is unchanged; owned counts now come from the imported ManaBox collection, and picks
// and the last deck list are kept in the plugin's data instead of localStorage.
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument -- untyped JavaScript ported from the artifact; the host object it receives is typed as ViewHost in main.ts */
import BUNDLED from "./data.json";
import SAMPLE from "./sample.txt";

export const EXTENDED_ART = BUNDLED;

export function mountExtendedArt(root, host) {
const $=id=>root.querySelector('[id="'+id+'"]');
// Printings from the cached Scryfall bulk data when downloaded, else the bundled snapshot.
const cached=host.extendedArtData?host.extendedArtData():null;
const DATA=cached||BUNDLED;
if(cached)$('eadate').textContent='your cached Scryfall data from '+cached.refreshed;
const idx=new Map();
for(const n of Object.keys(DATA.cards)){idx.set(n.toLowerCase(),n);const f=n.split(' // ')[0].toLowerCase();if(!idx.has(f))idx.set(f,n);}
const st=host.load()||{};
let picks=st.picks&&typeof st.picks==='object'?st.picks:{};
const persist=()=>{try{host.save({picks,deck:st.deck==null?null:st.deck})}catch(e){}};
const savePicks=persist;
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SIDE_RE=/^(\/\/\s*)?side\s*board\s*:?\s*$/i, MAIN_RE=/^(\/\/\s*)?(deck|main\s*(deck|board)?|commander|companion)\s*:?\s*$/i;
const LINE_RE=/^(\d+)\s*x?\s+(.+?)(?:\s+\(([A-Za-z0-9]+)\)\s+(\S+))?(\s+\*.*)?\s*$/;
// Bundled rows are [set, collector number, release date, finishes, usd]; the owned
// count (index 5 in the artifact) is looked up in the imported collection.
const withOwn=o=>[o[0],o[1],o[2],o[3],o[4],host.owned(o[0],o[1])];

function parse(text){
  const lines=text.split(/\r?\n/), hasHeader=lines.some(l=>SIDE_RE.test(l.trim()));
  const secs=[{header:null,items:[]}]; let cur=secs[0];
  for(const raw of lines){
    const l=raw.trim();
    if(!l){ if(!hasHeader&&cur===secs[0]&&cur.items.length){cur={header:'',items:[]};secs.push(cur);} continue; }
    if(SIDE_RE.test(l)){cur={header:l,items:[]};secs.push(cur);continue;}
    if(MAIN_RE.test(l)||l.startsWith('//')||l.startsWith('#'))continue;
    const m=l.match(LINE_RE); if(!m)continue;
    cur.items.push({qty:+m[1],name:m[2],set:m[3]||'',cn:m[4]||'',tail:(m[5]||'').trim(),raw:l});
  }
  return secs.filter(s=>s.items.length);
}
function options(card){
  const all=(DATA.cards[card]||[]).map(withOwn);
  return $('owned').checked?all.filter(o=>o[5]>0):all;
}
const key=o=>o[0]+'|'+o[1];
function optHTML(card,o,sel){
  const [s,cn,dt,fin,usd,own]=o, k=key(o);
  const fins=fin.split('').map(c=>({n:'nonfoil',f:'foil',e:'etched'}[c]||c)).join(', ');
  return `<label class="opt${sel===k?' sel':''}"><input type="radio" name="p-${esc(card)}" value="${esc(k)}"${sel===k?' checked':''}>
    <span class="code">${esc(s)} #${esc(cn)}</span><span class="sn">${esc(DATA.sets[s]||'')}</span>
    <span class="meta"><span>${dt.slice(0,4)}</span><span>${fins}</span>${usd?`<span>$${usd}</span>`:''}${own?`<span class="own">Own ${own}</span>`:''}</span>
    <a href="https://scryfall.com/card/${s.toLowerCase()}/${encodeURIComponent(cn)}" target="_blank" rel="noopener">View on Scryfall</a></label>`;
}
let eaText='';
function render(){
  const secs=parse($('deck').value);
  const names=new Map(); // canonical -> {typed,count}
  const missing=[];
  for(const s of secs)for(const it of s.items){
    const c=idx.get(it.name.toLowerCase());
    it.card=c||null;
    if(c){const e=names.get(c)||{typed:it.name,qty:0};e.qty+=it.qty;names.set(c,e);}
    else if(!missing.includes(it.name))missing.push(it.name);
  }
  const res=new Map(); let need=[],auto=[],noOwned=[];
  for(const [c,e] of names){
    const opts=options(c);
    if(!opts.length){noOwned.push(e.typed);continue;}
    let sel=picks[c];
    if(sel!=='KEEP'&&!opts.some(o=>key(o)===sel))sel=null;
    if(opts.length===1&&!sel)sel=key(opts[0]);
    (opts.length>1?need:auto).push({c,e,opts,sel});
    if(sel&&sel!=='KEEP')res.set(c,sel);
  }
  // output
  const out=[], eaOut=[];
  secs.forEach((s,i)=>{
    if(i>0){out.push('');if(s.header)out.push(s.header);}
    const done=new Set(), eaSec=[];
    for(const it of s.items){
      const r=it.card&&res.get(it.card);
      if(!r){out.push(it.raw);continue;}
      if(done.has(it.card))continue; done.add(it.card);
      const q=s.items.filter(x=>x.card===it.card).reduce((a,x)=>a+x.qty,0);
      const [set,cn]=r.split('|');
      const line=`${q} ${it.name} (${set}) ${cn}${it.tail?' '+it.tail:''}`;
      out.push(line); eaSec.push(line);
    }
    if(eaSec.length){if(i>0){if(eaOut.length)eaOut.push('');if(s.header)eaOut.push(s.header);}eaOut.push(...eaSec);}
  });
  $('out').value=out.join('\n');
  eaText=eaOut.join('\n');
  $('copyEA').disabled=!eaOut.length;
  const pending=need.filter(x=>!x.sel);
  $('warn').hidden=!pending.length;
  $('warn').textContent=pending.length?`${pending.length} card${pending.length>1?'s have':' has'} more than one extended art printing: ${pending.map(x=>x.e.typed).join(', ')}. Pick one on the right; until then the list keeps your printing.`:'';
  const swapped=res.size;
  $('summary').innerHTML=`<span class="chip">${names.size+missing.length} unique cards</span><span class="chip ok">${swapped} swapped to extended art</span>`+
    (pending.length?`<span class="chip warn">${pending.length} need a pick</span>`:'')+
    `<span class="chip">${noOwned.length+missing.length} without extended art${$('owned').checked?' you own':''}</span>`;
  const card=(x,showTag)=>`<div class="card"><h3>${esc(x.e.typed)} <small>×${x.e.qty}</small>${showTag?(x.sel?'<span class="tag done">Picked</span>':'<span class="tag need">Pick one</span>'):''}</h3>
    <div class="opts">${x.opts.map(o=>optHTML(x.c,o,x.sel)).join('')}
    <label class="opt keep${x.sel==='KEEP'?' sel':''}"><input type="radio" name="p-${esc(x.c)}" value="KEEP"${x.sel==='KEEP'?' checked':''}><span class="code">Keep my printing</span><span class="sn">Leave this card as listed</span></label></div></div>`;
  need.sort((a,b)=>!!a.sel-!!b.sel);
  $('need').innerHTML=need.map(x=>card(x,true)).join('')||'<p class="empty">No cards with more than one extended art printing.</p>';
  $('auto').innerHTML=auto.map(x=>card(x,false)).join('')||'<p class="empty">No cards with exactly one extended art printing.</p>';
  const none=[...noOwned,...missing];
  $('noneSum').textContent=`${none.length} card${none.length===1?'':'s'} without extended art${$('owned').checked?' you own':''}`;
  $('none').innerHTML=none.map(n=>`<li>${esc(n)}</li>`).join('');
  $('collnote').textContent=host.collectionNote();
}
root.addEventListener('change',e=>{
  const t=e.target;
  if(t.type==='radio'&&t.name.startsWith('p-')){picks[t.name.slice(2)]=t.value;savePicks();render();}
});
let draftT;
const saveDeck=v=>{st.deck=v;persist();};
$('deck').addEventListener('input',()=>{$('srcnote').textContent='';window.clearTimeout(draftT);draftT=window.setTimeout(()=>saveDeck($('deck').value),400);render();});
$('owned').addEventListener('change',render);
$('clear').addEventListener('click',()=>{$('deck').value='';$('srcnote').textContent='';saveDeck(null);render();$('deck').focus();});
$('file').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;$('deck').value=await f.text();$('srcnote').textContent=f.name;saveDeck($('deck').value);render();e.target.value='';});
$('fromnote').addEventListener('click',async()=>{
  const r=host.readActiveNote?await host.readActiveNote():null;
  if(!r){$('srcnote').textContent='Open a note with a deck list first';return;}
  $('deck').value=r.text;$('srcnote').textContent=r.name;saveDeck(r.text);render();
});
$('savenote').addEventListener('click',async()=>{
  const b=$('savenote');
  try{const p=await host.saveNote('Extended art list',$('out').value);b.textContent='Saved to '+p;}
  catch(err){b.textContent='Could not save';}
  window.setTimeout(()=>b.textContent='Save as note',2500);
});
async function copyText(b,text,label){
  try{await navigator.clipboard.writeText(text);b.textContent='Copied';}
  catch(e){const o=$('out');o.value=text;o.select();b.textContent='Selected, press copy';window.setTimeout(render,4000);}
  window.setTimeout(()=>b.textContent=label,1800);
}
$('copy').addEventListener('click',()=>copyText($('copy'),$('out').value,'Copy all'));
$('copyEA').addEventListener('click',()=>copyText($('copyEA'),eaText,'Copy extended art only'));
if(st.deck){$('deck').value=st.deck;$('srcnote').textContent='Your last list';}else $('deck').value=SAMPLE;
render();
return {refresh:render,destroy(){window.clearTimeout(draftT);}};
}
/* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument -- end of the ported artifact code */
