import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { registerSW } from 'virtual:pwa-register'

import App from './App.vue'
import router from './router'
import { modalService } from '@/services/modal/service'
import './app.scss'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.mount('#app')

let isUpdatePromptVisible = false

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh: async () => {
    if (isUpdatePromptVisible) return

    isUpdatePromptVisible = true
    const confirmed = await modalService.open({
      type: 'confirmation',
      title: 'Update Available',
      body: 'A new app version is ready. Reload now to use the latest changes.',
      confirmButtonText: 'Update now',
      cancelButtonText: 'Later',
      canClose: true,
    })
    isUpdatePromptVisible = false

    if (confirmed) {
      updateSW(true)
    }
  },
})
