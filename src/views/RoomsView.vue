<!--
  RoomsView: lädt alle Räume vom Server (GET /rooms) und zeigt sie als Karten an.
-->
<script setup>
import { ref, onMounted } from 'vue'
import { getRooms } from '../api'
import RoomCard from '../components/RoomCard.vue'

// ref() = reaktive Variable. Ändert sich der Wert, aktualisiert Vue die Anzeige automatisch.
const rooms = ref([])
const loading = ref(true)
const error = ref('')

// onMounted läuft, sobald die Seite angezeigt wird → perfekter Zeitpunkt zum Laden.
onMounted(async () => {
  try {
    rooms.value = await getRooms()
  } catch (e) {
    error.value = 'Räume konnten nicht geladen werden. Läuft der Server? (' + e.message + ')'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <h2>Verfügbare Räume</h2>

  <!-- v-if / v-else-if / v-else: je nach Zustand etwas anderes anzeigen -->
  <p v-if="loading">Lade Räume …</p>
  <p v-else-if="error" class="error">{{ error }}</p>

  <div v-else class="grid">
    <RoomCard v-for="room in rooms" :key="room.id" :room="room" />
  </div>
</template>
