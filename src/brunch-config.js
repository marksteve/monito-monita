module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^(?!app)/,
        'app.js': /^app/
      }
    },
    stylesheets: {joinTo: 'app.css'}
  },

  plugins: {
    babel: {
      presets: ['es2015'],
      plugins: ['transform-vue-jsx']
    }
  },

  overrides: {
    production: {
      paths: {public: '../'}
    }
  }
};
