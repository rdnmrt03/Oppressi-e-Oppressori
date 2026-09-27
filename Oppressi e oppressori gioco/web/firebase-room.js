const SDK='https://www.gstatic.com/firebasejs/12.19.0/';
export async function connectFirebase(config){
 const [a,authApi,f]=await Promise.all([import(SDK+'firebase-app.js'),import(SDK+'firebase-auth.js'),import(SDK+'firebase-firestore.js')]);
 const app=a.initializeApp(config,'oppressi-online'),auth=authApi.getAuth(app);
 await authApi.setPersistence(auth,authApi.browserLocalPersistence);
 await auth.authStateReady();
 const user=auth.currentUser||(await authApi.signInAnonymously(auth)).user;
 return new RoomClient(f,f.getFirestore(app),user.uid);
}
export class RoomClient{
 constructor(f,db,uid){this.f=f;this.db=db;this.uid=uid;this.stops=[];this.processing=new Set();this.retries=new Set();this.code=null;this.room=null;this.heartbeat=null;this.hostLoop=false;this.onError=()=>{}}
 ref(...parts){return this.f.doc(this.db,'ooRooms',this.code,...parts)}
 async create(name,n,town){const bytes=crypto.getRandomValues(new Uint8Array(12));const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';const code=Array.from(bytes,b=>alphabet[b%alphabet.length]).join('');const ref=this.f.doc(this.db,'ooRooms',code),room=OnlineRules.create(this.uid,name,n,town);await this.f.runTransaction(this.db,async tx=>{const snap=await tx.get(ref);if(snap.exists())throw Error('Codice già usato. Riprova.');tx.set(ref,{...room,hostSeen:this.f.serverTimestamp(),createdAt:this.f.serverTimestamp()})});return code}
 async join(code,name){if(!/^[A-HJ-NP-Z2-9]{12}$/.test(code))throw Error('Il codice stanza contiene 12 lettere o numeri.');const ref=this.f.doc(this.db,'ooRooms',code);await this.f.runTransaction(this.db,async tx=>{const snap=await tx.get(ref);if(!snap.exists())throw Error('Stanza non trovata. Controlla il codice.');const room=snap.data(),next=OnlineRules.join(room,this.uid,name);if(next.revision!==room.revision)tx.update(ref,{members:next.members,memberIds:next.memberIds,revision:next.revision})})}
 watch(code,onRoom,onCommand,onError){this.stop();this.code=code;this.onError=onError;
  this.stops.push(this.f.onSnapshot(this.ref(),{includeMetadataChanges:true},snap=>{if(!snap.exists()){onError(Error('La stanza non esiste più.'));return}this.room=snap.data();onRoom(this.room,snap.metadata.fromCache);if(this.room.hostId===this.uid&&!this.hostLoop)this.runHost();},onError));
  this.stops.push(this.f.onSnapshot(this.ref('commands',this.uid),snap=>{if(snap.exists())onCommand(snap.data())},onError));
 }
 runHost(){this.hostLoop=true;const beat=()=>{if(this.code&&this.room?.phase!=='closed')this.f.updateDoc(this.ref(),{hostSeen:this.f.serverTimestamp()}).catch(this.onError)};beat();this.heartbeat=setInterval(beat,20000);
  const q=this.f.query(this.f.collection(this.db,'ooRooms',this.code,'commands'),this.f.where('status','==','pending'));
  this.stops.push(this.f.onSnapshot(q,snap=>{for(const doc of snap.docs)this.process(doc.id)},this.onError));
 }
 async process(id){if(this.processing.has(id)||!this.code)return;this.processing.add(id);const processingCode=this.code;const roomRef=this.ref(),stateRef=this.ref('private','state'),cmdRef=this.ref('commands',id);
  try{await this.f.runTransaction(this.db,async tx=>{const [rs,ss,cs]=await Promise.all([tx.get(roomRef),tx.get(stateRef),tx.get(cmdRef)]);if(!cs.exists()||cs.data().status!=='pending')return;const command=cs.data();try{if(!rs.exists()||!ss.exists())throw Error('La partita non è ancora iniziata.');const room=rs.data();if(room.hostId!==this.uid)throw Error('Facilitatore non valido.');const next=OnlineRules.apply(room,JSON.parse(ss.data().state),command);tx.set(stateRef,{state:JSON.stringify(next)});tx.update(roomRef,{game:OnlineRules.publish(next),revision:room.revision+1,phase:next.act===7?'finished':'playing'});tx.update(cmdRef,{status:'done',error:''});}catch(e){tx.update(cmdRef,{status:'rejected',error:String(e.message).slice(0,250)})}})}catch(e){this.onError(e);const retry=setTimeout(()=>{this.retries.delete(retry);if(this.code===processingCode)this.process(id)},5000);this.retries.add(retry)}finally{this.processing.delete(id)}
 }
 async start(){const seed=crypto.getRandomValues(new Uint32Array(1))[0];await this.f.runTransaction(this.db,async tx=>{const ref=this.ref(),snap=await tx.get(ref);if(!snap.exists())throw Error('Stanza non trovata.');const room=snap.data(),s=OnlineRules.start(room,this.uid,seed);tx.set(this.ref('private','state'),{state:JSON.stringify(s)});tx.update(ref,{game:OnlineRules.publish(s),phase:'playing',revision:room.revision+1})})}
 async send(action,value,revision){if(!this.room||this.room.phase!=='playing')throw Error('Nessuna partita attiva.');await this.f.setDoc(this.ref('commands',this.uid),{uid:this.uid,action,value:value??null,revision,nonce:crypto.randomUUID(),status:'pending',error:'',createdAt:this.f.serverTimestamp()})}
 async close(){await this.f.runTransaction(this.db,async tx=>{const ref=this.ref(),snap=await tx.get(ref);if(!snap.exists()||snap.data().hostId!==this.uid)throw Error('Solo il facilitatore può chiudere la stanza.');tx.update(ref,{phase:'closed',revision:snap.data().revision+1})})}
 stop(){this.retries.forEach(clearTimeout);this.retries.clear();this.stops.forEach(fn=>fn());this.stops=[];clearInterval(this.heartbeat);this.heartbeat=null;this.hostLoop=false;this.code=null;this.room=null}
}
