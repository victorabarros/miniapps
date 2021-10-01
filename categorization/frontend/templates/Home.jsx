Template = (data, context) => {

    if (!data || !data.amountPerCategory || data.amountPerCategory.length == 0) {
        return (<Klutch.KText>No data...</Klutch.KText>)
    }
    var allCategories = data.amountPerCategory
        .filter(x => x.amount > 0)
        .sort((x, y) => y.amount - x.amount)    

    const others = allCategories.splice(4).reduce((acc, curr) => acc + curr.amount, 0)


    var chartData = allCategories
        .map(d => ({x: d.category.name, y: Math.round(d.amount)}))
    
    if (others && others > 0) {
        chartData.push({x: "OTHERS", y: Math.round(others)})
    }    
    

    
    const colors = ["#44CCFF", "#82E5B9", "#F8D6F9", "#FFFD9F", "#E9F2EF", "#B4B4B4"]

    if (!context.state) {
        const run = async () => {
            const transactions = AlloyJS.getTransactions()            
        }
        run()
    }

    return (                
        <Klutch.KPressable style={{flex: 1}} onPress={() => context.loadTemplate("/templates/Main.template")} >
            <Klutch.KView style={{flex: 1,  flexDirection: "row"}}>            
                <Klutch.KView style={{flexBasis: 130, flex: 0}} pointerEvents="none">
                    <Victory.VictoryPie  
                    colorScale={colors}                             
                    containerComponent={<Victory.VictoryContainer responsive={false}   />}   
                    data={chartData} 
                    labels={() => null} 
                    radius={60}                       
                    origin={{x: 60, y: 75}}
                    innerRadius={40}            
                    padding={0} />
                </Klutch.KView>                  
                <Klutch.KView style={{flex: 1, justifyContent: "flex-start"}}>
                    {chartData.map((c, i) => (
                        <Klutch.KView key={c.x} style={{flexDirection: "row", justifyContent: "space-between", paddingVertical: 5}}>
                            <Klutch.KView style={{flexDirection:"row", justifyContent: "flex-start", alignItems: "center"}}>
                                <Klutch.KView style={{width: 10, height: 10, backgroundColor: colors[i], marginRight: 10}}/>
                                <Klutch.KText>{c.x}</Klutch.KText>
                            </Klutch.KView>
                            <Klutch.KText>{c.y}</Klutch.KText>
                        </Klutch.KView>
                    ))}
                </Klutch.KView>        
            </Klutch.KView>
        </Klutch.KPressable>
    )
}