import React from 'react';
import {View} from "react-native";
import { useFonts, Inter_400Regular, Inter_600SemiBold,  Inter_700Bold  } from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';
import SimulationComponent from './SimulationComponent';

export default function App() {

  let [fontsLoaded] = useFonts({Inter_400Regular, Inter_600SemiBold, Inter_700Bold});

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  //fullScreen
/*   const TEMPLATE_NAME = "ExampleScreen"

  
  return (
    <View style={{backgroundColor: "red"}}>
      <SimulationComponent type="fullscreen" template={require(`./dist/templates/${TEMPLATE_NAME}.template`)} />
    </View>
  );
 */
  //transactionPanel
  const TEMPLATE_NAME = "ExampleTransactionPanel"
  return (
    <View style={{backgroundColor: "#F5F5F5"}}>
      <SimulationComponent type="transactionPanel" template={require(`./dist/templates/${TEMPLATE_NAME}.template`)} />
    </View>
  );

}


