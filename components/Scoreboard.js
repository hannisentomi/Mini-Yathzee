import { View, Text,Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { DataTable } from 'react-native-paper';
import Header from './Header';
import Footer from './Footer';
import { NBR_OF_SCOREBOARD_ROWS, SCOREBOARD_KEY } from '../constants/Game';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../style/style';
export default Scoreboard = ({ navigation }) => {

    const [scores, setScores] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getScoreboardData();
        });
        return unsubscribe;
    }, [navigation]);




    const getScoreboardData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (jsonValue != null) {
                let tmpScores = JSON.parse(jsonValue);
                tmpScores.sort((a, b) => b.points - a.points); 
                setScores(tmpScores);
            }
        }
        catch (e) {
            console.log('Read Error', e);
        }
    }

    const clearScoreboard = async () => {
        try {
          await AsyncStorage.clear();
          setScores([]); 
        } catch (e) {
          console.log('Clear Error', e);
        }
      }


        return (
            <>
                <Header />
                <View >
                    <Text>Scoreboard</Text>
                    {scores.length === 0 ?
                        <Text>No scores yet</Text>
                        :
                        scores.map((playerPoints, index) => (
                            index < NBR_OF_SCOREBOARD_ROWS &&
                            <DataTable.Row key={playerPoints.key}>
                                <DataTable.Cell>{index + 1}.</DataTable.Cell>
                                <DataTable.Cell>{playerPoints.name}</DataTable.Cell>
                                <DataTable.Cell>{playerPoints.date}</DataTable.Cell>
                                <DataTable.Cell>{playerPoints.time}</DataTable.Cell>
                                <DataTable.Cell>{playerPoints.points}</DataTable.Cell>
                            </DataTable.Row>
                        ))
                    }
                </View>
                <View> 
                    <Pressable
                     onPress={() => clearScoreboard()}>
                        <Text  style={styles.text}>CLEAR SCOREBOARD</Text> 
                     </Pressable>

                </View>
                <Footer />
            </>
        )
    }
