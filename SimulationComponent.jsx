import React, { useEffect, useState } from "react"
import * as Native from "react-native"
import { useAssets, Asset } from 'expo-asset';
import {Text} from "react-native";
import * as FileSystem from 'expo-file-system';
import * as Klutch from '@alloycard/klutch-components'

const SimulationComponent =  ({template, type}) => {
    
    const [templateAsset] = useAssets([template])    
    const [content, setContent] = useState(null)
    
    useEffect(() => {
        const run = async () => {
            if(templateAsset) {
                const doc = await FileSystem.readAsStringAsync(templateAsset[0].localUri)               
                setContent(doc)  
            }
        }
        run()
    }, [templateAsset])

    const react = React
    const native = Native

    if (!content) {
        return <Klutch.KText>Loading...</Klutch.KText>
    }
    
    const drawTemplate = function() {
        const r = eval(content)
        const React = react
        const Native = native
        return r()
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
                <Klutch.KTransactionPanel>
                    {drawTemplate()}
                </Klutch.KTransactionPanel>
            </Klutch.KScreen>
        )
    }

}

export default SimulationComponent