const grid=document.querySelector('#lifeGrid');
const search=document.querySelector('#lifeSearch');
const count=document.querySelector('#recordCount');
const empty=document.querySelector('#lifeEmpty');
const filters=document.querySelector('#periodFilters');
const dialog=document.querySelector('#recordDialog');
let periodFilter='Todos';

const recordExtras={
  'Estromatolitos':{title:'Stromatolite',joke:'Fue influencer antes de que existieran seguidores: capa sobre capa.'},
  'Dickinsonia':{title:'Dickinsonia',joke:'No tenía boca y aun así lleva 558 millones de años dando de qué hablar.'},
  'Anomalocaris':{title:'Anomalocaris',joke:'El nombre significa “camarón anómalo”; el Cámbrico no contrató corrector.'},
  'Trilobites':{title:'Trilobite',joke:'Sobrevivieron unos 270 millones de años y aun así nadie les renovó la temporada.'},
  'Orthoceras':{title:'Orthoceras',joke:'El cono recto original: cero curvas, mucha actitud.'},
  'Cooksonia':{title:'Cooksonia',joke:'Medía pocos centímetros, pero abrió la primera sucursal terrestre.'},
  'Eurypterus':{title:'Eurypterus',joke:'Escorpión marino: porque el Silúrico pensó que nadar no daba suficiente miedo.'},
  'Dunkleosteus':{title:'Dunkleosteus',joke:'Sin dientes y con mordida de cizalla: trabajaba con pura mandíbula.'},
  'Tiktaalik':{title:'Tiktaalik',joke:'El pez que miró la orilla y dijo: “¿qué tan difícil puede ser?”'},
  'Archaeopteris':{title:'Archaeopteris',joke:'Plantó bosques mucho antes de que alguien inventara abrazar árboles.'},
  'Meganeura':{title:'Meganeura',joke:'La libélula tamaño ave que convirtió el matamoscas en equipo táctico.'},
  'Arthropleura':{title:'Arthropleura',joke:'El problema no era pisar al milpiés gigante; era que él te pisara.'},
  'Dimetrodon':{title:'Dimetrodon',joke:'No es dinosaurio. Ya corrigió eso tantas veces que se le bajó la vela.'},
  'Glossopteris':{title:'Glossopteris',joke:'Apareció en tantos continentes que terminó delatando a Pangea.'},
  'Lystrosaurus':{title:'Lystrosaurus',joke:'Sobrevivió al fin del mundo y luego monopolizó el Triásico. Buen networking.'},
  'Herrerasaurus':{title:'Herrerasaurus',joke:'Llegó antes de que ser dinosaurio estuviera de moda.'},
  'Stegosaurus':{title:'Stegosaurus',joke:'Cabeza pequeña, cola con púas enorme: prioridades perfectamente claras.'},
  'Archaeopteryx':{title:'Archaeopteryx',joke:'Mitad ave, mitad dinosaurio y cien por ciento discusión familiar.'},
  'Diplodocus':{title:'Diplodocus',joke:'Cuando tu cola entra a la sala varios segundos después que tú.'},
  'Spinosaurus':{title:'Spinosaurus',joke:'Cambia de reconstrucción tan seguido que ya necesita control de versiones.'},
  'Argentinosaurus':{title:'Argentinosaurus',joke:'Convirtió “¿cuánto pesaba?” en una pelea científica de sobremesa.'},
  'Tyrannosaurus rex':{title:'Tyrannosaurus',joke:'Brazos cortos; bibliografía larguísima.'},
  'Basilosaurus':{title:'Basilosaurus',joke:'Era ballena, no reptil. El plazo para devolver el nombre ya había vencido.'},
  'Paraceratherium':{title:'Paraceratherium',joke:'Rinoceronte sin cuerno y tamaño edificio: no necesitaba accesorios.'},
  'Megalodon':{title:'Megalodon',joke:'No vivió con T. rex, pero Hollywood insiste en organizar la reunión.'},
  'Australopithecus':{title:'Australopithecus',joke:'Ya caminaba en dos patas; por suerte todavía no existían las juntas por video.'},
  'Mammuthus':{title:'Mammoth',joke:'Abrigo integrado, clima terrible y cero quejas en redes.'},
  'Smilodon':{title:'Smilodon',joke:'Caninos espectaculares; dentista poco recomendable.'},
  'Megatherium':{title:'Megatherium',joke:'Demostró que tomarse las cosas con calma también puede ser monumental.'},
  'Homo neanderthalensis':{title:'Neanderthal',file:'Homo neanderthalensis - reconstruction - MUSE.jpg',joke:'No desapareció del todo: parte de su historia todavía viaja en nuestro ADN.'}
};

