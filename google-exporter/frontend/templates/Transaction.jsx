Template = (data, context) => {

    return (
        <>
            <Klutch.KText style={{marginTop: 10}}>Exported to {data.sheetName}, row {data.row}</Klutch.KText>
        </>
    )
}