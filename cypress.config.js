const { defineConfig } = require('cypress')

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        setupNodeEvents(on, config) {
            return config
        },
        supportFile: false  // 👈 Isso desativa o uso do arquivo de suporte
    },
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: '/home/augusto/Documentos',
        overwrite: false,
        html: true,
        json: true
    }
})