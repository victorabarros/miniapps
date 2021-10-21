Template = (data, context) => {    

    const K = Klutch

    context.init(async () => {
        const transfers = await context.get("/transfers")
        context.setState({transfers})
    })


    if (!context.state || !context.state.transfers) {
        return (
            <K.KView style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                <K.KLoadingIndicator />
            </K.KView>)
    }

    if (data != context.state.transfers) {
        const run = async () => {
            const transfers = await context.get("/transfers")
            context.setState({transfers})    
        }
        run()
    }

    const deletePressed = async (transferId) => {
            context.loadTemplate("/templates/DeleteTransfer.template", {transferId: transferId})
    }

    return (
        <>
            <K.KHeader showBackArrow>SCHEDULED TRANSFERS</K.KHeader>            
            <K.KPressable onPress={() => context.loadTemplate("/templates/AddTransfer.template", {})}>
                <K.KView style={s.viewBox}>
                    <K.PlusSign color={K.KlutchTheme.colors.secondary} width={28} height={28} />
                </K.KView>
            </K.KPressable>
            {context.state.transfers.map(t => {

                    var subtitle = ""
                    switch (t.type) {
                        case "weekly": subtitle = "Every monday"; break;
                        case "monthly": subtitle = "Every 5th of the month"; break;
                        case "lowbalance": subtitle = "When balance < " + t.lowbalanceAmount; break;
                    }

                    return (
                    <K.KView style={s.viewBox} key={t.id}>
                        <K.KText fontWeight="semi-bold" style={{fontSize: 25}}>{t.amount} {t.type}</K.KText>
                        <K.KText>{subtitle}</K.KText>
                        <K.KPressable style={{position: "absolute", top: 10, right: 10,  width: 40, height: 40, alignItems: "flex-end"}} onPress={() => deletePressed(t.id)} slop={20}>
                            <K.Svg.Svg  width={16} height={16} fill="none" >
                                <K.Svg.Path d="M15 15L8 8l7-7M1 15l7-7-7-7" stroke="#191919" strokeWidth={2} />
                            </K.Svg.Svg>
                        </K.KPressable>
                    </K.KView>
                    )
                }) }

        </>
    )
}


const s = {
    viewBox: {
        borderColor: "black", 
        borderWidth: 1, 
        alignItems: "center",
         borderColor: "black", 
         borderWidth: 1, 
         alignItems: "center",
         justifyContent: "center", 
         padding: 20,
         marginBottom: 10
    }
}

