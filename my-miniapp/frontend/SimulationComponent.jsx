import * as Klutch from '@klutchcard/klutch-components';
import { Asset } from 'expo-asset';
import React, { useEffect, useState, useCallback } from "react";
import equal from "deep-equal";
import axios from "axios";
import * as Linking from 'expo-linking';



const SimulationComponent =  ({serverUrl, token, template, type, name, data, onLoadTemplate, panelConfigCallback, recipeInstallId}) => {
    
    const [content, setContent] = useState(null)
    const [templateState, setTemplateState] = useState()
    const [reRender, setReRender] = useState(0)
    const [config, setConfig] = useState({})
    const [initCallback, setInitCallback] = useState()
    const [init, setInit] = useState(false)
            
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


    useEffect(() => {        
        setInit(false)
    }, [template])


    useEffect(() => {
        if (initCallback) {

            if (isPromise(initCallback)) {
                initCallback.then()
            } else {
                initCallback()    
            }            
        }
    }, [init])

    const react = React    

    if (!content) {
        return <Klutch.KText>Loading...</Klutch.KText>
    }
    
    const simulationContext = {        
        loadTemplate(templateName, templateData) {
            onLoadTemplate &&  onLoadTemplate(templateName, templateData)
        },
        setState(stateObj) {
            setTemplateState(obj => {
                var target = obj || {}
                const resp = Object.assign(target, stateObj)
                setReRender(r => r + 1)
                return resp    
            })            
        },                  
        state: templateState,
        recipeInstallId: recipeInstallId,
        async post(path, data) {
            try {
                const resp = await axios.post(`${serverUrl}${path}`, data, {                
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }                    
                })
                return resp.data
            } catch (e) {
                console.error("Error on post ", e)
            }
           
        },
        async get(path, data) {
            try {                
                const resp = await axios.get(`${serverUrl}${path}`, {                    
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    data: data                
                })                
                return resp.data  
            } catch (e) {
                console.error(e)
            }
        },
        async delete(path, data) {
            try {                
                const resp = await axios.delete(`${serverUrl}${path}`, {                    
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    data: data                
                })                
                return resp.data  
            } catch (e) {
                console.error(e)
            }
        },        
        openExternalUrl(url) {
            Linking.openURL(url);
        },
        closeMiniApp() {
            onLoadTemplate();
        },
        changePanelData(panelId, data) {

        },
        setPanelConfig(conf) {
            if (!equal(config,conf)) {
                setConfig(conf)
            }            
        }, 
        init(callback) {
            if(!init) {
                setInitCallback(callback)
                setInit(true)    
            }
        }
    }

    const drawTemplate = function() {
        const r = eval(content)
        const React = react
        const { DateTime } = require("luxon");
        const Victory = require("victory-native")
        const AlloyJS = require("@klutchcard/alloy-js")
        return r(data, simulationContext)
    }


    if (type === "fullscreen") {
        return (
            <Klutch.KScrollScreen style={config.backgroundColor ? {backgroundColor: config}: null}>
                {drawTemplate()}
            </Klutch.KScrollScreen>  
        )
    } else {
        return (
            <Klutch.KScreen>
                <Klutch.KMiniAppPanel recipeName={name} panelStyle={type}>
                    {drawTemplate()}
                </Klutch.KMiniAppPanel>
            </Klutch.KScreen>
        )

    }

}

const isPromise = v => typeof v === 'object' && typeof v.then === 'function'

export default SimulationComponent



