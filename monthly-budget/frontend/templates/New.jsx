const styles = {
  loading: {
    flex: 1,
    justifyContent: "center",
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
    fontSize: 75,
  },
  categoryLabel: {
    fontSize: 55,
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
  scrollContainer: {
    marginTop: 10,
    height: "85%",
  },
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
  fromOtherView: 'switchingToNew',

  setAmount: 'setAmount',
  selectCategory: 'selectCategory',
  ready: 'ready',
  toMainView: 'switchingtoMain',
}

Template = (data, context) => {
  const { state, budget } = context.state || { state: State.setAmount }
  const { category, amount } = budget || { category: '', amount: 0 }

  if (state === State.fromOtherView) context.setState({ budget: { category, amount }, state: State.setAmount })

  if (state === State.selectCategory) {
    return (
      <Klutch.KView key='container'>

        <Klutch.KView key='header'>
          <Klutch.KHeader
            showBackArrow
            onBackArrowPressed={() => context.setState({ budget: { category, amount }, state: State.ready })}
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
                    onPress={() => {
                      context.setState({ budget: { category: categoryCandidate, amount }, state: State.ready })
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
            {/* TODO uncoment when fetch catagories */}
            {/* <Klutch.KText style={stylesCategories.footerText}>
              To create a new category, go to the transactions tab and swipe right on a transaction
            </Klutch.KText> */}
          </Klutch.KScrollView >
        </Klutch.KView>

      </Klutch.KView >
    )
  }

  if ([State.fromOtherView, State.toMainView].includes(state)) {
    return (
      <Klutch.KView style={styles.loading}>
        <Klutch.KLoadingIndicator />
      </Klutch.KView>
    )
  }

  const onSaveButtonPress = async () => {
    if (!category || amount == 0) return
    context.setState({ state: State.saving })

    // TODO if budgets is already setted, publish error message

    await context.request('put', '/budget', { category, amount })
    context.setState({ state: State.toMainView })
    context.loadTemplate("/templates/Main.template")
  }

  return (
    <Klutch.KView key='container'>

      <Klutch.KView key='header'>
        {/* TODO add loading feedback when click on backarrow */}
        <Klutch.KHeader showBackArrow>NEW BUDGET</Klutch.KHeader>
      </Klutch.KView>

      <Klutch.KView key='budget' style={styles.inputContainer}>
        <Klutch.KText style={styles.inputLabel}>{
          state === State.setAmount ?
            "How much do you want to spend monthly?" :
            "Monthly Budget"
        }</Klutch.KText>
        <Klutch.KBigCurrencyInput
          style={styles.inputValue}
          value={amount}
          onAmountChanged={(value) => context.setState({ budget: { category, amount: value }, state })}
          placeholder="$0.00"
        />
      </Klutch.KView>

      {state === State.setAmount ? (
        <>
          <Klutch.KPressable
            key='next-button'
            style={styles.button}
            onPress={() => context.setState({ budget: { category, amount }, state: State.selectCategory })}
          >
            <Klutch.KText style={styles.buttonText}>NEXT</Klutch.KText>
          </Klutch.KPressable>
        </>
      ) : (
        <>
          <Klutch.KView key='category' style={styles.inputContainer} >
            <Klutch.KText style={styles.inputLabel}>Budget Category</Klutch.KText>
            <Klutch.KPressable
              style={styles.inputCategoryContainer}
              onPress={() => context.setState({ budget: { category, amount }, state: State.selectCategory })}
            >
              <Klutch.KText style={styles.categoryLabel} fontWeight="bold">{category}</Klutch.KText>
              <Klutch.Arrow color="black" height={30} width={30} />
            </Klutch.KPressable>
          </Klutch.KView>

          <Klutch.KPressable key='save-button' style={styles.button} onPress={onSaveButtonPress} >
            <Klutch.KText style={styles.buttonText}>CREATE</Klutch.KText>
          </Klutch.KPressable>
        </>
      )}
    </Klutch.KView>
  )
}
