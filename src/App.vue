<!--
  App.vue = Grundgerüst der Seite: Kopfzeile mit Navigation.
  <RouterView /> ist der Platzhalter, in dem der Router die aktuelle Seite anzeigt.
-->
<template>
  <header class="topbar">
    <h1>🏫 Raumreservierung</h1>
    <nav>
      <RouterLink to="/">Räume</RouterLink>
      <RouterLink to="/reservieren">Reservieren</RouterLink>
      <RouterLink to="/reservierungen">Reservierungen</RouterLink>
    </nav>
  </header>

  <main class="container">
    <RouterView />
  </main>
</template>
