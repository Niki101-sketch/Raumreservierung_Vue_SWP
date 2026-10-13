// Der Router entscheidet anhand der URL, welche Seite (View) angezeigt wird.
import { createRouter, createWebHistory } from 'vue-router'
import RoomsView from '../views/RoomsView.vue'
import ReserveView from '../views/ReserveView.vue'
import ReservationsView from '../views/ReservationsView.vue'

const routes = [
  { path: '/', name: 'rooms', component: RoomsView },
  // ":roomId?" ist ein optionaler Parameter → /reservieren/3 wählt Raum 3 vor
  { path: '/reservieren/:roomId?', name: 'reserve', component: ReserveView },
  { path: '/reservierungen', name: 'reservations', component: ReservationsView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
