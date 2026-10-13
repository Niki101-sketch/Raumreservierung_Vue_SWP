# Raumreservierung (Vue 3 + json-server)

Kleines SWP-Schulprojekt: Räume anzeigen, reservieren und Reservierungen verwalten.
Alle Daten werden mit `fetch()` von einem REST-Server (json-server) geladen und gespeichert.

## Starten

```bash
npm install     # einmalig: Abhängigkeiten installieren
npm start       # startet Server (Port 3000) UND Vue-App (Port 5173) gleichzeitig
```

Dann im Browser öffnen: <http://localhost:5173>

Einzeln starten geht auch: `npm run server` und `npm run dev` (in zwei Terminals).

## Aufbau

```
db.json                       ← "Datenbank" des Servers (Räume + Reservierungen)
src/
  api.js                      ← ALLE fetch()-Aufrufe an den Server
  main.js                     ← Einstiegspunkt, startet Vue + Router
  App.vue                     ← Grundgerüst: Kopfzeile + Navigation + <RouterView>
  router/index.js             ← welche URL zeigt welche Seite
  components/RoomCard.vue     ← Karte für einen Raum (bekommt Daten per props)
  views/
    RoomsView.vue             ← Seite "Räume"          → GET /rooms
    ReserveView.vue           ← Seite "Reservieren"    → GET /rooms, GET /reservations?roomId=…, POST /reservations
    ReservationsView.vue      ← Seite "Reservierungen" → GET /reservations?_expand=room, DELETE /reservations/:id
  style.css                   ← globales CSS
```

## Server-Endpunkte (json-server)

| Methode | URL                                  | Zweck                                   |
|---------|--------------------------------------|-----------------------------------------|
| GET     | `/rooms`                             | alle Räume                              |
| GET     | `/reservations?_expand=room`         | alle Reservierungen inkl. Raumdaten     |
| GET     | `/reservations?roomId=1`             | Reservierungen eines Raums              |
| POST    | `/reservations`                      | neue Reservierung anlegen               |
| DELETE  | `/reservations/1`                    | Reservierung löschen                    |

json-server schreibt Änderungen direkt in `db.json` – neue Reservierungen bleiben also gespeichert.

## Wichtige Vue-Konzepte im Projekt

- **`ref()`** – reaktive Variablen: ändert sich der Wert, aktualisiert sich die Anzeige.
- **`onMounted()`** – Code, der beim Anzeigen einer Seite läuft (hier: Daten laden).
- **`watch()`** – reagiert auf Änderungen (hier: anderer Raum gewählt → Buchungen neu laden).
- **`v-for`, `v-if`, `v-model`** – Listen, Bedingungen, Formular-Bindung.
- **props** – Daten von Eltern- an Kind-Komponente übergeben (`RoomCard`).
- **Vue Router** – mehrere Seiten ohne Neuladen, inkl. URL-Parameter (`/reservieren/3`).
