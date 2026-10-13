// =====================================================================
// api.js – ALLE Server-Zugriffe der App passieren hier mit fetch().
// Der Server ist json-server (läuft auf Port 3000 und liest db.json).
//
// REST-Prinzip:
//   GET    = Daten holen
//   POST   = neuen Datensatz anlegen
//   DELETE = Datensatz löschen
// =====================================================================

const BASE_URL = 'http://localhost:3000'

// Hilfsfunktion: führt fetch aus, prüft den Status und wandelt JSON um.
// So müssen wir die Fehlerbehandlung nicht überall wiederholen.
async function request(path, options = {}) {
  const response = await fetch(BASE_URL + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  // response.ok ist true bei Statuscodes 200–299
  if (!response.ok) {
    throw new Error(`Serverfehler: ${response.status} ${response.statusText}`)
  }

  // DELETE liefert ein leeres Objekt zurück – trotzdem JSON
  return response.json()
}

// ---------- Räume ----------

// Alle Räume holen: GET /rooms
export function getRooms() {
  return request('/rooms')
}

// Einen Raum holen: GET /rooms/1
export function getRoom(id) {
  return request(`/rooms/${id}`)
}

// ---------- Reservierungen ----------

// Alle Reservierungen holen, sortiert nach Datum.
// "_expand=room" ist eine json-server-Funktion: hängt den passenden Raum
// (über roomId) direkt an jede Reservierung an → reservation.room.name
export function getReservations() {
  return request('/reservations?_expand=room&_sort=date,from&_order=asc,asc')
}

// Reservierungen eines bestimmten Raums: GET /reservations?roomId=1
export function getReservationsForRoom(roomId) {
  return request(`/reservations?roomId=${roomId}&_sort=date,from`)
}

// Neue Reservierung speichern: POST /reservations
// json-server vergibt die id automatisch.
export function createReservation(reservation) {
  return request('/reservations', {
    method: 'POST',
    body: JSON.stringify(reservation),
  })
}

// Reservierung löschen: DELETE /reservations/1
export function deleteReservation(id) {
  return request(`/reservations/${id}`, { method: 'DELETE' })
}
