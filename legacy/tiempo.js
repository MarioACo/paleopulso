const rail=document.querySelector('#timeRail'),detail=document.querySelector('#unitDetail'),filters=document.querySelector('#eraFilters');
let currentUnits=[...GEO_UNITS],currentIndex=0;
const unitMedia=new Map();
const unitVisuals={
  hadico:{title:'Zircon',organism:'Zircon',label:'Circón · archivo mineral'},arcaico:{title:'Stromatolite',organism:'Stromatolite',label:'Estromatolito'},proterozoico:{title:'Banded iron formation',organism:'Banded iron formation',label:'Formación de hierro bandeado'},ediacarico:{title:'Dickinsonia',organism:'Dickinsonia',label:'Dickinsonia'},fanerozoico:{title:'Trilobite',organism:'Trilobite',label:'Trilobite'},cambrico:{title:'Anomalocaris',organism:'Anomalocaris',label:'Anomalocaris'},ordovicico:{title:'Orthoceras',organism:'Orthoceras',label:'Cefalópodo de concha recta'},silurico:{title:'Eurypterus',organism:'Eurypterus',label:'Eurypterus'},devonico:{title:'Dunkleosteus',organism:'Dunkleosteus',label:'Dunkleosteus'},carbonifero:{title:'Meganeura',organism:'Meganeura',label:'Meganeura'},permico:{title:'Dimetrodon',organism:'Dimetrodon',label:'Dimetrodon'},triasico:{title:'Herrerasaurus',organism:'Herrerasaurus',label:'Herrerasaurus'},jurasico:{title:'Stegosaurus',organism:'Stegosaurus',label:'Stegosaurus'},cretacico:{title:'Tyrannosaurus',organism:'Tyrannosaurus',label:'Tyrannosaurus'},paleogeno:{title:'Basilosaurus',organism:'Basilosaurus',label:'Basilosaurus'},neogeno:{title:'Megalodon',organism:'Megalodon',label:'Megalodon'},cuaternario:{title:'Mammoth',organism:'Mammoth',label:'Mamut'}
};
const fmt=n=>n===0?'presente':`${Number.isInteger(n)?n:n.toFixed(3).replace(/0+$/,'').replace(/\.$/,'')} Ma`;
const commonsFile=file=>`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(' ','_'))}`;

function renderRail(){
  rail.innerHTML='';let last='';
  currentUnits.forEach((u,i)=>{
    if(u.era!==last){const h=document.createElement('div');h.className='time-era-label';h.textContent=u.era;rail.appendChild(h);last=u.era}
    const b=document.createElement('button');b.type='button';b.className='time-unit';b.dataset.id=u.id;b.style.setProperty('--unit',u.color);
    b.innerHTML=`<i></i><span><small>${u.rank}</small><strong>${u.name}</strong></span><span>${fmt(u.start)}—${fmt(u.end)}</span>`;
    b.addEventListener('click',()=>selectUnit(i,true));rail.appendChild(b);
  });
  if(!currentUnits.length){rail.innerHTML='<p class="directory-empty">No hay unidades en este filtro.</p>';detail.innerHTML='';return}
  selectUnit(0,false);
}

function visualPanel(u){
  const visual=unitVisuals[u.id],media=unitMedia.get(u.id);
  const photo=media?.thumbnail?`<img src="${media.thumbnail}" alt="Registro visual de ${visual.label}" loading="lazy">`:'<span class="unit-photo-wait">CARGANDO ARCHIVO VISUAL…</span>';
  const source=media?.file?`<a href="${commonsFile(media.file)}" target="_blank" rel="noopener">IMAGEN, AUTORÍA Y LICENCIA ↗</a>`:'<span>ARCHIVO WIKIMEDIA COMMONS</span>';
  return `<figure class="unit-visual"><div class="unit-photo">${photo}</div><div class="unit-polygon">${PaleoPolygonArt.render(visual.organism)}</div><figcaption><div><span>REGISTRO EMBLEMÁTICO</span><strong>${visual.label}</strong></div>${source}</figcaption></figure>`;
}

