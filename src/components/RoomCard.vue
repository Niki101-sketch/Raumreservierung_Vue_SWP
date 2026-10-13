<!--
  RoomCard = wiederverwendbare Komponente, die EINEN Raum als Karte anzeigt.
  Sie bekommt die Daten von außen über "props" (vom Eltern-Element RoomsView).
-->
<script setup>
defineProps({
  room: { type: Object, required: true },
})
</script>

<template>
  <article class="card">
    <h3>{{ room.name }}</h3>
    <p class="muted">{{ room.building }}</p>
    <p>👥 {{ room.capacity }} Plätze</p>

    <!-- v-for: für jedes Ausstattungs-Element ein "Badge" anzeigen -->
    <div class="badges">
      <span v-for="item in room.equipment" :key="item" class="badge">{{ item }}</span>
    </div>

    <!-- Link zur Reservierungsseite, Raum wird über die URL vorausgewählt -->
    <RouterLink :to="`/reservieren/${room.id}`" class="btn">Reservieren</RouterLink>
  </article>
</template>
