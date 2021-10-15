const clientId = "620929000316-t20imcv3nuttr4n58dedpcgrm8ag88rb.apps.googleusercontent.com"
const redirectUrl = "https://googleexporter.klutchcard.com/oauth-redirect"


Template = (data, context) => {

    context.init(() => {
        context.setState({sheetName: "Klutch Transactions"})
    })

    const openGoogle = () => {
        var state = `{"sheetName": "${context.state.sheetName}", "recipeInstallId": "${context.recipeInstallId}"}`
        context.openExternalUrl(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code&scope=https://www.googleapis.com/auth/spreadsheets&access_type=offline&state=${state}`)
        context.closeMiniApp()
    }

    if (!context.state) {
        return (<Klutch.KText>Loading...</Klutch.KText>)
    }
    return (
        <>
            <Klutch.KHeader showBackArrow>Google Sheet Exporter</Klutch.KHeader>
            <Klutch.KText style={{ textAlign: "center", marginVertical: 20 }}>Please type a sheet name and click on the connect button to start synching your transactions</Klutch.KText>            
            <Klutch.KForm style={{marginTop: 20}}>
                <Klutch.KTextInput 
                    label="SHEET NAME"
                    value={context.state.sheetName}                    
                    onChangeText={text => context.setState({sheetName: text})}            
                />                
                <Klutch.KButtonBar>
                    <Klutch.KButton type="primary" label="Connnect to Google" onPress={() => openGoogle()} />
                </Klutch.KButtonBar>     
            </Klutch.KForm>
        </>
    )
}

