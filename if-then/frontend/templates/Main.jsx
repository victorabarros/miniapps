const styles = {
  card: {
    height: 77,
    backgroundColor: "white",
    padding: 16,
    marginBottom: 20,
    justifyContent: "center",
  },
}

Template = (data = {}, context) => {
  let { rules } = context.state || {}

  const fetchRules = async () => {
    rules = await context.get("automation")
    context.setState({ rules })
  }

  if (rules === undefined) {
    fetchRules()
  }

  if (rules === undefined) {
    return (<Klutch.KView style={{ flex: 1, justifyContent: "center" }}>
      <Klutch.KLoadingIndicator />
    </Klutch.KView>)
  }

  const Panel = ({ condition, action }) => (
    <Klutch.KView style={styles.card}>

      <Klutch.KView style={{ paddingLeft: 10, flex: 1, justifyContent: "center" }}>
        <Klutch.KText style={{ fontWeight: "bold" }}>{"IF\t"}
          <Klutch.KText style={{ fontWeight: "normal" }}>{`${condition.title}${condition.value}`}</Klutch.KText>
        </Klutch.KText>

        <Klutch.KText style={{ fontWeight: "bold" }}>{"THEN\t"}
          <Klutch.KText style={{ fontWeight: "normal" }}>{`${action.title}${action.value}`}</Klutch.KText>
        </Klutch.KText>
      </Klutch.KView>
    </Klutch.KView>
  )

  if (data.condition && data.action) {
    rules[`${data.condition.key}-${data.condition.value}`] = data
  }

  return (
    <Klutch.KView style={{ flex: 1, paddingBottom: 20 }}>
      <Klutch.KHeader showBackArrow onBackArrowPressed={context.closeMiniApp}>IF / THEN</Klutch.KHeader>

      <Klutch.KScrollView>
        {rules && Object.entries(rules).map(([key, value]) => <Panel key={key} {...value} />)}

        <Klutch.KPressable style={styles.card}
          onPress={() => {
            context.setState({ rules: undefined })
            context.loadTemplate("/templates/InitAutomation.template", {})
          }}
        >
          <Klutch.PlusSign color={Klutch.KlutchTheme.colors.secondary} width={30} height={30} />
        </Klutch.KPressable>
      </Klutch.KScrollView>
    </Klutch.KView>
  )
}
