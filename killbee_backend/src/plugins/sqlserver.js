var Connection = require('tedious').Connection;  

class Sqlserver {

  constructor() {
    this._connect()
  }
  
  _connect() {

    let config = { 
      server: URL_SQL + '.' + DB_NAME_SQL + '.windows.net',
      authentication: {
          type: 'default',
          options: {
              userName: USERNAME_SQL,
              password: PASSWORD_SQL
          }
      },
      options: {
          
      }
    };

    let connection = new Connection(config);  
    connection.on('connect', function(err) {  
        // If no error, then good to proceed.
        if(!err) {
          console.log("Connected to SQL SERVER");
        } else {
          console.error(err);
        }
    });    
    return connection.connect();

  }

}
