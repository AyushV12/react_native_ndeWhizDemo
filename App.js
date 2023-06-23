import React , {useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AuthStack from './src/navigation/AuthStack';
import { Provider as PaperProvider , DefaultTheme} from 'react-native-paper';
import colors from './src/constants/colors';

function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      secondary: colors.accent,
    },
  };

  useEffect(() => {
    
  }, []);

  
  return (
      <PaperProvider theme={theme}>
        <NavigationContainer>
            <AuthStack />
          </NavigationContainer>
      </PaperProvider>
  );
}

export default App;
