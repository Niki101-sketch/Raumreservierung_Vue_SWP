<!--
  ReservationsView: zeigt alle Reservierungen als Tabelle (GET /reservations)
  und erlaubt das Stornieren (DELETE /reservations/:id).
-->
<script setup>
import { ref, onMounted } from 'vue'
import { getReservations, deleteReservation } from '../api'

const reservations = ref([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    reservations.value = await getReservations()
  } catch (e) {
    error.value = 'Reservierungen konnten nicht geladen werden: ' + e.message
  } finally {
    loading.value = false
  }
}

async function cancel(reservation) {
  // confirm() zeigt ein einfaches Ja/Nein-Fenster des Browsers
  if (!confirm(`Reservierung von ${reservation.name} wirklich stornieren?`)) return

  try {
    await deleteReservation(reservation.id)
    // Lokal aus der Liste entfernen, damit wir nicht alles neu laden müssen
    reservations.value = reservations.value.filter((r) => r.id !== reservation.id)
  } catch (e) {
    error.value = 'Löschen fehlgeschlagen: ' + e.message
  }
}

// Datum "2026-10-20" schöner als "20.10.2026" anzeigen
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-AT')
}

onMounted(load)
</script>

<template>
  <h2>Alle Reservierungen</h2>

  <p v-if="loading">Lade Reservierungen …</p>
  <p v-else-if="error" class="error">{{ error }}</p>
  <p v-else-if="reservations.length === 0" class="muted">
    Keine Reservierungen vorhanden. <RouterLink to="/reservieren">Jetzt reservieren</RouterLink>
  </p>

  <table v-else class="table">
    <thead>
      <tr>
        <th>Datum</th>
        <th>Zeit</th>
        <th>Raum</th>
        <th>Name</th>
        <th>Zweck</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="r in reservations" :key="r.id">
        <td>{{ formatDate(r.date) }}</td>
        <td>{{ r.from }}–{{ r.to }}</td>
        <!-- r.room kommt von "_expand=room"; ?. verhindert Fehler, falls der Raum fehlt -->
        <td>{{ r.room?.name ?? 'unbekannt' }}</td>
        <td>{{ r.name }}</td>
        <td>{{ r.purpose || '–' }}</td>
        <td><button class="btn btn-danger" @click="cancel(r)">Stornieren</button></td>
      </tr>
    </tbody>
  </table>
</template>
