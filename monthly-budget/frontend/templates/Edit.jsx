const styles = {
  loading: {
    flex: 1,
    justifyContent: "center",
  },
  textHeader: {
    fontSize: 20,
  },
  inputContainer: {
    marginTop: 10,
    marginBottom: 30,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: 'bold',
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

// Enum
const State = {
  fromOtherView: 'switchingToEdit',

  selectCategory: 'selectCategory',
  saving: 'saving',
  ready: 'ready',
  toHomeView: 'switchingtoHome',
}

Template = (data, context) => {
  if (Object.keys(context.state.budget).length === 0) context.setState({ budget: data })
  const { category, amount } = context.state.budget
  const { state } = context.state

  if (state === State.fromOtherView) context.setState({ state: State.ready })

  if (state !== State.ready) {
    return (
      <Klutch.KView style={styles.loading}>
        <Klutch.KLoadingIndicator />
      </Klutch.KView>
    )
  }

  const onSaveButtonPress = async () => {
    if (amount == 0) return
    context.setState({ state: State.saving })

    await context.request('put', '/budget', { category, amount })
    context.setState({ state: State.toHomeView })
    context.loadTemplate("/templates/Home.template")
  }

  return (
    <Klutch.KView key='container'>

      <Klutch.KView key='header'>
        <Klutch.KHeader showBackArrow textStyle={styles.textHeader}>EDIT BUDGET</Klutch.KHeader>
      </Klutch.KView>

      <Klutch.KView key='budget' style={styles.inputContainer}>
        <Klutch.KText style={styles.inputLabel}>Monthly Budget</Klutch.KText>
        <Klutch.KBigCurrencyInput
          style={styles.inputValue}
          value={amount}
          onAmountChanged={(value) => context.setState({ budget: { category, amount: value } })}
          placeholder="$0.00"
        />
      </Klutch.KView>

      <Klutch.KView key='category' style={styles.inputContainer} >
        <Klutch.KText style={styles.inputLabel}>Budget Category</Klutch.KText>
        <Klutch.KView
          style={styles.inputCategoryContainer}
        >
          <Klutch.KText style={styles.inputValue}>{category}</Klutch.KText>
        </Klutch.KView>
      </Klutch.KView>

      <Klutch.KPressable key='save-button' style={styles.button} onPress={onSaveButtonPress} >
        <Klutch.KText style={styles.buttonText}>SAVE</Klutch.KText>
      </Klutch.KPressable>

      {/* <Klutch.KPressable
        key='delete-button'
        style={[styles.button, { backgroundColor: 'transparent' }]}
        onPress={() => {
          // TODO validate category not null
          // TODO loading feedback
          // TODO clear context
          console.log("TODO delete")
          // TODO redirect to Home template
        }}
      >
        <Klutch.KText style={styles.buttonText}>DELETE</Klutch.KText>
      </Klutch.KPressable> */}

    </Klutch.KView >
  )
}
