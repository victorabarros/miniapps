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

const categoryColors = [
  { color1: "#639FAF", color2: "#E0D0C2" },
  { color1: "#9FA3AF", color2: "#E2D5D4" },
  { color1: "#77A8C5", color2: "#BAC1D8" },
  { color1: "#6A81BC", color2: "#C6B1B1" },
  { color1: "#578C6D", color2: "#CCB9A8" },
  { color1: "#77A8C5", color2: "#BAC1D8" },
  { color1: "#77A8C5", color2: "#BAC1D8" },
]

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
              .map((categoryCandidate, idx) => {
                const gradientColors = [
                  categoryColors[idx % categoryColors.length].color1,
                  categoryColors[idx % categoryColors.length].color2,
                ]

                return (
                  <Klutch.KPressable
                    key={`category-item-${idx}`}
                    style={stylesCategories.button}
                    onPress={() => {
                      context.setState({ budget: { category: categoryCandidate, amount }, state: State.ready })
                    }}
                  >
                    <Klutch.KView style={stylesCategories.buttonLabelContainer}>
                      <Klutch.LinearGradient.LinearGradient
                        style={stylesCategories.buttonSquare}
                        colors={gradientColors}
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