const mediaByName=new Map();
const eraFor=p=>['Arcaico','Ediacárico'].some(x=>p.includes(x))?'Precámbrico':['Cámbrico','Ordovícico','Silúrico','Devónico','Carbonífero','Pérmico'].some(x=>p.includes(x))?'Paleozoico':['Triásico','Jurásico','Cretácico'].some(x=>p.includes(x))?'Mesozoico':'Cenozoico';
const periodId=p=>({Arcaico:'arcaico',Ediacárico:'ediacarico',Cámbrico:'cambrico',Ordovícico:'ordovicico',Silúrico:'silurico',Devónico:'devonico',Carbonífero:'carbonifero',Pérmico:'permico',Triásico:'triasico',Jurásico:'jurasico',Cretácico:'cretacico',Paleógeno:'paleogeno',Neógeno:'neogeno',Cuaternario:'cuaternario'})[p.split('–')[0]]||'';
const wikiArticle=title=>`https://en.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(' ','_'))}`;
const commonsFile=file=>`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(' ','_'))}`;
const commonsThumb=file=>`https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}?width=900`;

function mediaMarkup(record,media){
  if(!media?.thumbnail)return `<span class="life-thumb life-thumb--pending" aria-hidden="true">${record.name.slice(0,2)}</span>`;
  return `<span class="life-thumb"><img src="${media.thumbnail}" alt="Imagen documental de ${record.name}" loading="lazy"></span>`;
}

function render(){
  const q=search.value.trim().toLocaleLowerCase('es');
  const records=LIFE_RECORDS.filter(r=>(periodFilter==='Todos'||eraFor(r.period)===periodFilter)&&`${r.name} ${r.period} ${r.group} ${r.habitat}`.toLocaleLowerCase('es').includes(q));
  count.textContent=`${records.length} DE ${LIFE_RECORDS.length} REGISTROS`;
  grid.innerHTML=records.map(r=>{
    const extra=recordExtras[r.name];
    return `<button class="life-card" data-id="${r.id}"><span class="record-no">${String(LIFE_RECORDS.indexOf(r)+1).padStart(2,'0')} · IMAGEN CON FUENTE</span>${mediaMarkup(r,mediaByName.get(r.name))}<span class="record-period">${r.period}</span><strong>${r.name}</strong><small>${r.group} · ${r.habitat}</small><span class="record-joke-preview">“${extra.joke}”</span></button>`;
  }).join('');
  empty.hidden=records.length>0;
}

async function loadRecordMedia(){
  const titles=LIFE_RECORDS.map(r=>recordExtras[r.name].title);
  const params=new URLSearchParams({action:'query',format:'json',origin:'*',redirects:'1',prop:'pageimages',piprop:'thumbnail|name',pithumbsize:'900',pilicense:'free',titles:titles.join('|')});
  try{
    const response=await fetch(`https://en.wikipedia.org/w/api.php?${params}`);
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const data=await response.json();
    const aliases=new Map();
    for(const item of data.query?.normalized||[])aliases.set(item.from,item.to);
    for(const item of data.query?.redirects||[])aliases.set(item.from,item.to);
    const resolve=title=>{let current=title;for(let i=0;i<5&&aliases.has(current);i++)current=aliases.get(current);return current};
    const pages=new Map(Object.values(data.query?.pages||{}).map(page=>[page.title,page]));
    for(const record of LIFE_RECORDS){
      const extra=recordExtras[record.name],requested=extra.title;
      const page=pages.get(resolve(requested));
      if(page||extra.file)mediaByName.set(record.name,{thumbnail:page?.thumbnail?.source||commonsThumb(extra.file),file:page?.pageimage||extra.file,articleTitle:page?.title||extra.title});
    }
    render();
  }catch(error){
    console.warn('No se pudieron cargar las miniaturas documentales.',error);
  }
}

function openRecord(record){
  const extra=recordExtras[record.name];
  const media=mediaByName.get(record.name);
  document.querySelector('#recordPeriod').textContent=record.period;
  document.querySelector('#recordName').textContent=record.name;
  document.querySelector('#recordMeta').innerHTML=`<span>${record.group}</span><span>${record.habitat}</span><span>${eraFor(record.period)}</span>`;
  document.querySelector('#recordSummary').textContent=record.summary;
  document.querySelector('#recordJoke').textContent=extra.joke;
  document.querySelector('#recordImage').innerHTML=media?.thumbnail?`<img src="${media.thumbnail}" alt="Imagen documental de ${record.name}">`:'<span class="record-image-missing">Imagen no disponible en este momento</span>';
  const source=document.querySelector('#recordImageSource');
  source.href=media?.file?commonsFile(media.file):`https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(record.name)}&title=Special:MediaSearch&type=image`;
  const reference=document.querySelector('#recordReference');
  reference.href=wikiArticle(media?.articleTitle||extra.title);
  reference.textContent=`Referencia biológica: ${media?.articleTitle||extra.title} ↗`;
  document.querySelector('#recordTimeLink').href=`tiempo.html#${periodId(record.period)}`;
  dialog.showModal();
}

grid.addEventListener('click',event=>{
  const card=event.target.closest('.life-card');
  if(card)openRecord(LIFE_RECORDS.find(record=>record.id===card.dataset.id));
});
document.querySelector('#recordClose').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
search.addEventListener('input',render);
filters.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(!button)return;
  periodFilter=button.dataset.period;
  filters.querySelectorAll('button').forEach(item=>item.classList.toggle('active',item===button));
  render();
});

render();
loadRecordMedia();
