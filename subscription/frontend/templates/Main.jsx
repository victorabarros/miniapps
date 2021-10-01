Template = (data, context) => {

    return (
        <Klutch.KView style={{ flex: 1, paddingBottom: 20 }}>
            <Klutch.KHeader showBackArrow>Subscription</Klutch.KHeader>
            <Klutch.KText style={{ textAlign: "center" }}>Add subscriptions to track by going to the transaction detail page and pressing the MiniApp panel. Example below</Klutch.KText>
            <Klutch.KView style={{ flex: 1, justifyContent: "center" }} >
                <Klutch.KImage source={{ uri: "https://klutch-test-public.s3.amazonaws.com/phone.png" }} style={{ height: 400 }} resizeMode="contain" />
            </Klutch.KView>
            <Klutch.KText style={{ marginVertical: 30, textAlign: "center" }}>Our AI will also look for subscriptions as you spend and will start adding them here.</Klutch.KText>
            <Klutch.KButtonBar >
                <Klutch.KButton type="primary" label="GO TO TRANSACTIONS" link="/transactions" />
            </Klutch.KButtonBar>
        </Klutch.KView>   
    )
}

