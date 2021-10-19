const styles = {
  loading: {
    flex: 1,
    justifyContent: "center",
  },
  textHeader: {
    fontSize: 20,
  },
  summaryContainer: {
    marginVertical: 5,
  },
  summaryAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryAmount: {
    fontSize: 45,
    fontWeight: 'bold',
  },
  addBudgetButton: {
    width: 65,
    height: 30,
    borderWidth: 1,
    borderColor: '#44CCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summarySubtitle: {
    fontWeight: 'bold',
    marginVertical: 10,
  },
}

const budgetContainerStyles = {
  container: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: .5,
    borderColor: 'lightgray',
  },
  textContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    width: '75%',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
}

// Enum
const State = {
  fromMainView: 'switchingToEdit',

  done: 'done',
  finishing: 'switchingToBudget',
}

Template = (data, context) => {

  const budgetContainer = ({ id, category, amount: budget }) => (
    <Klutch.KPressable
      style={budgetContainerStyles.container}
      key={`budget-${id}`}
      onPress={() => {
        context.setState({ state: State.finishing })
        context.loadTemplate("/templates/Budget.template", { id, category, amount: budget })
      }}
    >

      <Klutch.KView style={budgetContainerStyles.textContainer}>
        <Klutch.KText style={budgetContainerStyles.text}>{category.toUpperCase()}</Klutch.KText>
        <Klutch.KText style={budgetContainerStyles.text}>{budget.toFixed(2)}</Klutch.KText>
      </Klutch.KView>

      <Klutch.Arrow color="black" />

    </Klutch.KPressable>
  )

  const { budgets, totalBudget, state } = context.state

  if (state === State.fromMainView) context.setState({ state: State.done })

  if (state !== State.done) {
    return (
      <Klutch.KView style={styles.loading}>
        <Klutch.KLoadingIndicator />
      </Klutch.KView>
    )
  }

  return (
    <Klutch.KView key='container'>

      <Klutch.KView key='header'>
        <Klutch.KHeader showBackArrow textStyle={styles.textHeader}>MONTHLY BUDGET</Klutch.KHeader>
      </Klutch.KView>

      <Klutch.KView key='summary' style={styles.summaryContainer}>
        <Klutch.KView style={styles.summaryAmountContainer}>
          <Klutch.KText style={styles.summaryAmount}>{`$${totalBudget.toFixed(2)}`}</Klutch.KText>

          <Klutch.KPressable
            style={styles.addBudgetButton}
            onPress={() => {
              context.setState({ state: State.finishing })
              context.loadTemplate("/templates/Budget.template", { category: '', amount: 0 })
            }}
          >
            <Klutch.PlusSign color="#44CCFF" />
          </Klutch.KPressable >
        </Klutch.KView >

        <Klutch.KText style={styles.summarySubtitle}>Total Budgeted</Klutch.KText>
      </Klutch.KView >

      <Klutch.KScrollView key='body'>
        {budgets.map(budgetContainer)}
      </Klutch.KScrollView>

    </Klutch.KView >
  )
}
