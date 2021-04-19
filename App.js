import React, { useState } from 'react';
import {View} from "react-native";
import { useFonts, Inter_400Regular, Inter_600SemiBold,  Inter_700Bold  } from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';
import SimulationComponent from './SimulationComponent';
import {KText, KButton, KScreen} from "@alloycard/klutch-components"

export default function App() {

  let [fontsLoaded] = useFonts({Inter_400Regular, Inter_600SemiBold, Inter_700Bold});
  const [templateToLoad, setTemplateToLoad]  = useState()

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  if (!templateToLoad) {
    const buttonStyle = {marginVertical: 10}

    return (
      <KScreen style={{flex: 1, marginVertical: 30, justifyContent: 'space-evenly'}}>
        <KText>What template do you want to open?</KText>
        <KButton type="primary" style={buttonStyle} label="Main" onPress={() => setTemplateToLoad({type: "fullscreen", template: require(`./dist/templates/Main.template`)})} />
        <KButton type="primary" style={buttonStyle} label="Transaction Panel" onPress={() => setTemplateToLoad({type: "transaction", template: require(`./dist/templates/Transaction.template`)})} />
        <KButton type="primary" style={buttonStyle} label="Home Panel" onPress={() => setTemplateToLoad({type: "home", template: require(`./dist/templates/Home.template`)})} />      
      </KScreen>
    )  
  }
  
  return (
    <View>
      <SimulationComponent type={templateToLoad.type} template={templateToLoad.template} />
    </View>
  );
}


