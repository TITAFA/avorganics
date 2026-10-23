 <div class="f"><div class="w"><label for="cn">Nombre</label><input id="cn" autocomplete="off" value="${esc(c&&c.n)}"></div>
 <div class="w"><label for="ct">Teléfono</label><input id="ct" inputmode="tel" value="${esc(c&&c.tel)}"></div>
 <div class="w"><label for="csn">¿Cuántas sucursales tiene?</label><select id="csn">${Array.from({length:10},(_,i)=>`<option value="${i+1}">${i===0?"1 (una sola)":i+1}</option>`).join("")}</select></div>
 <div class="w" id="csw" hidden></div>
 <div class="w"><label for="cno">Notas (quién recibe, horario, por dónde entrar)</label><textarea id="cno">${esc(c&&c.no)}</textarea></div></div>
 <button class="btn w" id="cg" style="margin-top:12px">${c?"Guardar cambios":"Guardar restaurante"}</button>${c?`<button class="btn d w" id="cd" data-id="${c.id}" style="margin-top:8px">Eliminar restaurante</button>`:""}`,()=>{
  const names=(c&&c.s&&c.s.length>1?c.s.slice():[]);
  $("#csn").value=String(Math.max(1,names.length||1));
  const drawS=()=>{const n=+$("#csn").value;const keep=[...document.querySelectorAll("#csw input")].map(x=>x.value);const cur=keep.length?keep:names;
   $("#csw").hidden=n<2;$("#csw").innerHTML=n<2?"":Array.from({length:n},(_,i)=>`<label for="cs${i}" style="margin-top:${i?8:0}px">Nombre de la sucursal ${i+1}</label><input id="cs${i}" autocomplete="off" placeholder="Ej. Centro, Plaza Norte" value="${esc(cur[i]||"")}">`).join("");};
  $("#csn").onchange=drawS;drawS();
  $("#cg").onclick=async()=>{const n=$("#cn").value.trim();if(!n){toast("Escribe el nombre del restaurante");return;}
   const nb=+$("#csn").value,sc=nb<2?[]:Array.from({length:nb},(_,i)=>($("#cs"+i).value||"").trim()||("Sucursal "+(i+1)));
   const d={n,tel:$("#ct").value.trim(),no:$("#cno").value.trim(),s:sc};
   if(await W(()=>c?DB.doc("clientes/"+c.id).update(d):DB.collection("clientes").doc().set(Object.assign(d,{cr:Date.now()})),"Restaurante guardado"))closeSheet();};
  if(c)$("#cd").onclick=function(){arm(this,async()=>{if(await W(()=>DB.doc("clientes/"+c.id).delete(),"Restaurante eliminado"))closeSheet();},"Eliminar restaurante");};
 });}
function openProduct(p){
 const cal=p?calList(p).slice():[];
 sheet(`<div class="shh"><h2>${p?"Editar producto":"Crear nuevo producto"}</h2><button class="btn o sm" data-a="x">Cerrar</button></div>
 <div class="pvw" id="pv"></div>
 <div class="f"><div class="w"><label for="pn2">Nombre del producto</label><input id="pn2" autocomplete="off" placeholder="Ej. Aguacate, Limón, Maracuyá" value="${esc(p&&p.n)}"></div>
 <div><label for="pu">Presentación de venta</label><select id="pu"><option value="caja">Cajas</option><option value="kg">Kilos (kg)</option></select></div>
 <div id="kcw"><label for="kc">Kilos por caja</label><input id="kc" type="number" inputmode="decimal" min="1" value="${kcOf(p)}"></div>
 <div class="w"><label for="pcn">Calibres (opcional)</label><div class="row2" style="margin-top:3px;flex-wrap:nowrap"><input id="pcn" autocomplete="off" placeholder="Ej. Extra" style="flex:1;margin:0;min-width:0"><button class="btn o" id="pca" type="button">Agregar</button></div><div class="chips" id="pcl" style="margin:8px 0 0"></div></div></div>
 <p class="hint" style="margin-top:8px">Los precios se ponen en la pestaña <b>Precios</b>, para cada restaurante.</p>
 <button class="btn w" id="pg">${p?"Guardar cambios":"Guardar producto"}</button>${p?`<button class="btn d w" id="pdl" data-id="${p.id}" style="margin-top:8px">Eliminar producto</button>`:""}`,()=>{
  $("#pu").value=p&&!isBox(p)?"kg":"caja";
  const pv=()=>{$("#pv").innerHTML=ico(iconKey({n:$("#pn2").value}),84);};
  const tog=()=>{$("#kcw").hidden=$("#pu").value!=="caja";};
  $("#pn2").oninput=pv;$("#pu").onchange=tog;pv();tog();
  const draw=()=>{$("#pcl").innerHTML=cal.length?cal.map((t,i)=>`<span class="chip" style="display:inline-flex;gap:8px;align-items:center">${esc(t)}<button data-i="${i}" aria-label="Quitar ${esc(t)}" style="border:0;background:none;font-weight:800;color:var(--pend);min-height:0;padding:0 2px">×</button></span>`).join(""):'<span class="sub">Sin calibres. Déjalo así si este producto no los tiene.</span>';};
  const add=()=>{const raw=$("#pcn").value.trim();if(!raw)return false;if(!cal.some(x=>norm(x)===norm(raw)))cal.push(raw);$("#pcn").value="";draw();return true;};
  $("#pcl").onclick=e=>{const b=e.target.closest("button[data-i]");if(b){cal.splice(+b.dataset.i,1);draw();}};
  $("#pca").onclick=()=>{if(!add())toast("Escribe el calibre");};
  $("#pcn").onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();add();}};
  draw();
  $("#pg").onclick=async()=>{const n=$("#pn2").value.trim();if(!n){toast("Escribe el nombre del producto");return;}
   add();const u=$("#pu").value,kc=parseFloat($("#kc").value);if(u==="caja"&&!(kc>0)){toast("Escribe cuántos kilos trae la caja");return;}
   const d={n,u,kc:u==="caja"?kc:10,cal};
   if(await W(()=>p?DB.doc("productos/"+p.id).update(d):DB.collection("productos").doc().set(Object.assign(d,{cr:Date.now()})),"Producto guardado"))closeSheet();};
  if(p)$("#pdl").onclick=function(){arm(this,async()=>{if(await W(()=>DB.doc("productos/"+p.id).delete(),"Producto eliminado"))closeSheet();},"Eliminar producto");};
 });}

function openPrices(cid){
 const c=cl(cid);if(!c)return;
 if(!PR.length){toast("Primero crea tus productos");return;}
 const cur=c.pr||{};
 sheet(`<div class="shh"><h2>Precios de ${esc(c.n)}</h2><button class="btn o sm" data-a="x">Cerrar</button></div>
 <p class="hint" style="margin-top:0">Marca lo que le vendes a este restaurante y escribe su precio. Al hacer el pedido, el precio sale solo.</p>
 <div id="prl">${PR.map(p=>{const v=cur[p.id],on=!!v;return `<div class="prc ${on?"on":""}" data-p="${p.id}"><label class="prh"><input type="checkbox" class="pck" ${on?"checked":""}>${ico(iconKey(p),44)}<b>${esc(p.n)}</b></label><div class="prf" ${on?"":"hidden"}>${isBox(p)?`<div><label>Precio por caja (${kcOf(p)} kg)</label><input type="number" inputmode="decimal" min="0" class="ipc" placeholder="$" value="${v&&v.c!=null?v.c:""}"></div>`:""}<div><label>Precio por kilo</label><input type="number" inputmode="decimal" min="0" class="ipk" placeholder="$" value="${v&&v.k!=null?v.k:""}"></div></div></div>`;}).join("")}</div>
 <button class="btn w" id="prs" style="margin-top:12px">Guardar precios</button>`,()=>{
  document.querySelectorAll("#prl .pck").forEach(ck=>ck.onchange=()=>{const box=ck.closest(".prc");box.classList.toggle("on",ck.checked);box.querySelector(".prf").hidden=!ck.checked;});
  $("#prs").onclick=async()=>{const map={};let bad=null;
   document.querySelectorAll("#prl .prc").forEach(box=>{const ck=box.querySelector(".pck");if(!ck.checked)return;const pid=box.dataset.p,a=box.querySelector(".ipc"),b=box.querySelector(".ipk"),cv=a&&a.value!==""?parseFloat(a.value):null,kv=b&&b.value!==""?parseFloat(b.value):null;
    if(cv==null&&kv==null||(cv!=null&&!(cv>=0))||(kv!=null&&!(kv>=0))){bad=bad||(prod(pid)||{}).n;return;}map[pid]={c:cv,k:kv};});
   if(bad){toast("Escribe el precio de "+bad+" o desmárcalo");return;}
   if(await W(()=>DB.doc("clientes/"+cid).update({pr:map}),"Precios guardados"))closeSheet();};
 });}

/* ---------- Ventas ---------- */
function renderVen(){
 $("#vT").innerHTML=chipsH([["Diaria"],["Semanal"]],vper,"vper");
 const S=sales(),t=ymd();let d=[],lab,total,cajas,per;
 if(vper==="Diaria"){for(let i=13;i>=0;i--){const a=addD(t,-i),X=S.filter(o=>o.d===a);d.push({l:pdt(a).getDate(),v:X.reduce((x,o)=>x+tot(o),0),c:X.reduce((x,o)=>x+uq(o),0)});}lab="Ventas de los últimos 14 días";per="día";}
 else{const m=monday(t);for(let i=7;i>=0;i--){const a=addD(m,-7*i),b=addD(a,7),X=S.filter(o=>o.d>=a&&o.d<b);d.push({l:fmt(a),v:X.reduce((x,o)=>x+tot(o),0),c:X.reduce((x,o)=>x+uq(o),0)});}lab="Ventas de las últimas 8 semanas";per="semana";}
 total=d.reduce((a,x)=>a+x.v,0);cajas=d.reduce((a,x)=>a+x.c,0);
 $("#vK").innerHTML=`<div class="kpis"><div class="k"><b>${M(total)}</b><span>vendido</span></div><div class="k"><b>${R1(cajas)}</b><span>cajas</span></div><div class="k"><b>${M(total/d.length)}</b><span>promedio por ${per}</span></div></div>`;
 $("#vH").textContent=lab;$("#vC").innerHTML=S.length?chart(d,{label:lab}):`<div class="empty"><b>Aún no hay ventas</b>Cuando marques pedidos como entregados, aparecen aquí.</div>`;
 const mo={};S.forEach(o=>{const k=o.d.slice(0,7);mo[k]=(mo[k]||0)+uq(o);});const ks=Object.keys(mo).sort();
 if(ks.length<3)$("#vE").innerHTML=`<p class="hint">Para ver en qué meses se vende más hacen falta ventas de 3 meses distintos.</p><div class="prog"><i style="width:${ks.length/3*100}%"></i></div><div class="sub">Llevas ${ks.length} de 3 meses.</div>`;
 else{const dd=[];let k=pdt(t);k.setDate(1);const arr=[];for(let i=11;i>=0;i--){const x=new Date(k.getFullYear(),k.getMonth()-i,1);const key=x.getFullYear()+"-"+pad(x.getMonth()+1);arr.push({l:MES[x.getMonth()],v:mo[key]||0});}
  const best=arr.reduce((a,b)=>b.v>a.v?b:a);$("#vE").innerHTML=`<p class="hint">Cajas (10 kg) vendidas por mes. Hasta ahora el mes más fuerte es ${best.l}.</p>`+chart(arr,{money:false,label:"Cajas por mes"});}
 const gm={};S.forEach(o=>{const x=gm[o.cid]||(gm[o.cid]={n:o.cn,v:0,c:0,vk:0,sk:0});x.v+=tot(o);if(o.k!=null){x.c+=o.q*o.k;x.vk+=tot(o);}else x.sk++;});
 const GL=Object.values(gm).sort((a,b)=>(b.vk-b.c)-(a.vk-a.c)),skT=GL.reduce((a,x)=>a+x.sk,0);
 $("#vG").innerHTML=GL.length?GL.map(x=>`<div class="li"><div><b>${esc(x.n)}</b><div class="sub">Venta ${M(x.v)} · Costo ${x.vk?M(x.c):"sin capturar"}</div></div><div style="text-align:right"><b>${x.vk?M(x.vk-x.c):"—"}</b><div class="sub">${x.vk?Math.round((x.vk-x.c)/x.vk*100)+"% de margen":""}</div></div></div>`).join("")+(skT?`<p class="hint" style="margin-top:8px">${skT} ${skT===1?"pedido sin costo no cuenta":"pedidos sin costo no cuentan"} en la ganancia. Captura el costo al armar el pedido.</p>`:""):`<div class="empty"><b>Aún no hay ventas</b>Cuando entregues pedidos con su costo, verás cuánto ganas con cada restaurante.</div>`;
 const L=S.sort((a,b)=>a.d<b.d?1:-1).slice(0,15);
 $("#vL").innerHTML=L.length?L.map(o=>`<div class="li"><div><b>${esc(o.cn)}</b><div class="sub">${fmt(o.d)} · ${esc(pname(o))} · ${qty(o)} × ${M(o.p)}${esc(sucT(o))}</div></div><div style="text-align:right"><b>${M(tot(o))}</b><span class="tag ${o.e}">${TAG[o.e]}</span></div></div>`).join(""):`<div class="empty">Sin ventas todavía.</div>`;}

/* ---------- Calendario ---------- */
let cm=new Date().getFullYear()*12+new Date().getMonth();
const DOW=["L","M","M","J","V","S","D"];
const kfmt=n=>n>=1000?(Math.round(n/100)/10)+"k":String(Math.round(n));
function calIdx(){const I={v:{},u:{},pend:{},ent:{},cob:{},gas:{}};const add=(o,k,v)=>{o[k]=(o[k]||0)+v;};
 sales().forEach(o=>{add(I.v,o.d,tot(o));add(I.u,o.d,uq(o));add(I.ent,o.d,1);});
 P.forEach(o=>{if(o.e==="pendiente")add(I.pend,o.f,1);if(o.cob)add(I.cob,o.cob,tot(o));});
 A.forEach(a=>add(I.cob,a.f,a.m));G.forEach(g=>add(I.gas,g.f,g.m));return I;}
function renderCal(){const y=Math.floor(cm/12),m=cm%12,I=calIdx(),t=ymd();
 $("#mT").textContent=new Date(y,m,1).toLocaleDateString("es-MX",{month:"long",year:"numeric"});
 const nd=new Date(y,m+1,0).getDate(),off=(new Date(y,m,1).getDay()+6)%7,key=d=>y+"-"+pad(m+1)+"-"+pad(d);
 let mv=0,mc=0,mg=0,mu=0,mx=0;for(let d=1;d<=nd;d++){const k=key(d);mv+=I.v[k]||0;mc+=I.cob[k]||0;mg+=I.gas[k]||0;mu+=I.u[k]||0;mx=Math.max(mx,I.v[k]||0);}
 $("#mK").innerHTML=`<div class="kpis two"><div class="k"><b>${M(mv)}</b><span>vendido (${R1(mu)} cajas)</span></div><div class="k"><b>${M(mc)}</b><span>cobrado</span></div><div class="k"><b>${M(mg)}</b><span>gastos e inversiones</span></div><div class="k ${mc-mg<0?"neg":"big"}"><b>${M(mc-mg)}</b><span>cobrado menos gastado</span></div></div>`;
 let h=DOW.map(x=>`<div class="dw">${x}</div>`).join("")+"<span></span>".repeat(off);
 for(let d=1;d<=nd;d++){const k=key(d),v=I.v[k]||0,pc=mx?Math.round(v/mx*42):0;
  h+=`<button class="d${k===t?" hoy":""}" data-a="day" data-v="${k}" style="${v?`background:color-mix(in srgb,var(--grass) ${pc}%,var(--sf))`:""}" aria-label="${d}: vendido ${M(v)}"><span>${d}</span><small>${v?"$"+kfmt(v):""}</small><span class="dots">${I.pend[k]?'<i class="dp"></i>':""}${I.ent[k]?'<i class="dv"></i>':""}${I.gas[k]?'<i class="dg"></i>':""}</span></button>`;}
 $("#mG").innerHTML=h;
 const yd=[];let yt=0;for(let i=0;i<12;i++){let v=0;const pre=y+"-"+pad(i+1);Object.keys(I.v).forEach(k=>{if(k.slice(0,7)===pre)v+=I.v[k];});yt+=v;yd.push({l:MES[i],v});}
 $("#yH").textContent="Ventas de "+y+" por mes";
 $("#yC").innerHTML=yt?`<p class="hint">Total del año: ${M(yt)}</p>`+chart(yd,{label:"Ventas por mes de "+y}):`<div class="empty"><b>Sin ventas en ${y}</b>Aquí verás cómo se mueve tu año mes con mes.</div>`;}
function openDay(d){const I=calIdx(),dt=pdt(d);
 const ords=P.filter(o=>o.f===d||o.ent===d).filter((o,i,a)=>a.indexOf(o)===i).sort(byOrd);
 const pays=[...P.filter(o=>o.cob===d).map(o=>({n:o.cn,m:tot(o),t:"Pedido cobrado · "+o.m})),...A.filter(a=>a.f===d).map(a=>({n:a.cn||"Sin restaurante",m:a.m,t:"Pago recibido · "+a.met}))];
 const gs=G.filter(g=>g.f===d);
 sheet(`<div class="shh"><h2 style="text-transform:capitalize">${dt.toLocaleDateString("es-MX",{weekday:"long",day:"numeric",month:"long"})}</h2><button class="btn o sm" data-a="x">Cerrar</button></div>
 <div class="kpis"><div class="k"><b>${M(I.v[d]||0)}</b><span>vendido</span></div><div class="k"><b>${M(I.cob[d]||0)}</b><span>cobrado</span></div><div class="k"><b>${M(I.gas[d]||0)}</b><span>gastado</span></div></div>
 <h2 style="margin:8px 0 4px">Pedidos</h2>${ords.length?ords.map(o=>`<div class="li"><div><b>${esc(o.cn)}</b><div class="sub">${esc(pname(o))} · ${qty(o)} × ${M(o.p)} = ${M(tot(o))}${esc(sucT(o))}</div></div><span class="tag ${o.e}">${TAG[o.e]}</span></div>`).join(""):'<div class="sub" style="padding:6px 0">Sin pedidos este día.</div>'}
 <h2 style="margin:12px 0 4px">Dinero recibido</h2>${pays.length?pays.map(x=>`<div class="li"><div><b>${esc(x.n)}</b><div class="sub">${esc(x.t)}</div></div><b>${M(x.m)}</b></div>`).join(""):'<div class="sub" style="padding:6px 0">Sin cobros este día.</div>'}
 <h2 style="margin:12px 0 4px">Gastos</h2>${gs.length?gs.map(g=>`<div class="li"><div><b>${esc(g.c)}</b><div class="sub">${esc(g.t)}${g.n?" · "+esc(g.n):""}</div></div><b>${M(g.m)}</b></div>`).join(""):'<div class="sub" style="padding:6px 0">Sin gastos este día.</div>'}
 <button class="btn w" id="dadd" style="margin-top:14px">Añadir pedido a este día</button>`,()=>{$("#dadd").onclick=()=>{closeSheet();openOrder(null,d);};});}

/* ---------- Gastos ---------- */
function renderGas(){
 $("#gT").innerHTML=chipsH([["Este mes"],["Todo"]],gper,"gper");
 const inP=f=>gper==="Todo"||f.slice(0,7)===ymd().slice(0,7),sum=a=>a.reduce((x,y)=>x+y,0);
 const V=sales().filter(o=>o.e==="cobrado"&&inP(o.cob||o.d)),Gs=G.filter(g=>inP(g.f));
 const cob=sum(V.map(tot))+sum(A.filter(a=>inP(a.f)).map(a=>a.m)),gas=sum(Gs.filter(g=>g.t==="Gasto").map(g=>g.m)),fij=sum(Gs.filter(g=>g.t==="Pago fijo").map(g=>g.m)),inv=sum(Gs.filter(g=>g.t==="Inversión").map(g=>g.m)),ut=cob-gas-fij;
 $("#gK").innerHTML=`<div class="kpis two"><div class="k ${ut<0?"neg":"big"}" style="grid-column:1/-1"><b>${M(ut)}</b><span>Ganancia: cobrado − gastado − pagos fijos</span></div><div class="k"><b>${M(cob)}</b><span>cobrado</span></div><div class="k"><b>${M(gas)}</b><span>gastado</span></div><div class="k"><b>${M(fij)}</b><span>pagos fijos (tarjeta, renta, deuda)</span></div><div class="k"><b>${M(inv)}</b><span>invertido</span></div></div>`;
 const by={};Gs.forEach(g=>{const k=g.c+(g.t==="Inversión"?" (inv.)":"");by[k]=(by[k]||0)+g.m;});const E=Object.entries(by).sort((a,b)=>b[1]-a[1]),mx=E.length?E[0][1]:1;
 $("#gB").innerHTML=E.length?E.map(e=>`<div class="bar"><span>${esc(e[0])}</span><div class="t"><i style="width:${e[1]/mx*100}%"></i></div><span>${M(e[1])}</span></div>`).join(""):`<div class="empty">Registra un gasto para ver el desglose.</div>`;
 $("#gL").innerHTML=G.length?G.slice().sort((a,b)=>(b.cr||0)-(a.cr||0)).slice(0,40).map(g=>`<div class="li"><div><b>${esc(g.c)} · ${M(g.m)}</b><div class="sub">${esc(g.t)} · ${fmt(g.f)}${g.n?" · "+esc(g.n):""}</div></div><button class="btn d sm" data-a="delg" data-id="${g.id}">Eliminar</button></div>`).join(""):`<div class="empty">Aún no hay movimientos.</div>`;}
function fillCat(){$("#gc").innerHTML=CATS[$("#gt").value].map(c=>`<option>${c}</option>`).join("");}

/* ---------- Cierre ---------- */
let contado="";
function renderCie(){
 const t=ymd(),S=sales(),sum=a=>a.reduce((x,y)=>x+y,0);
 const vend=S.filter(o=>o.d===t),cobH=P.filter(o=>o.cob===t),aH=A.filter(a=>a.f===t),by=(met)=>sum(cobH.filter(o=>o.m===met).map(tot))+sum(aH.filter(a=>a.met===met).map(a=>a.m)),ef=by("Efectivo"),tr=by("Transferencia"),tj=by("Tarjeta");
 const pays=[...cobH.map(o=>({t:"Pedido cobrado",n:o.cn,m:tot(o),met:o.m})),...aH.map(a=>({t:"Pago recibido",n:a.cn||"Sin restaurante",m:a.m,met:a.met,id:a.id,no:a.n}))];
