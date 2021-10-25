const styles = {
  loading: {
    flex: 1,
    justifyContent: "center",
  },
  textHeader: {
    fontSize: 20,
  },
  inputContainer: {
    marginTop: 30,
    marginBottom: 30,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
  inputLabel: {
    fontSize: 15,
  },
  inputValue: {
    fontSize: 55,
    fontWeight: 'bold',
  },
  inputCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    height: 50,
    borderWidth: 1,
    marginVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#44CCFF',
  },
  buttonText: {
    fontSize: 12,
  },
  error: { color: 'red' },
}

const stylesCategories = {
  label: {
    fontSize: 15,
    fontWeight: "bold"
  },
  button: {
    paddingTop: 20,
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'lightgray'
  },
  buttonLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonSquare: {
    height: 10,
    width: 10,
    borderRadius: 2
  },
  buttonLabelText: { marginLeft: 16 },
  footerText: { fontSize: 12 },
}

getRandomColor = () => {
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// Enum
const State = {
  fromOtherView: 'switchingToEdit',

  selectCategory: 'selectCategory',
  saving: 'saving',
  deleting: 'deleting',
  ready: 'ready',
  toMainView: 'switchingtoMain',
}

Template = (data, context) => {
  if (Object.keys(context.state.budget).length === 0) context.setState({ budget: data })
  const { id, category, amount } = context.state.budget
  const { budgets, state, error } = context.state

  if (state === State.fromOtherView) context.setState({ state: State.ready })

  if (state === State.selectCategory) {
    return (
      <Klutch.KView key='container'>

        <Klutch.KView key='header'>
          <Klutch.KHeader
            showBackArrow
            onBackArrowPressed={() => context.setState({ budget: { id, category, amount }, state: State.ready })}
          >
            CATEGORIES
          </Klutch.KHeader>
        </Klutch.KView>

        <Klutch.KText style={styles.inputLabel}>What category are you budgeting for?</Klutch.KText>

        <Klutch.KView key='body' style={stylesCategories.scrollContainer}>
          <Klutch.KScrollView>
            {/* TODO fetch categories from server */}
            {['SHOPPING', 'DINING OUT', 'TRANSPORT', 'FOOD', 'GIFTS', 'FUN', 'MEDICAL', 'BEAUTY',]
              .map(categoryCandidate => {
                return (
                  <Klutch.KPressable
                    key={categoryCandidate}
                    style={stylesCategories.button}
                    onPress={() => context.setState({ budget: { id, category: categoryCandidate, amount }, state: State.ready })}
                  >
                    <Klutch.KView style={stylesCategories.buttonLabelContainer}>
                      <Klutch.KView
                        style={[stylesCategories.buttonSquare, { backgroundColor: getRandomColor() }]}
                      />
                      <Klutch.KText style={stylesCategories.buttonLabelText}>{categoryCandidate}</Klutch.KText>
                    </Klutch.KView>
                    <Klutch.Arrow color="black" />
                  </Klutch.KPressable>
                )
              })
            }
            {/* TODO uncoment when fetch catagories */}
            {/* <Klutch.KText style={stylesCategories.footerText}>
              To create a new category, go to the transactions tab and swipe right on a transaction
            </Klutch.KText> */}
          </Klutch.KScrollView >
        </Klutch.KView>

      </Klutch.KView >
    )
  }

  if (state !== State.ready) {
    return (
      <Klutch.KView style={styles.loading}>
        <Klutch.KLoadingIndicator />
      </Klutch.KView>
    )
  }

  const onSaveButtonPress = async () => {
    if (amount == 0) return
    context.setState({ ...context.state, state: State.saving })

    // check if category is alread setted
    const budgetSetted = budgets.find(b => b.category == category)
    if (budgetSetted && budgetSetted.id !== id) {
      context.setState({ ...context.state, state: State.ready, error: "Budget for this category already exists" })
      return
    }

    await context.request('put', '/budget', { category, amount })
    context.setState({ state: State.toMainView })
    context.loadTemplate("/templates/Main.template")
  }

  const onDeleteButtonPress = async () => {
    context.setState({ state: State.deleting })
    await context.request('delete', `/budget/${id}`, {})

    context.setState({ state: State.toMainView })
    context.loadTemplate("/templates/Main.template")
  }

  return (
    <Klutch.KView key='container'>

      <Klutch.KView key='header'>
        <Klutch.KHeader showBackArrow textStyle={styles.textHeader}>EDIT BUDGET</Klutch.KHeader>
      </Klutch.KView>

      <Klutch.KView key='budget' style={styles.inputContainer}>
        <Klutch.KText style={styles.inputLabel} fontWeight="bold">Monthly Budget</Klutch.KText>
        <Klutch.KBigCurrencyInput
          style={styles.inputValue}
          value={amount}
          onAmountChanged={(value) => context.setState({ budget: { id, category, amount: value } })}
          placeholder="$0.00"
        />
      </Klutch.KView>

      <Klutch.KView key='category' style={styles.inputContainer} >
        <Klutch.KText style={styles.inputLabel}>Budget Category</Klutch.KText>
        <Klutch.KPressable
          style={styles.inputCategoryContainer}
          onPress={() => context.setState({ budget: { id, category, amount }, state: State.selectCategory })}
        >
          <Klutch.KText style={styles.inputValue}>{category}</Klutch.KText>
          <Klutch.Arrow color="black" height={30} width={30} />
        </Klutch.KPressable>
      </Klutch.KView>

      {error && <Klutch.KText style={styles.error}>{error}</Klutch.KText>}

      <Klutch.KPressable key='save-button' style={styles.button} onPress={onSaveButtonPress} >
        <Klutch.KText style={styles.buttonText}>SAVE</Klutch.KText>
      </Klutch.KPressable>

      <Klutch.KPressable key='delete-button'
        style={[styles.button, { backgroundColor: 'transparent' }]}
        onPress={onDeleteButtonPress}
      >
        <Klutch.KText style={styles.buttonText}>DELETE</Klutch.KText>
      </Klutch.KPressable>

    </Klutch.KView >
  )
}
