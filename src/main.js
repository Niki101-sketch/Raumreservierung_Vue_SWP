// Einstiegspunkt der App: erstellt die Vue-App, hängt den Router an
// und "mountet" sie in das <div id="app"> aus index.html.
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

createApp(App).use(router).mount('#app')
