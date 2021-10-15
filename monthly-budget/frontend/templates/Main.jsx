styles = {}

const budgetCard = ({ id, category, amount: budget }, spent) => {
  return (
    <Klutch.KView style={{ marginVertical: 10 }} key={`budget-${id}`}>
      <Klutch.KView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

        <Klutch.KView>
          <Klutch.KText style={{ fontSize: 20, fontWeight: 'bold', }}>{category.toUpperCase()}</Klutch.KText>
          <Klutch.KText style={{ fontSize: 15 }}>
            {Math.max((budget - spent), 0).toFixed(2)}
            <Klutch.KText style={{ fontSize: 10 }}> LEFT</Klutch.KText>
          </Klutch.KText>
        </Klutch.KView>

        <Klutch.KView style={{ alignSelf: 'flex-end' }}>
          <Klutch.KText style={{ fontSize: 15 }}>{spent.toFixed(2)}
            <Klutch.KText style={{ fontSize: 10 }}> SPENT</Klutch.KText>
          </Klutch.KText>
          <Klutch.KText style={{ fontSize: 10, alignSelf: 'flex-end', }}>{`OF ${budget}`}</Klutch.KText>
        </Klutch.KView>
      </Klutch.KView>

      <Klutch.KView style={{
        height: 6,
        width: '100%',
        borderWidth: .5,
        marginVertical: 5
      }}>
        <Klutch.KView style={{
          height: '100%',
          backgroundColor: '#44CCFF',
          width: `${100 * spent / budget}%`,
        }} />
      </Klutch.KView>

    </Klutch.KView>
  )
}


Template = (data, context) => {
  let { budgets, loading } = context.state || { budgets: [], loading: true }

  const fetchData = async () => {
    const budgets = await context.get('/budget')
    context.setState({ budgets, loading: false })
  }

  if (loading) {
    fetchData()
    return (
      <Klutch.KView style={{ flex: 1, justifyContent: "center" }}>
        <Klutch.KLoadingIndicator />
      </Klutch.KView>
    )
  }

  return (
    <Klutch.KView key='container'>

      <Klutch.KView key='header'>
        <Klutch.KHeader
          showBackArrow
          onBackArrowPressed={context.closeMiniApp}
          textStyle={{ fontSize: 20 }}
        >
          MONTHLY BUDGET
        </Klutch.KHeader>

        <Klutch.KPressable
          style={{
            position: 'absolute',
            height: '60%',
            width: "10%",
            alignSelf: 'flex-end',
            justifyContent: 'center',
          }}
          onPress={async () => {
            console.log("TODO move to edit page")
          }}
        >
          <Klutch.KText style={{
            fontSize: 11,
            color: "#44CCFF",
            alignSelf: 'flex-end',
          }}>
            EDIT
          </Klutch.KText>
        </Klutch.KPressable>
      </Klutch.KView>

      <Klutch.KView key='sumary' style={{ marginVertical: 5 }}>
        <Klutch.KText style={{ fontSize: 45, fontWeight: 'bold' }}>$1,200.00</Klutch.KText>
        <Klutch.KText style={{ fontWeight: 'bold', marginVertical: 10 }}>Total Budgeted</Klutch.KText>
      </Klutch.KView>

      <Klutch.KScrollView key='body'>

        <Klutch.KView>
          {budgets.map(b => budgetCard(b, 35.27))}
        </Klutch.KView>

      </Klutch.KScrollView>
    </Klutch.KView>
  )
}
