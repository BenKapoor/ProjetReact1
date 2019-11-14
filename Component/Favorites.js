import React from 'react'
import { StyleSheet } from 'react-native'
import FilmList from './FilmList'
import { connect } from 'react-redux'

class Favorites extends React.Component {

    render() {
        return (
            <FilmList
                films={this.props.favoritesFilm}
                navigation={this.props.navigation}
                // Ici on est bien dans le cas de la liste des films favoris. 
                // Ce booléen à true permettra d'empêcher de lancer la recherche de plus de films 
                // après un scroll lorsqu'on est sur la vue Favoris.
                favoriteList={true} 
                
            />
        )
    }
}

const styles = StyleSheet.create({})

// On connecte le store Redux, 
// ainsi que les films favoris du state de notre application, à notre component Favorites
const mapStateToProps = state => {
    return {
      favoritesFilm: state.favoritesFilm
    }
  }

export default connect(mapStateToProps)(Favorites) 