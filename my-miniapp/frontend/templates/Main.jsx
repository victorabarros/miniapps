Template = (data, context) => {
  const { resources } = context.state || {}
  const fetchData = async () => {
    const { resources } = await context.get('resource')
    context.setState({ resources })
  }

  if (resources == undefined) fetchData()

  return (
    <Klutch.KView style={{ flex: 1 }}>
      <Klutch.KHeader showBackArrow>My MiniApp</Klutch.KHeader>

      {(resources || []).map(({ id, name, value }) => (
        <Klutch.KView key={`resource-${id}`} style={{ height: 50, borderWidth: .8, marginVertical: 5 }}>
          <Klutch.KView style={{ backgroundColor: 'lightblue', height: "100%", position: "absolute", width: `${100 * value}%` }} />
          <Klutch.KView
            style={{ flex: 1, padding: 5, flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
            <Klutch.KText>{name}</Klutch.KText>
            <Klutch.KText>{`${value * 100}%`}</Klutch.KText>
          </Klutch.KView>
        </Klutch.KView>
      ))}

      <Klutch.KPressable
        style={{ height: 50, borderWidth: .5, marginVertical: 5, padding: 5, flexDirection: 'row', alignItems: "center", justifyContent: "center" }}
        onPress={() => console.log("Move to add resource page")}
      >
        <Klutch.PlusSign color={Klutch.KlutchTheme.colors.secondary} />
      </Klutch.KPressable>
    </Klutch.KView >
  )
}
