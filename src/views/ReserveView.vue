<!--
  ReserveView: Formular für eine neue Reservierung.
  - lädt die Räume für das Dropdown (GET /rooms)
  - zeigt die bestehenden Buchungen des gewählten Raums (GET /reservations?roomId=…)
  - speichert die neue Reservierung (POST /reservations)
-->
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRooms, getReservationsForRoom, createReservation } from '../api'

const route = useRoute()
const router = useRouter()

const rooms = ref([])
const roomReservations = ref([])
const error = ref('')
const saving = ref(false)

// Formulardaten. Mit v-model sind die Eingabefelder direkt an diese Werte gebunden.
const form = ref({
  roomId: route.params.roomId ? Number(route.params.roomId) : '',
  name: '',
  date: '',
  from: '',
  to: '',
  purpose: '',
})

onMounted(async () => {
  try {
    rooms.value = await getRooms()
  } catch (e) {
    error.value = 'Räume konnten nicht geladen werden: ' + e.message
  }
})

// watch: Wenn sich der gewählte Raum ändert, laden wir dessen Reservierungen neu.
// immediate: true → auch gleich beim Start ausführen (wenn Raum vorausgewählt ist).
watch(
  () => form.value.roomId,
  async (roomId) => {
    try {
      roomReservations.value = roomId ? await getReservationsForRoom(roomId) : []
    } catch (e) {
      error.value = 'Buchungen konnten nicht geladen werden: ' + e.message
    }
  },
  { immediate: true },
)

async function submit() {
  error.value = ''

  // Einfache Prüfung: Endzeit muss nach Startzeit liegen.
  // (Uhrzeiten im Format "HH:MM" kann man direkt als Text vergleichen.)
  if (form.value.from >= form.value.to) {
    error.value = 'Die Endzeit muss nach der Startzeit liegen.'
    return
  }

  saving.value = true
  try {
    await createReservation({ ...form.value })
    // Nach dem Speichern zur Übersicht wechseln
    router.push('/reservierungen')
  } catch (e) {
    error.value = 'Speichern fehlgeschlagen: ' + e.message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <h2>Raum reservieren</h2>

  <!-- @submit.prevent: verhindert das Neuladen der Seite und ruft submit() auf -->
  <form class="form" @submit.prevent="submit">
    <label>
      Raum
      <select v-model.number="form.roomId" required>
        <option value="" disabled>– bitte wählen –</option>
        <option v-for="room in rooms" :key="room.id" :value="room.id">
          {{ room.name }} ({{ room.capacity }} Plätze)
        </option>
      </select>
    </label>

    <label>
      Name
      <input v-model.trim="form.name" type="text" placeholder="Vor- und Nachname" required />
    </label>

    <label>
      Datum
      <input v-model="form.date" type="date" required />
    </label>

    <div class="row">
      <label>
        Von
        <input v-model="form.from" type="time" required />
      </label>
      <label>
        Bis
        <input v-model="form.to" type="time" required />
      </label>
    </div>

    <label>
      Zweck
      <input v-model.trim="form.purpose" type="text" placeholder="z.B. Unterricht, Besprechung" />
    </label>

    <p v-if="error" class="error">{{ error }}</p>

    <button class="btn" type="submit" :disabled="saving">
      {{ saving ? 'Speichere …' : 'Reservierung speichern' }}
    </button>
  </form>

  <!-- Bestehende Buchungen des gewählten Raums, damit man freie Zeiten sieht -->
  <section v-if="form.roomId" class="booked">
    <h3>Bereits gebucht in diesem Raum</h3>
    <p v-if="roomReservations.length === 0" class="muted">Noch keine Reservierungen.</p>
    <ul v-else>
      <li v-for="r in roomReservations" :key="r.id">
        {{ r.date }}, {{ r.from }}–{{ r.to }} · {{ r.name }}
      </li>
    </ul>
  </section>
</template>
