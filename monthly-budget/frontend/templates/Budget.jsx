const styles = {
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

Template = (data, context) => {
  console.log(data)
  const { category, amount } = data
  console.log({ category, amount })

  return (
    <Klutch.KView key='container'>

      <Klutch.KView key='header'>
        <Klutch.KHeader showBackArrow textStyle={styles.textHeader}>BUDGET</Klutch.KHeader>
      </Klutch.KView>

      <Klutch.KView key='budget' style={styles.inputContainer}>
        <Klutch.KText style={styles.inputLabel}>Monthly Budget</Klutch.KText>
        {/* TODO currency input */}
        <Klutch.KText style={styles.inputValue}>{amount.toFixed(2)}</Klutch.KText>
      </Klutch.KView>

      <Klutch.KView
        key='category'
        style={styles.inputContainer}
      >
        <Klutch.KText style={styles.inputLabel}>Budget Category</Klutch.KText>
        <Klutch.KPressable
          style={styles.inputCategoryContainer}
          onPress={() => console.log("TODO change category")}
        >
          <Klutch.KText style={styles.inputValue}>{category}</Klutch.KText>
          <Klutch.Arrow color="black" />
        </Klutch.KPressable>
      </Klutch.KView>

      <Klutch.KPressable
        key='save-button'
        style={styles.button}
        onPress={() => {
          // TODO validate category not null
          // TODO loading feedback
          console.log("TODO save")
        }}
      >
        <Klutch.KText style={styles.buttonText}>SAVE</Klutch.KText>
      </Klutch.KPressable>

      <Klutch.KPressable
        key='delete-button'
        style={[styles.button, { backgroundColor: 'transparent' }]}
        onPress={() => {
          // TODO validate category not null
          // TODO loading feedback
          console.log("TODO delete")
        }}
      >
        <Klutch.KText style={styles.buttonText}>DELETE</Klutch.KText>
      </Klutch.KPressable>

    </Klutch.KView >
  )
}
