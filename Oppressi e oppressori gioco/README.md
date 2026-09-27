# Oppressi & Oppressori — prototipo giocabile

Apri index.html con Chrome, Edge o Firefox. Non servono installazioni o Internet.

- Le nuove partite sono di gruppo: inserite da 2 a 30 partecipanti. I 15–30 personaggi vengono distribuiti tra voi; se siete pochi, ciascuno interpreta più abitanti. Questa è una variante digitale per gruppi piccoli.
- Una schermata indica a chi passare il computer prima di ogni scelta individuale. Luoghi e interventi dei Giusti si decidono insieme. Nessuna decisione automatica nelle nuove partite.
- Le precedenti partite singole restano importabili e giocabili.
- Gruppo: i giocatori controllano tutti gli abitanti sullo stesso computer.
- 15–30 personaggi, cinque luoghi e gruppi di Legami, cinque atti, voto ponderato ed epilogo.
- Salvataggio automatico nel browser, esportazione/importazione JSON e annullamento delle ultime 100 azioni della sessione.

## Fonte e limiti

Basato sul PDF fornito dall’utente, Oppressi & Oppressori. Tu da che parte stai?, Maria Guarneri e Oscar Biffi, NessunDove / Fondazione Gariwo, 2023. Adattamento sperimentale non ufficiale.

Il PDF descrive un gioco di ruolo dal vivo per 15–30 persone. Non include il testo delle 76 carte. Questo prototipo usa carte narrative originali provvisorie, da sostituire quando saranno disponibili quelle autentiche. Non è una riproduzione completa del gioco originale.

Adattamenti espliciti:

- Gruppi casuali equilibrati, nomi propri e cinque luoghi fissi; il giocatore scrive la storia dei luoghi.
- Scene sequenziali senza timer invece delle attività contemporanee dal vivo.
- Attività quotidiane e reazioni probabilistiche inventate per consentire una partita in singolo. Nessuna IA esterna.
- Catena delle accuse senza Legami, con filtro aggiuntivo contro vicoli ciechi.
- In Atto IV bersagli Oppressi non Legami; sostituzione con un altro Oppresso.
- In Atto V priorità ai Legami Oppressi; sostituzione solo con un Legame, anche Oppressore. La fazione originaria non cambia.
- Una sola sostituzione per scena. Intervento dei Giusti da parte degli spettatori. Carte disponibili: ceil(partecipanti / 5), come nella tabella del PDF.
- Carte Giusto provvisorie: fermano l’ordine e registrano un costo narrativo. Nessun costo meccanico ufficiale ricostruito.
- Schede pubbliche, nessuna rete o stanza multiplayer. La mappa illustra luoghi e Legami, non gli spostamenti dei personaggi.
- Voto: Oppressore peso 2, Oppresso peso 1. Mani residue max(0, favorevoli - contrarie); almeno una rimuove la Linea.

## File

engine.js: stato, casualità riproducibile e controlli sulle azioni. app.js: interfaccia, salvataggi e narrazione. style.css: grafica responsiva. tests.html: test eseguibili aprendo il file nel browser. .tools/: Python portatile e pypdf usati solo per leggere il regolamento, non necessari per giocare.

Il salvataggio automatico dipende dal browser; l’esportazione JSON è il modo per conservare o trasferire una partita. L’annullamento non persiste dopo la chiusura della pagina.

## Modalità online

Apri Avvia-online.cmd per la pagina online in locale. Configurazione e pubblicazione del progetto Firebase dedicato sono descritte in ONLINE.md. Il sito pubblico è attivo su https://oppressi-e-oppressori.web.app/online.html, con accesso anonimo e stanze condivise verificati. La modalità locale resta disponibile aprendo index.html.
