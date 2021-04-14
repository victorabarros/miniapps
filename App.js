import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as Klutch from '@alloycard/klutch-components'
import { useFonts, Inter_400Regular, Inter_600SemiBold,  Inter_700Bold  } from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';
import SimulationComponent from './SimulationComponent';

export default function App() {

  let [fontsLoaded] = useFonts({Inter_400Regular, Inter_600SemiBold, Inter_700Bold});

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const TEMPLATE_NAME = "ExampleScreen"


  return (
      <SimulationComponent template={require(`./dist/templates/${TEMPLATE_NAME}.template`)} />
  );
}

const styles = StyleSheet.create({

});
