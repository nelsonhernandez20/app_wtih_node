import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

// Componente Section omitido por brevedad, asumiendo que sigue siendo el mismo

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // Hook useEffect para manejar componentDidMount en un componente funcional
  useEffect(() => {
    nodejs.start('main.js');
    nodejs.channel.addListener('message', msg => {
      const messageObj = JSON.parse(msg);
      if (messageObj.type === 'data') {
        // Procesa el chunk de datos recibido
        console.log('Chunk received:', messageObj.chunk);
      } else if (messageObj.type === 'end') {
        // Maneja el fin de la transmisión de datos
        console.log('No more data in response.');
      } else if (messageObj.type === 'error') {
        // Maneja un error en la solicitud
        console.error('Error:', messageObj.message);
      } else if (messageObj.type === 'unknown') {
        // Maneja mensajes desconocidos
        console.log('Unknown message:', messageObj.message);
      }
    });
    setTimeout(() => {
      // Envía un mensaje o datos a Node.js
      nodejs.channel.send('startRequest');
    }, 1000); // Ajusta este tiempo según sea necesario
  }, []); // El array vacío indica que este efecto solo se ejecuta una vez, al montar el componente

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        {/* El contenido de tu ScrollView aquí */}
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos omitidos por brevedad

export default App;
