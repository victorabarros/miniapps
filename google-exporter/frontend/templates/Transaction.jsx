Template = (data, context) => {

    return (
        <>
            <Klutch.KText style={{ marginTop: 10 }}>Synced to row {data.row} on {data.sheetName}</Klutch.KText>
        </>
    )
}