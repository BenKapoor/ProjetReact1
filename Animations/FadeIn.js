// Animations/FadeIn.js

import React from 'react'
import { Animated, Dimensions } from 'react-native'

class FadeIn extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      positionLeft: new Animated.Value(Dimensions.get('window').width)
    }
  }

  componentDidMount() {
    Animated.spring(
      this.state.positionLeft,
      {
        toValue: 0
      }
    ).start()
  }

  render() {
    return (
      <Animated.View
        style={{ left: this.state.positionLeft }}>
        {/* Etant donné que le componant FadeIn entour les autres componant, il devient parent et doit alors 
        retourner ses enfants !  */}
        {this.props.children}
      </Animated.View>
    )
  }
}

export default FadeIn