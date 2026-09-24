import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Adaptive Learning Platform
      </Text>


      <Text style={styles.subtitle}>
        Learn • Practice • Test • Improve
      </Text>


    </View>

  );
}


const styles = StyleSheet.create({

  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#ffffff"
  },


  title:{
    fontSize:28,
    fontWeight:"bold"
  },


  subtitle:{
    marginTop:10,
    fontSize:16,
    color:"gray"
  }

});