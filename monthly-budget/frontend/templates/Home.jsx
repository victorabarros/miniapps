const styles = {
  loading: {
    flex: 1,
    justifyContent: "center",
  },
  textHeader: {
    fontSize: 20,
  },
  editButtonContainer: {
    position: 'absolute',
    height: '60%',
    width: "10%",
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 11,
    color: "#44CCFF",
    alignSelf: 'flex-end',
  },
  summaryContainer: {
    marginVertical: 5,
  },
  summaryAmount: {
    fontSize: 45,
    fontWeight: 'bold',
  },
  summarySubtitle: {
    fontWeight: 'bold',
    marginVertical: 10,
  },
}

const budgetContainerStyles = {
  container: {
    marginVertical: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  currency: {
    fontSize: 15,
  },
  text: {
    fontSize: 10,
  },
  budget: {
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  progressBar: {
    height: 6,
    width: '100%',
    borderWidth: .5,
    marginVertical: 5,
  },
  progress: {
    height: '100%',
    backgroundColor: '#44CCFF',
  },
}

const budgetContainer = ({ id, category, amount: budget, spent }) => (
  <Klutch.KView style={budgetContainerStyles.container} key={`budget-${id}`}>
    <Klutch.KView style={budgetContainerStyles.headerContainer}>

      <Klutch.KView>
        <Klutch.KText style={budgetContainerStyles.category}>{category.toUpperCase()}</Klutch.KText>
        <Klutch.KText style={budgetContainerStyles.currency}>
          {Math.max((budget - spent), 0).toFixed(2)}
          <Klutch.KText style={budgetContainerStyles.text}> LEFT</Klutch.KText>
        </Klutch.KText>
      </Klutch.KView>

      <Klutch.KView style={{ alignSelf: 'flex-end' }}>
        <Klutch.KText style={budgetContainerStyles.currency}>{spent.toFixed(2)}
          <Klutch.KText style={budgetContainerStyles.text}> SPENT</Klutch.KText>
        </Klutch.KText>
        <Klutch.KText style={budgetContainerStyles.budget}>{`OF ${(budget - spent).toFixed(2)}`}</Klutch.KText>
      </Klutch.KView>
    </Klutch.KView>

    <Klutch.KView style={budgetContainerStyles.progressBar}>
      <Klutch.KView style={[budgetContainerStyles.progress, { width: `${100 * spent / budget}%` }]} />
    </Klutch.KView>

  </Klutch.KView>
)

// Enum
const State = {
  fromOtherView: 'switchingtoHome',

  initializing: 'initializing',
  done: 'done',
  toMainView: 'switchingToMain',
}

Template = (data, context) => {
  let { budgets, state, totalBudget } = context.state || { budgets: [], state: State.initializing }
  const fetchData = async () => {
    const budgets = await context.get('/budget')
    const totalBudget = budgets.reduce((accum, item) => accum + item.amount, 0)
    context.setState({ budgets, totalBudget, state: State.done, budget: {} })
  }

  if (state === State.fromOtherView) context.setState({ state: State.initializing })
  if (state === State.initializing) {
    fetchData()
  }

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
        <Klutch.KHeader showBackArrow onBackArrowPressed={context.closeMiniApp} textStyle={styles.textHeader} >
          MONTHLY BUDGET
        </Klutch.KHeader>

        <Klutch.KPressable
          style={styles.editButtonContainer}
          onPress={() => {
            context.setState({ state: State.toMainView })
            context.loadTemplate("/templates/Main.template")
          }}
        >
          <Klutch.KText style={styles.editButtonText}>EDIT</Klutch.KText>
        </Klutch.KPressable>
      </Klutch.KView>

      <Klutch.KView key='summary' style={styles.summaryContainer}>
        <Klutch.KText style={styles.summaryAmount}>{`$${totalBudget.toFixed(2)}`}</Klutch.KText>
        <Klutch.KText style={styles.summarySubtitle}>Total Budgeted</Klutch.KText>
      </Klutch.KView >

      <Klutch.KScrollView key='body'>
        {budgets.map(budgetContainer)}
      </Klutch.KScrollView>

    </Klutch.KView >
  )
}
