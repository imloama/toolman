const resolvePath = (path) => require('path').resolve(__dirname, path)

module.exports = {
  keys: 'toolm@n',
  static: {
    prefix: '/',
    dir: [resolvePath('../dist'), resolvePath('../app/public')]
  },
  cluster: {
    listen: {
	    port: 10056,
	    hostname: '127.0.0.1'
	  }
  },

}
