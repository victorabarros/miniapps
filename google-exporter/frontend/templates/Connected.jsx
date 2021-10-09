const clientId = "620929000316-t20imcv3nuttr4n58dedpcgrm8ag88rb.apps.googleusercontent.com"
const redirectUrl = "https://dkr0j9ba8e.execute-api.us-west-1.amazonaws.com/oauth-redirect"


Template = (data, context) => {

    context.init(() => {
        context.setState({sheetName: "Klutch Transactions"})
    })

    const openGoogle = () => {
        var state = `{"sheetName": "${context.state.sheetName}", "recipeInstallId": "${context.recipeInstallId}"}`
        context.openExternalUrl(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code&scope=https://www.googleapis.com/auth/spreadsheets&access_type=offline&state=${state}`)
    }

    if (!context.state) {
        return (<Klutch.KText>Loading...</Klutch.KText>)
    }
    return (
        <>
            <Klutch.KHeader showBackArrow>Google Sheet Exporter</Klutch.KHeader>
            <Klutch.KText style={{ textAlign: "center", marginVertical: 20 }}>Google is now connected. Transactions will be exported to Google Sheets</Klutch.KText>                        
        </>
    )
}

