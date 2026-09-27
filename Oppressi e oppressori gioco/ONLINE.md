# Giocare online — progetto Firebase dedicato

## Stato

Implementate lobby, codice/link di invito, accesso anonimo, assegnazione dei personaggi, turni sincronizzati, controllo del proprietario di ciascun personaggio, rientro nello stesso browser, cronaca condivisa e chiusura stanza. Pubblicato su https://oppressi-e-oppressori.web.app/online.html. Authentication anonima attiva, regole Firestore compilate e pubblicate. Verificati sul servizio reale, con due contesti browser separati: creazione stanza, ingresso ospite, avvio, turni condivisi, blocco delle azioni fuori turno e rientro dopo ricaricamento. La stanza di verifica è stata chiusa. Le carte restano provvisorie.

## Configurazione

1. In https://console.firebase.google.com/ crea un progetto dedicato a Oppressi e Oppressori e registra un'app Web (icona </>).
2. Copia i valori della configurazione pubblica in firebase-config.js: apiKey, authDomain, projectId, appId. Non servono account di servizio o password.
3. In Authentication, abilita il provider **Anonimo**. Per prove su localhost aggiungi `127.0.0.1` e `localhost` ai domini autorizzati se richiesti dal progetto.
4. Crea Cloud Firestore, database `(default)`, edizione Standard, scegliendo la regione desiderata. Pubblica il contenuto di firestore.rules nella scheda Regole. Le regole sono per il progetto dedicato: non sostituire quelle di Study With.
5. Per provare la pagina in locale fai doppio clic su Avvia-online.cmd. Usa il server HTTP, non aprire online.html tramite file://. Tieni aperta la finestra del server. L'indirizzo 127.0.0.1 funziona solo su quel computer; per invitare altri usa il sito pubblicato.
6. Per pubblicare: installa Node.js e Firebase CLI secondo la documentazione ufficiale. Dalla cartella progetto esegui:

```powershell
& '.\.tools\python\python.exe' build_web.py
firebase login
firebase deploy --project IL_TUO_PROJECT_ID --only hosting,firestore:rules
```

La CLI richiede l'accesso all'account che possiede il progetto. Il deploy pubblica soltanto `web/`, una copia esplicita dei file del gioco. Non pubblica .tools, ZIP, test o configurazioni private. Riesegui build_web.py prima di ogni deploy dopo modifiche al gioco.

7. Apri `https://IL_TUO_PROJECT_ID.web.app/online.html`, crea la stanza e condividi l'invito. Registra il dominio pubblicato tra quelli autorizzati in Authentication se necessario.

Non sono usate Cloud Functions. L'app usa Authentication, Firestore e Hosting; utilizzo e limiti dipendono dal piano del progetto. Verifica le quote nella console prima di sessioni estese.

## Uso

- Il primo giocatore crea la stanza e fa da facilitatore. Gli altri entrano con un nome e il codice di 12 caratteri. Un link di invito compila il codice automaticamente.
- Servono almeno due persone per iniziare. Il facilitatore attende tutti e avvia la partita: da quel momento non entrano nuovi partecipanti. Gli utenti già presenti possono rientrare.
- I 15–30 personaggi sono distribuiti in ordine tra i partecipanti. Con 15–30 persone e lo stesso numero di personaggi, i personaggi usano i nomi dei giocatori.
- Ogni persona decide solo per i personaggi assegnati. Il facilitatore raccoglie la storia dei luoghi, avanza le scene concluse e conferma quando nessuno interviene. Prima di premere «Nessuno interviene», lasciate agli altri il tempo di rispondere.
- Le azioni sono trasmesse come comandi e convalidate dal browser del facilitatore. Lo stato è aggiornato con una transazione: comandi su una revisione precedente sono rifiutati.
- Il facilitatore deve tenere la pagina aperta e attiva. Se la chiude o il telefono la sospende, la partita attende. Può riprendere dallo stesso browser senza perdere lo stato. Non esiste trasferimento automatico della conduzione.
- Anche per gli ospiti il rientro richiede lo stesso browser e i dati di accesso anonimo conservati. Su un altro browser/dispositivo l'identità è diversa. Non sono previsti recupero account o sostituzione di giocatori durante la partita.
- Schede pubbliche; i voti individuali non sono inclusi nello stato condiviso fino all'epilogo. Il facilitatore è un'autorità fidata e può leggere lo stato completo. Non è un sistema competitivo con protezione contro un facilitatore ostile.
- Nessuna voce o video integrati. Parlate di persona o in una chiamata separata.
- Il codice di stanza è un invito: chi lo conosce può leggere il documento pubblico e partecipare prima dell'inizio. Non esiste una lista pubblica delle stanze. I documenti dei comandi sono leggibili solo dall'autore e dal facilitatore; il documento completo della partita solo dal facilitatore.
- «Esci» disconnette il dispositivo senza liberarne i personaggi. «Chiudi stanza» conclude la sessione per tutti. I dati chiusi restano nel database e possono essere rimossi dalla console del proprietario.

## Verifica

Verificati 8 percorsi completi con 10.040 controlli di autorizzazioni, revisioni e proiezione pubblica. Una prova con due interfacce ha completato 105 mosse sincronizzate usando il vero RoomClient su un archivio Firestore simulato: non costituisce una verifica delle regole Firestore o del servizio cloud reale.

online-integration.html esegue questa prova servendo la cartella progetto via HTTP, solo per sviluppo. Questi file di test non entrano nel sito pubblicato.

online-tests.html verifica le autorizzazioni delle azioni, la gestione delle revisioni e la riservatezza dei voti nella proiezione pubblica. I test del motore restano in tests.html. La verifica della connessione reale tra dispositivi e delle regole su Firebase richiede un progetto configurato o gli emulatori.

## Riferimenti ufficiali

- https://firebase.google.com/docs/web/alt-setup
- https://firebase.google.com/docs/auth/web/anonymous-auth
- https://firebase.google.com/docs/firestore/query-data/listen
- https://firebase.google.com/docs/firestore/manage-data/transactions
- https://firebase.google.com/docs/firestore/security/rules-conditions
- https://firebase.google.com/docs/hosting/quickstart
