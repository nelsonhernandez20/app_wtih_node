const https = require('https');
var rn_bridge = require('rn-bridge');

// Manejador de mensajes recibidos desde React Native
rn_bridge.channel.on('message', msg => {
  console.error('Mensaje recibido:', msg);
  if (msg === 'startRequest') {
    // Inicia la solicitud HTTPS cuando se recibe el mensaje adecuado
    const req = https.get('https://jsonplaceholder.typicode.com/posts', res => {
      const {statusCode} = res;
      if (statusCode !== 200) {
        console.error(`Request Failed.\nStatus Code: ${statusCode}`);
        res.resume(); // Consumimos datos de la respuesta para liberar memoria
        rn_bridge.channel.send(
          JSON.stringify({
            type: 'error',
            message: `Request Failed. Status Code: ${statusCode}`,
          }),
        );
        return;
      }

      res.setEncoding('utf8');

      res.on('data', chunk => {
        // Envía cada chunk a React Native tan pronto como se recibe
        rn_bridge.channel.send(JSON.stringify({type: 'data', chunk}));
      });

      res.on('end', () => {
        // Indica a React Native que no hay más datos por enviar
        rn_bridge.channel.send(JSON.stringify({type: 'end'}));
      });
    });

    req.on('error', e => {
      console.error(`Got error: ${e.message}`);
      rn_bridge.channel.send(
        JSON.stringify({type: 'error', message: e.message}),
      );
    });

    req.end();
  } else {
    // Manejar otros mensajes o acciones
    rn_bridge.channel.send(
      JSON.stringify({
        type: 'unknown',
        message: `Received unknown message: ${msg}`,
      }),
    );
  }
});
