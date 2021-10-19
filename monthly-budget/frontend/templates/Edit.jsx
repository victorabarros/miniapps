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
  ready: 'ready',
  toHomeView: 'switchingtoHome',
}

Template = (data, context) => {
  if (!context.state.budget) context.setState({ budget: data })
  let { id, category, amount } = context.state.budget || {}

  let { state } = context.state || { selectCategory: false }

  if (state === State.fromOtherView) context.setState({ state: State.ready })

  if (state === State.selectCategory) {
    return (
      <Klutch.KView key='container'>

        <Klutch.KView key='header'>
          <Klutch.KHeader
            showBackArrow
            onBackArrowPressed={() => context.setState({ selectCategory: false })}
            textStyle={styles.textHeader}
          >
            CATEGORIES
          </Klutch.KHeader>
        </Klutch.KView>

        <Klutch.KText style={stylesCategories.label}>
          What category are you budgeting for?
        </Klutch.KText>

        <Klutch.KScrollView key='body'>
          {/* TODO fix scroll */}
          {/* TODO fetch categories from server */}
          {['SHOPPING', 'DINING OUT', 'TRANSPORT', 'FOOD', 'GIFTS', 'FUN', 'MEDICAL', 'BEAUTY']
            .map(categoryCandidate => {
              return (
                <Klutch.KPressable
                  key={categoryCandidate}
                  style={stylesCategories.button}
                  onPress={() => {
                    context.setState({ budget: { id, category: categoryCandidate, amount } })
                    context.setState({ state: State.ready })
                  }}
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
        </Klutch.KScrollView >

        <Klutch.KText style={stylesCategories.footerText}>
          To create a new category, go to the transactions tab and swipe right on a transaction
        </Klutch.KText>

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
    if (!category || amount == 0) return
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

      <Klutch.KView
        key='category'
        style={styles.inputContainer}
      >
        <Klutch.KText style={styles.inputLabel}>Budget Category</Klutch.KText>
        <Klutch.KView
          style={styles.inputCategoryContainer}
        >
          <Klutch.KText style={styles.inputValue}>{category}</Klutch.KText>
        </Klutch.KView>
      </Klutch.KView>

      <Klutch.KPressable
        key='save-button'
        style={styles.button}
        onPress={onSaveButtonPress}
      >
        <Klutch.KText style={styles.buttonText}>SAVE</Klutch.KText>
      </Klutch.KPressable>

      {id && (
        <Klutch.KPressable
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
        </Klutch.KPressable>
      )}

    </Klutch.KView >
  )
}
