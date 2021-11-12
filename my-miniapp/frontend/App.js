import React, { useEffect, useState } from 'react';
import {View} from "react-native";
import { useFonts, Inter_400Regular, Inter_600SemiBold,  Inter_700Bold  } from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';
import SimulationComponent from './SimulationComponent';
import {KText, KButton, KScreen} from "@klutchcard/klutch-components"
import AlloyJS, { AuthService, GraphQLService} from '@klutchcard/alloy-js';
import Constants from 'expo-constants';
import {gql} from "graphql-tag"

/* MINIAPP CONFIGURATION */


const APPNAME = "DEMO APP"

const Templates = {
  Main: {type: "fullscreen", 
      template: require(`./dist/templates/Main.template`),
      path: `/templates/Main.template`},
  Transaction: {type: "transaction", 
      template: require(`./dist/templates/Transaction.template`),
      path: `/templates/Transaction.template`
    },
  Home: {type: "home", 
    path: `/templates/Home.template`,
    template: require(`./dist/templates/Home.template`)}   
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




/* END MINIAPP CONFIGURATION */

const envFields = Constants.manifest?.extra 
if (!envFields) {
  throw new Error("Cannot read environment")
}

const RECIPEID = envFields.RecipeId
const RECIPEINSTALLID = envFields.RecipeInstallId
const SERVERURL = envFields.MiniAppServerUrl



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
    var t = templateName
    if (typeof templateName == 'string') {
      var name = Object.keys(Templates).find(x =>  Templates[x].path == templateName)
      t = Templates[name]
    }
    setTemplateData(templateData)  
    setTemplateToLoad(t)    
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


