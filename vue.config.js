module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: {
      '/api': {
        target: "therainisme.com:8088",
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  },
}