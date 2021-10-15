styles = {}
budgets = [
  {
    "id": "55174007-9661-4fb3-8f57-9d93134da9fe",
    "recipeInstallId": "2b85e031-1a71-484e-843d-b8e4be811352",
    "category": "FOOD",
    "amount": 500.15,
  },
  {
    "id": "93a13469-88b8-4b46-ae0a-35d4752211f3",
    "recipeInstallId": "2b85e031-1a71-484e-843d-b8e4be811352",
    "category": "SHOPPING",
    "amount": 100.84,
  },
  {
    "id": "eaa80d7f-2061-45b4-a8c5-54212e671c5d",
    "recipeInstallId": "2b85e031-1a71-484e-843d-b8e4be811352",
    "category": "FUN",
    "amount": 50.71,
  },
  {
    "id": "f1d5068f-3d65-48f3-9121-28f815a27035",
    "recipeInstallId": "2b85e031-1a71-484e-843d-b8e4be811352",
    "category": "UBER",
    "amount": 8.09,
  },
  {
    "id": "f3ee93bb-79c6-4c4a-86f2-6fb6b4299011",
    "recipeInstallId": "2b85e031-1a71-484e-843d-b8e4be811352",
    "category": "RESTAURANT",
    "amount": 1000.40,
  },
  {
    "id": "f4633fa7-5486-4bcc-a64f-345446b9bc32",
    "recipeInstallId": "2b85e031-1a71-484e-843d-b8e4be811352",
    "category": "ELETRONIC",
    "amount": 200.22,
  }
]


const budgetCard = ({ id, category, amount: budget }, spent = 35.27) => {
  return (
    <Klutch.KView style={{ marginVertical: 10 }} key={`budget-${id}`}>
      <Klutch.KView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

        <Klutch.KView>
          <Klutch.KText style={{ fontSize: 20, fontWeight: 'bold', }}>{category.toUpperCase()}</Klutch.KText>
          <Klutch.KText style={{ fontSize: 15 }}>
            {(budget - spent) > 0 ? (budget - spent).toFixed(2) : "0.00"}
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
            // const resp = await context.get('/budget')
            console.log(resp)
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

      <Klutch.KView key='sumary' style={{ marginVertical: 15 }}>
        <Klutch.KText style={{ fontSize: 45, fontWeight: 'bold' }}>$1,200.00</Klutch.KText>
        <Klutch.KText style={{ fontWeight: 'bold', marginVertical: 10 }}>Total Budgeted</Klutch.KText>
      </Klutch.KView>

      <Klutch.KScrollView>

        <Klutch.KView key='body'>
          {budgets.map(b => budgetCard(b))}
        </Klutch.KView>

      </Klutch.KScrollView>
    </Klutch.KView>
  )
}
