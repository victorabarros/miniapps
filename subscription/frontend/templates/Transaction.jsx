
Template = (data, context) => {

    const onAddSubscriptionPressed = () => {
        context.loadTemplate("/templates/Add.template", data)
    }

    return (
        <Klutch.KPressable style={{justifyContent: "center", flex: 1}} onPress={onAddSubscriptionPressed}>
           <Klutch.PlusSign color={Klutch.KlutchTheme.colors.secondary} width={30} height={30} />
        </Klutch.KPressable>
    )
}