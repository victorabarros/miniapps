const clientId = "620929000316-t20imcv3nuttr4n58dedpcgrm8ag88rb.apps.googleusercontent.com"
const redirectUrl = "https://dkr0j9ba8e.execute-api.us-west-1.amazonaws.com/oauth-redirect"


Template = (data, context) => {

    return (
        <>
            <Klutch.KHeader showBackArrow>Google Sheet Exporter</Klutch.KHeader>
            <Klutch.KText style={{ textAlign: "center", marginVertical: 20 }}>Google is now connected. Transactions will be exported to Google Sheets</Klutch.KText>                        
        </>
    )
}

