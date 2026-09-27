/* Multiplayer: il facilitatore è l'autorità della partita; gli ospiti inviano comandi. */
(function(root){
'use strict';
const clone=x=>JSON.parse(JSON.stringify(x));
function check(test,message){if(!test)throw Error(message)}
function cleanName(value){check(typeof value==='string','Inserisci un nome.');const name=value.trim();check(name.length>0&&name.length<=30,'Il nome deve contenere da 1 a 30 caratteri.');return name}
function create(uid,name,n,town){check(typeof uid==='string'&&uid.length>0,'Accesso necessario.');check(Number.isInteger(n)&&n>=15&&n<=30,'Scegli da 15 a 30 personaggi.');return {hostId:uid,members:[{uid,name:cleanName(name)}],memberIds:[uid],n,town:String(town||'Valleverde').trim().slice(0,50)||'Valleverde',phase:'lobby',revision:0,game:null}}
function join(room,uid,name){check(room.phase!=='closed','Questa stanza è chiusa.');if(room.memberIds.includes(uid))return clone(room);check(room.phase==='lobby','La partita è già iniziata.');check(room.members.length<room.n,'La stanza è piena.');name=cleanName(name);check(!room.members.some(m=>m.name.toLocaleLowerCase('it')===name.toLocaleLowerCase('it')),'Questo nome è già in uso.');const next=clone(room);next.members.push({uid,name});next.memberIds.push(uid);next.revision++;return next}
function start(room,uid,seed){check(uid===room.hostId,'Solo il facilitatore può iniziare.');check(room.phase==='lobby','La partita è già iniziata.');check(room.members.length>=2,'Aspetta almeno un altro giocatore.');const s=root.Engine.create({n:room.n,town:room.town,mode:'group',seed});s.participants=room.members.map(m=>m.name);s.people.forEach((p,i)=>{p.controller=i%room.members.length;p.ownerUid=room.members[p.controller].uid;if(room.members.length===s.people.length)p.name=room.members[i].name});return s}
function active(s){if([2,6].includes(s.act))return s.step;if(s.act===3)return s.chain.at(-1);if(s.scene)return s.scene.stage==='target'?s.scene.actor:s.scene.target;return null}
function permitted(room,s,uid,action,value){if(!s||room.phase!=='playing'||!room.memberIds.includes(uid))return false;
 const host=uid===room.hostId,own=id=>s.people[id]?.ownerUid===uid;
 if(action==='place')return s.act===1&&host;
 if(action==='daily')return s.act===2&&own(s.step);
 if(action==='accuse')return s.act===3&&own(active(s));
 if(action==='vote')return s.act===6&&own(s.step);
 if(![4,5].includes(s.act))return false;
 if(action==='target')return s.scene.stage==='target'&&own(s.scene.actor);
 if(['obey','redirect'].includes(action))return s.scene.stage==='response'&&own(s.scene.target);
 if(action==='next')return s.scene.stage==='result'&&host;
 if(action==='pass')return s.act===5&&s.scene.stage==='intervene'&&host;
 if(action==='intervene')return s.act===5&&s.scene.stage==='intervene'&&s.giusti.length>0&&Number.isInteger(value)&&own(value)&&root.Engine.witnesses(s).includes(value);
 return false;
}
function apply(room,s,command){check(command&&command.revision===room.revision,'Il turno è cambiato: attendi l’aggiornamento e riprova.');check(permitted(room,s,command.uid,command.action,command.value),'Questa scelta spetta a un altro giocatore.');if(['target','accuse','redirect','intervene'].includes(command.action))check(Number.isInteger(command.value),'Personaggio non valido.');if(command.action==='place')check(typeof command.value==='string'&&command.value.length<=1500,'Descrizione non valida.');const next=clone(s);root.Engine.apply(next,command.action,command.value);return next}
function publish(s){const publicState=clone(s);delete publicState.seed;publicState.giusti=s.giusti.map(()=>({hidden:true}));if(s.act<7)publicState.votes=[];return JSON.stringify(publicState)}
root.OnlineRules={create,join,start,active,permitted,apply,publish};
})(typeof window==='undefined'?globalThis:window);
