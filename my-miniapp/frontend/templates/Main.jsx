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
      <Klutch.KText style={{ textAlign: "center" }}>This is a miniapp template!</Klutch.KText>
    </Klutch.KView>
  )
}
