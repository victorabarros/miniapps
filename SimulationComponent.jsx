import React, { useEffect, useState } from "react"
import * as Native from "react-native"
import { useAssets, Asset } from 'expo-asset';
import {Text} from "react-native";
import * as FileSystem from 'expo-file-system';
import * as Klutch from '@alloycard/klutch-components'

const SimulationComponent =  ({template}) => {
    
    const [markdownAsset] = useAssets([template])    
    const [content, setContent] = useState(null)

    console.log(markdownAsset)
    useEffect(() => {
        const run = async () => {
            if( markdownAsset) {
                const doc = await FileSystem.readAsStringAsync(markdownAsset[0].localUri)
                console.log(doc)  
                setContent(doc)  
            }
        }
        run()
    }, [markdownAsset])

    const react = React
    const native = Native

    if (!content) {
        return <Klutch.KText>Loading...</Klutch.KText>
    }
    
    return (
        function() {
            const r = eval(content)
            const React = react
            const Native = native
            return r()
        }()        
    )
}

export default SimulationComponent