import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import styles from '../style/style';
import { NBR_OF_DICES, NBR_OF_THROWS, MIN_SPOT, MAX_SPOT, BONUS_POINTS_LIMIT, BONUS_POINTS, SCOREBOARD_KEY } from '../constants/Game';
import { Container, Row, Col } from 'react-native-flex-grid';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

let board = [];

export default Gameboard = ({ navigation, route }) => {

    const [playerName, setPlayerName] = useState('');
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('Throw dices');
    const [gameEndStatus, setGameEndStatus] = useState(false);
    // Ovatko nopat ovat kiinnitetty
    const [selectedDices, setSelectedDices] =
        useState(new Array(NBR_OF_DICES).fill(false));
    // Noppien silmälukujen tila
    const [diceSpots, setDiceSpots] =
        useState(new Array(NBR_OF_DICES).fill(0));
    // Onko silmäluvut valittu pisteet
    const [selectedDicePoints, setSelectedDicePoints] =
        useState(new Array(MAX_SPOT).fill(false));
    // Kerätyt pisteet
    const [dicePointsTotal, setDicePointsTotal] =
        useState(new Array(MAX_SPOT).fill(0));
    // tulostaulun pisteet
    const [scores, setScores] = useState([]);


    useEffect(() => {
        if (playerName === '' && route.params?.player) {
            setPlayerName(route.params.player);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getScoreboardData();
        });
        return unsubscribe;
    }, [navigation]);

    const dicesRow = [];
    for (let dice = 0; dice < NBR_OF_DICES; dice++) {
        dicesRow.push(
            <Col key={"dice" + dice}>
                <Pressable
                    key={"dice" + dice}
                    onPress={() => selectDice(dice)}>
                    <MaterialCommunityIcons
                        name={board[dice]}
                        key={"dice" + dice}
                        size={50}
                        color={getDiceColor(dice)}>
                    </MaterialCommunityIcons>
                </Pressable>
            </Col>
        );
    }

    const pointsRow = [];
    for (let spot = 0; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key={"pointsRow" + spot}>
                <Text key={"pointsRow" + spot}>{getSpotTotal(spot)}
                </Text>
            </Col>
        );
    }

    const pointsToSelectRow = [];
    for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
        pointsToSelectRow.push(
            <Col key={"buttonsRow" + diceButton}>
                <Pressable
                    key={"buttonsRow" + diceButton}
                    onPress={() => selectDicePoints(diceButton)}
                >
                    <MaterialCommunityIcons
                        name={"numeric-" + (diceButton + 1) + "-circle"}
                        key={"buttonsRow" + diceButton}
                        size={35}
                        color={getDicePointsColor(diceButton)}
                    >
                    </MaterialCommunityIcons>
                </Pressable>
            </Col>
        );
    }


    const [hasSelectedPoint, setHasSelectedPoint] = useState(false);

    const selectDicePoints = (i) => {
        if (nbrOfThrowsLeft === 0) {
            if (!hasSelectedPoint) {
                let selectedPoints = [...selectedDicePoints];
                let points = [...dicePointsTotal];
                if (!selectedPoints[i]) {
                    selectedPoints[i] = true;
                    let nbrOfDices =
                        diceSpots.reduce(
                            (total, x) => (x === (i + 1) ? total + 1 : total), 0);
                    points[i] = nbrOfDices * (i + 1);
                    setHasSelectedPoint(false);
                    setNbrOfThrowsLeft(NBR_OF_THROWS); 
                    resetDiceSelection();  
                }
                else {
                    setStatus('You already selected point for ' + (i + 1));
                    return points[i];
                }
                setDicePointsTotal(points);
                setSelectedDicePoints(selectedPoints);
                return points[i];
            } else {
                setStatus('You can only select one point per turn.');
            }
        }
        else {
            setStatus('Throw ' + NBR_OF_THROWS + ' dices first!');
        }
    }

    const savePlayerScore = async () => {
        const newKey = scores.length + 1;
        const now = new Date();
        let totalPoints = dicePointsTotal.reduce((a, b) => a + b, 0);
        if (totalPoints >= 63) {
            totalPoints += 50;  // Bonus
        }
        const playerPoints = {
            key: newKey,
            name: playerName,
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            points: totalPoints,
        }
        try {
            const newScore = [...scores, playerPoints];
            const jsonValue = JSON.stringify(newScore);
            await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);
            getScoreboardData();
        }
        catch (e) {
            console.log('Save error', e);
        }
    }

    const getScoreboardData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (jsonValue != null) {
                let tmpScores = JSON.parse(jsonValue);
                setScores(tmpScores);
            }
        }
        catch (e) {
            console.log('Read Error', e);
        }
    }

    const throwDice = () => {
        if (nbrOfThrowsLeft === 0) {
            setStatus('No throws left for this round.');
            return;
        }
        if (hasSelectedPoint) {
            setHasSelectedPoint(false);
            setStatus('Select your points before the next throw');
            return 1;
        }
        let spots = [...diceSpots];
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if (!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1);
                board[i] = "dice-" + randomNumber;
                spots[i] = randomNumber;
            }
        }
        if (nbrOfThrowsLeft > 0) {
            setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
        }
        setDiceSpots(spots);
        setStatus('Select and throw dices again');
    }


    function getSpotTotal(i) {
        return dicePointsTotal[i];
    }
    const selectDice = (i) => {
        if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
            let dices = [...selectedDices];
            dices[i] = selectedDices[i] ? false : true;
            setSelectedDices(dices);
            
        }
        else {
            setStatus('You have to throw dices first!');
        }
    }

    const resetDiceSelection = () => {
        let resetDice = new Array(NBR_OF_DICES).fill(false);
        setSelectedDices(resetDice);
    }

    const resetGame = () => {
        setDiceSpots(new Array(NBR_OF_DICES).fill(1));
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        selectDicePoints(new Array(NBR_OF_DICES).fill(0));
        setSelectedDicePoints(new Array(NBR_OF_DICES).fill(false));
        setNbrOfThrowsLeft(NBR_OF_THROWS);
        setStatus('');
        setGameEndStatus(false);
        setPlayerName('');
        setDicePointsTotal(new Array(NBR_OF_DICES).fill(0));
    };



    function getDiceColor(i) {
        return selectedDices[i] ? 'black' : 'steelblue';
    }
    function getDicePointsColor(i) {
        return (selectedDicePoints[i] && !gameEndStatus) ? 'black' : 'steelblue';
    }
    return (
        <>
        <Header />
        <View style={styles.gameboard} >
            <Text>Gameboard</Text>
            <Container fluid>
                <Row>{dicesRow}</Row>
            </Container>
            <Text style={styles.text}>Throws Left: {nbrOfThrowsLeft}</Text>
            <Text style={styles.text}>{status}</Text>
            <Pressable onPress={() => throwDice()} style={styles.pressable}>
                <Text style={styles.pressableText}>Throw dices</Text>
            </Pressable>
            <Container fluid>
                <Row>{pointsRow}</Row>
            </Container>
            <Container fluid>
                <Row>{pointsToSelectRow}</Row>
            </Container>
            <Pressable onPress={() => savePlayerScore()} style={styles.pressable}>
                <Text style={styles.pressableText}>Save Score</Text>
            </Pressable>
            <Text style={styles.text}>Player: {playerName}</Text>
            <Text style={styles.text}>Current Score: {dicePointsTotal.reduce((a, b) => a + b, 0)}</Text>
            {dicePointsTotal.reduce((a, b) => a + b, 0) >= 63 && <Text style={styles.text}>You have passed 63 points! 50+ points!</Text>}
            <Pressable onPress={resetGame} style={styles.pressable}>
    <Text style={styles.pressableText}>Reset Game</Text>
</Pressable>
        </View>
        <Footer />
    </>
    )
}