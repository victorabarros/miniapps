console.log("Edit")

Template = (data, context) => {
  return (
    <Klutch.KView key='container'>

      <Klutch.KHeader showBackArrow onBackArrowPressed={context.closeMiniApp} >
        MONTHLY BUDGET
      </Klutch.KHeader>

      <Klutch.KText>Total Budgeted</Klutch.KText>

    </Klutch.KView >
  )
}
