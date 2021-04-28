import * as Klutch from '@alloycard/klutch-components';
import { Asset } from 'expo-asset';
import moment from 'moment';
import React, { useEffect, useState } from "react";
import * as Native from "react-native";


const SimulationComponent =  ({template, type, name, data, onLoadTemplate}) => {
    
    const [content, setContent] = useState(null)
    const [templateState, setTemplateState] = useState()
    const [reRender, setReRender] = useState(0)
            
    useEffect(() => {        
        const run = async () => {
            if(template) {                
                const mod = await Asset.loadAsync(template)
                const resp = await fetch(mod[0].uri);                            
                const doc = await resp.text()               
                setContent(doc)  
            }
        }
        run()
    })

    const react = React
    const native = Native

    if (!content) {
        return <Klutch.KText>Loading...</Klutch.KText>
    }
    
    const simulationContext = {
        panel: {
            id: "123456",
            recipeInstall: {
                id: "88764",
                recipe: {
                    id: "123456",
                    name: "My Recipe"
                }    
            }
        },
        loadTemplate(templateName, templateData) {
            onLoadTemplate &&  onLoadTemplate(templateName, templateData)
        },
        setState(stateObj) {
            setTemplateState(obj => {
                var target = obj || {}
                const resp = Object.assign(target, stateObj)
                return resp
            })
            setReRender(r => r + 1)
        },        
        state: templateState,
        save(saveObj) {
            
        },
        closeMiniApp() {
            onLoadTemplate();
        },
        changePanelData(panelId, data) {

        }
    }

    const drawTemplate = function() {
        const r = eval(content)
        const React = react
        const Native = native
        const { DateTime } = require("luxon");
        return r(data, simulationContext)
    }

    if (type === "fullscreen") {
        return (
            <Klutch.KScreen>
                {drawTemplate()}
            </Klutch.KScreen>  
        )
    }

    if (type === "transaction") {
        return (
            <Klutch.KScreen>
                <Klutch.KTransactionPanel recipeName={name}>
                    {drawTemplate()}
                </Klutch.KTransactionPanel>
            </Klutch.KScreen>
        )
    }

}

export default SimulationComponent



