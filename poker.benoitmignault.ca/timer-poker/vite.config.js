import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({

  plugins: [react()],

  // Définir la base pour que les ressources soient correctement chargées 
  // même si l'application est servie à partir d'un sous-répertoire
  // Surtout que en PROD : https://poker.benoitmignault.ca/timer-poker/
  base: '/timer-poker/'
})
