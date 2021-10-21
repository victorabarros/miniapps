const styles = {
  loading: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    marginTop: 20
  },
  squareContainer: {
    flexDirection: 'row'
  },
  square: {
    height: 120,
    width: 120,
    padding: 16,
    margin: 6,
    borderWidth: 1,
    justifyContent: "space-between"
  },
  category: {
    fontSize: 16
  },
  spent: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  budget: {
    fontSize: 12,
    color: 'gray'
  },
  squareAddBudget: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#6B6B6B'
  },
}

const budgetContainer = ({ id, category, amount: budget, spent }) => (
  <Klutch.KView key={`budget-${id}`} style={styles.square}>

    <Klutch.KText style={styles.category}>{category.toUpperCase()}</Klutch.KText>

    <Klutch.KView>
      <Klutch.KText style={styles.spent}>{spent.toFixed(2)}</Klutch.KText>
      <Klutch.KText style={styles.budget}>{`of ${(budget).toFixed(0)}`}</Klutch.KText>
    </Klutch.KView>

  </Klutch.KView>
)

// Enum
const State = {
  initializing: 'initializing',
  done: 'done',
  loading: 'loading',
}

Template = (data, context) => {
  const { recipeId } = data
  const { budgets, state } = context.state || { budgets: [], state: State.initializing }

  const fetchData = async () => {
    const budgets = await context.get('/budget')
    context.setState({ budgets, state: State.done })
  }

  const onPlusButtonPress = () => {
    context.setState({ budgets, state: State.loading })
    context.redirect(`/miniapps/${recipeId}/templates/New.template`)
    context.setState({ budgets, state: State.done })
  }

  if (state === State.initializing) fetchData()

  if (state !== State.done) {
    return (
      <Klutch.KView style={styles.loading}>
        <Klutch.KLoadingIndicator />
      </Klutch.KView>
    )
  }

  return (
    <Klutch.KView key='container' style={styles.container}>

      <Klutch.KScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Klutch.KView style={styles.squareContainer}>
          {budgets.map(budgetContainer)}

          <Klutch.KPressable
            style={[styles.square, styles.squareAddBudget]}
            onPress={onPlusButtonPress}
          >
            <Klutch.PlusSign color="#6B6B6B" width={30} height={30} />
          </Klutch.KPressable>

        </Klutch.KView >
      </Klutch.KScrollView>

    </Klutch.KView >
  )
}
