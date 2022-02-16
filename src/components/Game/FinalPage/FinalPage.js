import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../../../constants";

const Number = ({number, label}) => (
    <View style={{ alignItems: 'center', margin: 10 }}>
        <Text style={{ color: colors.lightgrey, fontSize: 30, fontWeight: 'bold' }}>{number}</Text>
        <Text style={{ color: colors.lightgrey, fontSize: 16, }}>{label}</Text>
    </View>
);

const GuessDistributionLine = ({position, amount, percentage}) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            <Text style={{ color: colors.lightgrey}}>{position}</Text>
        <View style={{ alignSelf: 'stretch', backgroundColor: colors.grey, margin: 5, padding: 5, width: `${percentage}%` }}>
            <Text style={{ color: colors.lightgrey}}>{amount}</Text>
        </View>
        </View>
    );
};

const GuessDistribution =() => {
    return (
    <>
    <Text style={styles.subtitle}>Guess Distribution</Text>
    <View style={{ width: '100%', padding: 20 }}>
        <GuessDistributionLine position={0} amount ={2} percentage={50}/>
    </View>
    </>
    )   
}

const FinalPage = ({ won = false}) => {
    const share = () => {

    }

    return (
        <View style={{ alignItems: 'center' }}>
            <Text style={styles.title}>
                {won ? 'Congrats' : 'Try again tomorrow'}
            </Text>
            <Text style={styles.subtitle}>Statistics</Text>
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                <Number number ={2} label={'Played'} />
                <Number number ={2} label={'Win %'} />
                <Number number ={2} label={'Cur Streak'} />
                <Number number ={2} label={'Max Streak'} />
            </View>

            
            <GuessDistribution />
            <View style={{flexDirection: 'row' }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ color: colors.lightgrey}}>Next Wordle Here</Text>
                    <Text style={{ color: colors.lightgrey, fontSize: 24, fontWeight: 'bold' }}>10:35:00</Text>
                </View>

                <Pressable onPress={share} style={{ flex: 1, backgroundColor: colors.primary,
                     borderRadius: 25, alignItems: 'center',  justifyContent: 'center' }}>
                    <Text style={{ color: colors.lightgrey, fontWeight: 'bold' }}>Share</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        color: 'white',
        marginVertical: 20,
    },
    subtitle: {
        fontSize: 20,
        color: colors.lightgrey,
        textAlign: 'center',
        marginVertical: 15,
        fontWeight: 'bold',
    }
})

export default FinalPage;