function selectUnit(index,updateHash){
  currentIndex=index;const u=currentUnits[index],duration=u.start-u.end,earthShare=duration/4567*100;
  rail.querySelectorAll('.time-unit').forEach(b=>b.classList.toggle('active',b.dataset.id===u.id));detail.style.setProperty('--unit',u.color);
  detail.innerHTML=`<p class="unit-rank">${u.era} · ${u.rank}</p><h2>${u.name}</h2><p class="unit-lead">${u.lead}</p>${visualPanel(u)}<div class="unit-range"><div><span>COMIENZA</span><strong>${fmt(u.start)}</strong></div><div><span>TERMINA</span><strong>${fmt(u.end)}</strong></div><div><span>DURACIÓN APROX.</span><strong>${duration.toFixed(duration<10?2:0)} Ma</strong></div><div><span>FRACCIÓN DE LA HISTORIA TERRESTRE</span><strong>${earthShare<.1?'&lt; 0.1':earthShare.toFixed(1)}%</strong></div></div><div class="subdivision-block"><h3>SUBDIVISIONES FORMALES / OPERATIVAS</h3><div>${(GEO_SUBDIVISIONS[u.id]||[]).map(x=>`<span>${x}</span>`).join('')}</div></div><div class="detail-grid"><section><h3>EL PLANETA</h3><p>${u.world}</p></section><section><h3>LA VIDA</h3><p>${u.life}</p></section><section><h3>LA EVIDENCIA</h3><p>${u.evidence}</p></section></div><div class="taxa-block"><h3>FORMAS DE VIDA / INDICIOS CLAVE</h3><div class="taxa-row">${u.taxa.map(t=>`<span>${t}</span>`).join('')}</div></div><p class="event-note">Punto de inflexión · ${u.event}</p><div class="unit-actions"><button id="prevUnit" ${index===0?'disabled':''}>← Anterior</button><button id="nextUnit" ${index===currentUnits.length-1?'disabled':''}>Siguiente →</button></div>`;
  detail.querySelector('#prevUnit').addEventListener('click',()=>selectUnit(Math.max(0,currentIndex-1),true));
  detail.querySelector('#nextUnit').addEventListener('click',()=>selectUnit(Math.min(currentUnits.length-1,currentIndex+1),true));
  if(updateHash)history.replaceState(null,'',`#${u.id}`);
}

async function loadUnitMedia(){
  const entries=Object.entries(unitVisuals),titles=entries.map(([,v])=>v.title);
  const params=new URLSearchParams({action:'query',format:'json',origin:'*',redirects:'1',prop:'pageimages',piprop:'thumbnail|name',pithumbsize:'1100',pilicense:'free',titles:titles.join('|')});
  try{
    const response=await fetch(`https://en.wikipedia.org/w/api.php?${params}`);if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const data=await response.json(),aliases=new Map();
    for(const x of data.query?.normalized||[])aliases.set(x.from,x.to);for(const x of data.query?.redirects||[])aliases.set(x.from,x.to);
    const resolve=title=>{let x=title;for(let i=0;i<5&&aliases.has(x);i++)x=aliases.get(x);return x};
    const pages=new Map(Object.values(data.query?.pages||{}).map(p=>[p.title,p]));
    for(const [id,v] of entries){const p=pages.get(resolve(v.title));if(p)unitMedia.set(id,{thumbnail:p.thumbnail?.source||'',file:p.pageimage||''})}
    selectUnit(currentIndex,false);
  }catch(error){console.warn('No se cargó el archivo visual de Tiempo.',error)}
}

filters.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  filters.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));
  currentUnits=b.dataset.era==='Todos'?[...GEO_UNITS]:b.dataset.era==='Fanerozoico'?GEO_UNITS.filter(u=>u.era!=='Precámbrico'):GEO_UNITS.filter(u=>u.era===b.dataset.era);renderRail();
});
renderRail();
const requested=location.hash.slice(1);if(requested){const i=currentUnits.findIndex(u=>u.id===requested);if(i>=0)selectUnit(i,false)}
loadUnitMedia();
