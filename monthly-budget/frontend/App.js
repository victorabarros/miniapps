import React, { useState } from 'react';
import { View } from "react-native";
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';
import SimulationComponent from './SimulationComponent';
import { KText, KButton, KScreen } from "@klutchcard/klutch-components"


/* MINIAPP CONFIGURATION */

const APPNAME = "Demo MiniApp"

const Templates = {
  Main: { filename: "/templates/Main.template", type: "fullscreen", template: require(`./dist/templates/Main.template`) },
  Home: { filename: "/templates/Home.template", type: "fullscreen", template: require(`./dist/templates/Home.template`) },
  New: { filename: "/templates/New.template", type: "fullscreen", template: require(`./dist/templates/New.template`) },
  Edit: { filename: "/templates/Edit.template", type: "fullscreen", template: require(`./dist/templates/Edit.template`) },
  HomePanel: { filename: "/templates/HomePanel.template", type: "home", template: require(`./dist/templates/HomePanel.template`) },
}

const initialData = {}

/* END MINIAPP CONFIGURATION */

export default function App() {
  let [fontsLoaded] = useFonts({ Inter_400Regular, Inter_600SemiBold, Inter_700Bold });
  const [templateToLoad, setTemplateToLoad] = useState()
  const [templateData, setTemplateData] = useState(initialData)

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  if (!templateToLoad) {
    const buttonStyle = { marginVertical: 10 }

    return (
      <KScreen style={{ flex: 1, marginVertical: 30, justifyContent: 'space-evenly' }}>
        <KText>What template do you want to open?</KText>
        <KButton type="primary" style={buttonStyle} label="Main" onPress={() => setTemplateToLoad(Templates.Main)} />
        <KButton type="primary" style={buttonStyle} label="New" onPress={() => setTemplateToLoad(Templates.New)} />
        <KButton type="primary" style={buttonStyle} label="Home Panel" onPress={() => setTemplateToLoad(Templates.HomePanel)} />
      </KScreen>
    )
  }

  const onLoadTemplate = (templateName, templateData) => {
    setTemplateData(templateData)
    const template = Object.keys(Templates).map(c => Templates[c]).find(c => c.filename == templateName)
    setTemplateToLoad(template)
  }

  return (
    <View>
      <SimulationComponent
        name={APPNAME}
        type={templateToLoad.type}
        template={templateToLoad.template}
        data={templateData}
        onLoadTemplate={onLoadTemplate} />
    </View>
  );
}
