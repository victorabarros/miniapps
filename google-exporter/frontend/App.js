import React, { useEffect, useState } from 'react';
import {View} from "react-native";
import { useFonts, Inter_400Regular, Inter_600SemiBold,  Inter_700Bold  } from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';
import SimulationComponent from './SimulationComponent';
import {KText, KButton, KScreen} from "@alloycard/klutch-components"
import AlloyJS, { AuthService, GraphQLService} from '@alloycard/alloy-js';
import Constants from 'expo-constants';
import {gql} from "graphql-tag"

/* MINIAPP CONFIGURATION */


const APPNAME = "DEMO APP"

const Templates = {
  Main: {type: "fullscreen", template: require(`./dist/templates/Main.template`)},
  Transaction: {type: "transaction", template: require(`./dist/templates/Transaction.template`)},
  Home: {type: "home", template: require(`./dist/templates/Home.template`)},
}

const initialData = {
  transaction: {
      id: "0d2b05d9-68fd-4dd3-a354-25199bd55d48",
      merchantName: "Sport's Academy",
      cardName: "Shopping Card",
      amount: 453.20,
      category: "SHOPPING",
      date: new Date("2021-03-25T11:43:23Z")                
  }    
}

const RECIPEID = "d0e8685b-4396-4d4c-8009-6d4d90ac90b9"
const RECIPEINSTALLID = "<<RECIPE INSTALL ID>>"
const SERVERURL = "<<YOUR SERVER"


/* END MINIAPP CONFIGURATION */

const envFields = Constants.manifest?.extra 
if (!envFields) {
  throw new Error("Cannot read environment")
}



export default function App() {

  let [fontsLoaded] = useFonts({Inter_400Regular, Inter_600SemiBold, Inter_700Bold});
  const [templateToLoad, setTemplateToLoad]  = useState()
  const [templateData, setTemplateData] = useState(initialData)
  const [token, setToken] = useState("")
  const [bgColor, setBgColor] = useState("")



  useEffect(() => {
    AlloyJS.configure({
      serverUrl: envFields.serverUrl, 
      userPoolClientId: envFields.userPoolClientId,
      userPoolServer: envFields.userPoolServer           
    })      
    if (RECIPEINSTALLID == "<<RECIPE INSTALL ID>>") {
      return
    }
    const run = async () => {      
      await AuthService.signIn(envFields.userName, envFields.password)      
      try {
        const resp = await GraphQLService.mutation(gql`
        mutation($recipeId: String, $recipeInstallId: String) {
          developer {
            myRecipe(recipeId: $recipeId) {
              recipeInstall(recipeInstallId: $recipeInstallId) {
                createToken
              }
            }
          }
        }        
      `, {recipeId: RECIPEID,recipeInstallId: RECIPEINSTALLID})                 
      setToken(resp.developer.myRecipe.recipeInstall.createToken)    
      } catch (e) {
        console.error(e)
      }      
    }
    run()
  }, [])

  
  if (!fontsLoaded) {
    return <AppLoading />;
  }


  
  if (!templateToLoad) {
    const buttonStyle = {marginVertical: 10}
    

    return (
      <KScreen style={{flex: 1, marginVertical: 30, justifyContent: 'space-evenly'}}>
        {token ? (<KText>Retrieved Token</KText>) : null}                
        <KText>What template do you want to open?</KText>
        <KButton type="primary" style={buttonStyle} label="Main" onPress={() => setTemplateToLoad(Templates.Main)} />
        <KButton type="primary" style={buttonStyle} label="Transaction Panel" onPress={() => setTemplateToLoad(Templates.Transaction)} />
        <KButton type="primary" style={buttonStyle} label="Home Panel" onPress={() => setTemplateToLoad(Templates.Home)} />      
      </KScreen>
    )  
  }
  
  const onLoadTemplate = (templateName, templateData) => {
    setTemplateData(templateData)  
    setTemplateToLoad(templateName)    
  }

  
  return (
    <View>
      <SimulationComponent 
        recipeId={RECIPEID}
        recipeInstallId={RECIPEINSTALLID}
        serverUrl={SERVERURL}
        name={APPNAME} 
        type={templateToLoad.type} 
        template={templateToLoad.template} 
        data={templateData}
        token={token}       
        onLoadTemplate={onLoadTemplate} />
    </View>
  );
}


