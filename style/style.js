import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: 'lightblue',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
     textAlign: 'center',
  },
  button: {
    backgroundColor: 'blue',
    color: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'blue',
  },
  input: {
    fontSize: 16,
    width: 200,
    color: 'black',
    fontWeight: 'bold',
    backgroundColor: 'lightgray',
    borderWidth: 1,
    borderColor: 'gray',
  },
  header: {
    marginTop: 30,
    marginBottom: 15,
    backgroundColor: 'teal',
    flexDirection: 'row',
  },
  footer: {
    marginTop: 20,
    backgroundColor: 'teal',
    flexDirection: 'row'
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 23,
    textAlign: 'center',
    margin: 10,
  },
  author: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
  },
  gameboard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gameinfo: {
    backgroundColor: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 20,
    marginTop: 10
  },
  row: {
    marginTop: 20,
    padding: 10
  },
  flex: {
    flexDirection: "row"
  },
 
  buttonText: {
    color:"#2B2B52",
    fontSize: 20
  },
  pressable: {
    height: 60, 
    width: 160,   
    padding: 5,
    margin: 10,
    borderRadius: 5,
    backgroundColor: 'teal',
    borderWidth: 1,
    borderColor: 'teal',
    justifyContent: 'center',
    alignItems: 'center',
 
  },
  pressableText: {
    color: 'white',  
    fontSize: 16,  
    fontWeight: 'bold',  
  },
});