const styles = {
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    paddingLeft: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 15
  },
  value: {
    fontWeight: "normal",
    color: "grey"
  },
}

Template = (data, context) => (
  <Klutch.KView style={styles.container}>

    <Klutch.KText style={styles.title}>{"IF\t"}
      <Klutch.KText style={styles.value}>
        {`${data.condition.title}${data.condition.value}`}
      </Klutch.KText>
    </Klutch.KText>

    <Klutch.KText style={styles.title}>{"THEN\t"}
      <Klutch.KText style={styles.value}>
        {`${data.action.title}${data.action.value}`}
      </Klutch.KText>
    </Klutch.KText>

  </Klutch.KView>
)
