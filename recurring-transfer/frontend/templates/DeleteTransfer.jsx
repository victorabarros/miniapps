Template = (data, context) => {    

    const K = Klutch

    const deletePressed = async () => {
        context.setState({loading: true})
        context.delete(`/transfer/${data.transferId}`)
        const transfers = await context.get("/transfers")
        context.loadTemplate("/templates/Main.template", {transferId: data.transferId})
    }

    return (
        <>
            <K.KHeader>ARE YOU SURE</K.KHeader>            
            <K.KText style={s.text}>You’re about to delete this recurring transfer. </K.KText>
            <K.KText style={s.text}>Revocation of authorization for a recurring transfer is not immediate. Please allow sufficient time for Klutch to act upon the notice to revoke the recurring transfer authorization.</K.KText>
            <K.KButtonBar>
                <K.KButton style={{flexBasis: 100}} type="outline" 
                        label="EXIT" 
                        onPress={() => context.loadTemplate("/templates/Main.template")}
                        /> 
                <K.KButton type="primary" 
                    label="DELETE TRANSFER" 
                    loading={context.state.loading}
                    onPress={deletePressed}
                    /> 
            </K.KButtonBar>            
        </>
    )
}


const s = {
    text: {
        textAlign: "justify",
        marginVertical: 20
    },
    title: {
        fontSize: 15
    },
    viewBox: {
        borderColor: "black", 
        borderWidth: 1, 
        borderColor: "black", 
        borderWidth: 1, 
        alignItems: "flex-start",
        justifyContent: "center", 
        padding: 20,
        marginBottom: 10
    }
}

