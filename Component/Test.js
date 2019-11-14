// Components/Test.js

import React from 'react'
import { StyleSheet, View, Platform, Animated } from 'react-native'
import { duration } from 'moment'

class Test extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      // on définit généralement l'animated.value dans le state
      topPosition: new Animated.Value(0)
    }
  }

  componentDidMount(){
    // // modifie la valeure de animated.value en durée
    // Animated.timing(
    //   // def de la valeure de départ
    //   this.state.topPosition,
    //   {
    //     //défini la valeure d'arrivée
    //     toValue: 100,
    //     //def de la durée de l'animation
    //     duration: 3000,
    //   }
    // ).start()

    Animated.spring(
      // autre type d'animation avec sprind, faire un rebondissement
      this.state.topPosition,
      {
        toValue: 100,
        speed: 4,
        bounciness: 30
      }
    ).start()
  }

  render() {
    return (
      <View style={styles.main_container}>
        <Animated.View style={[styles.subview_container, {top: this.state.topPosition}]}>
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  subview_container: {
    // affiche une couleur en fonction de l'os 1ere façon
    // backgroundColor: Platform.OS === 'ios' ? 'red' : 'blue',
    // height: 50,
    // width: 50,
    ...Platform.select({
      ios: {
        backgroundColor: 'red'
      },
      android:{
        backgroundColor: 'blue'
      }
      
    }),
    height: 50,
    width: 50,
  },
  animation_view : {
    backgroundColor: 'blue',
    width:100,
    height: 100,
  }
})

export default Test