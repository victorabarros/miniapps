Template = (data, context) => {

    const WeekDays = {
        0: "MONDAY",
        1: "TUESDAY",
        2: "WEDNESDAY",
        3: "THURSDAY",
        4: "FRIDAY",
        5: "SATURDAY",
        6: "SUNDAY"
    }
    const Months = {
        1: "JANUARY",
        2: "FEBRUARY",
        3: "MARCH",
        4: "APRIL",
        5: "MAY",
        6: "JUNE",
        7: "JULY",
        8: "AUGUST",
        9: "SEPTEMBER",
        10: "OCTOBER",
        11: "NOVEMBER",
        12: "DECEMBER"
    }


    var datetime = DateTime.fromISO(data.transactionDate)    
    const {state} = context
    if (!state) {
        const nextMonth = datetime.plus({months: 1})
        context.setState({
            frequency: "MONTHLY",
            day: nextMonth.day,
            month: Months[nextMonth.month],
            weekday: WeekDays[nextMonth.weekday],
            loading: false
        })
    }


    const {frequency, day, month, weekday, loading} = state || {}

    const onSave = async () => {
        context.setState({loading: true})
        const subscription = {
            id: data.id,
            name: data.merchantName,
            frequency: frequency,
            amount: data.amount,
            day: day,
            month: month,
            weekday: +Object.entries(WeekDays).find(c => c[1] == weekday)[0],
            transaction: data            
        }
        await context.post("/subscriptions", subscription)                           
        context.closeMiniApp()
    }



    

    return (
        <Klutch.KView style={{ flex: 1, paddingBottom: 20 }}>
            <Klutch.KHeader showBackArrow>Subscription</Klutch.KHeader>
            <Klutch.KForm>
                <Klutch.KTextInput 
                    label="MERCHANT"
                    value={data.merchantName}
                    editable={false}
                />
                <Klutch.KTextInput 
                    label="AMOUNT"
                    value={"" + data.amount}
                    editable={false}
                />                
                <Klutch.KSelectInput
                    label="FREQUENCY"
                    data={["WEEKLY", "MONTHLY", "YEARLY"]}
                    value={frequency}
                    editable={false}
                    onSelectionChanged={sel => context.setState({frequency: sel})}
                />  
                {frequency === "MONTHLY" &&
                    (
                        <Klutch.KSelectInput
                        label="RENEWAL DAY"
                        data={[...Array(31).keys()].map(i => i + 1)}
                        value={day}
                        editable={false}
                        onSelectionChanged={sel => context.setState({day: sel})}
                        />  
                    )                
                }              
                {frequency === "YEARLY" &&
                    (
                        <>
                            <Klutch.KSelectInput
                            label="RENEWAL MONTH"
                            data={Object.keys(Months).map(c => Months[c])}
                            value={month}
                            editable={false}
                            onSelectionChanged={sel => context.setState({month: sel})}
                            />                        
                            <Klutch.KSelectInput
                            label="RENEWAL DAY"
                            data={[...Array(31).keys()].map(i => i + 1)}
                            value={day}
                            editable={false}
                            onSelectionChanged={sel => context.setState({day:sel})}
                            />
                        </>  
                    )}

                {frequency === "WEEKLY" && (
                        <Klutch.KSelectInput
                        label="RENEWAL DAY"
                        data={Object.keys(WeekDays).map(c => WeekDays[c])}
                        value={weekday}
                        editable={false}
                        onSelectionChanged={sel => context.setState({weekday: sel})}
                        />  
                )}
                <Klutch.KView style={{flex: 1}}/>
                <Klutch.KButtonBar>
                    <Klutch.KButton 
                        type="primary"
                        label="Save"
                        loading={loading}
                        onPress={onSave}
                    />
                </Klutch.KButtonBar>                              
            </Klutch.KForm>
        </Klutch.KView>   
    )
}
