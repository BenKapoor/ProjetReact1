import React from 'react';
import { StyleSheet, View, Button, TextInput, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import {getFilmsFromApiWithSearchedText} from '../Api/TMDBApi'
import { connect } from 'react-redux'
import FilmList from './FilmList'

class Search extends React.Component {

    constructor(props){
        super(props)
        this.searchedText = ""
        this.page = 0 // Compteur pour connaître la page courante
        this.totalPages = 0 // Nombre de pages totales pour savoir si on a atteint la fin des retours de l'API TMDB
        // On met dans le state ce que l'on veut afficher à l'écran
        this.state = { 
            films: [],
            isLoading: false // fonction chargement attente
         }

        // fonction bindé au contexte
        this._loadFilms = this._loadFilms.bind(this)
    }

    // Components/Search.js

    _loadFilms() {
        if (this.searchedText.length > 0) {
        this.setState({ isLoading: true }) // Lancement du chargement
        getFilmsFromApiWithSearchedText(this.searchedText, this.page + 1).then(data => {
            this.page = data.page
            this.totalPages = data.total_pages
            this.setState({ 
                //crée une copie du tableau. Avec cette simplification, on doit passer deux copies de nos tableaux
                // pour que la concaténation fonctionne. == films: this.state.films.concat(data.results)
                films: [ ...this.state.films, ...data.results ],
                isLoading: false // Arrêt du chargement
                })
            })
        }
    }

    _searchFilms() {
        // Ici on va remettre à zéro les films de notre state
        this.page = 0
        this.totalPages = 0
        this.setState({
          films: [],
        }, () => { 
            // J'utilise la paramètre length sur mon tableau de films pour vérifier qu'il y a bien 0 film
            console.log("Page : " + this.page + " / TotalPages : " + this.totalPages + " / Nombre de films : " + this.state.films.length)
            this._loadFilms() 
        })
    }

    _searchTextInputChanged(text) {
        this.searchedText = text
      }

    _displayLoading() {
        // On test si la variable est utilisée et si c'est le cas on affiche le visuel du rond avec son style
    if (this.state.isLoading) {
            return (
            <View style={styles.loading_container}>
                <ActivityIndicator size='large' />
                {/* Le component ActivityIndicator possède une propriété size pour définir la taille du visuel de chargement : small ou large. Par défaut size vaut small, on met donc large pour que le chargement soit bien visible */}
            </View>
            )
        }
    }
    
    _displayDetailForFilm = (idFilm) => {
        console.log("Display film with id " + idFilm)
        this.props.navigation.navigate("FilmDetail", {idFilm: idFilm})
    }

    render() {  
        // console.log(this.props)      
        return (            
            <View style={styles.main_container}>
                <TextInput 
                    onChangeText={(text) => this._searchTextInputChanged(text)}
                    style={styles.textinput} 
                    placeholder='Titre du film'
                    onSubmitEditing = {() => this._searchFilms()}
                    />
                <Button title='Rechercher' onPress={() => {this._searchFilms()}}/>
                <FilmList
                    films={this.state.films} // C'est bien le component Search qui récupère les films depuis l'API et on les transmet ici pour que le component FilmList les affiche
                    navigation={this.props.navigation} // Ici on transmet les informations de navigation pour permettre au component FilmList de naviguer vers le détail d'un film
                    loadFilms={this._loadFilms} // _loadFilm charge les films suivants, ça concerne l'API, le component FilmList va juste appeler cette méthode quand l'utilisateur aura parcouru tous les films et c'est le component Search qui lui fournira les films suivants
                    page={this.page}
                    totalPages={this.totalPages} // les infos page et totalPages vont être utile, côté component FilmList, pour ne pas déclencher l'évènement pour charger plus de film si on a atteint la dernière page
                    favoriteList={false} // Ici j'ai simplement ajouté un booléen à false pour indiquer qu'on 
                    // n'est pas dans le cas de l'affichage de la liste des films favoris. 
                    // Et ainsi pouvoir déclencher le chargement de plus de films lorsque l'utilisateur scrolle.
                />
                {this._displayLoading()}
            </View> 
        )
    }
}

// Components/Search.js

const styles = StyleSheet.create({
    main_container: {
        flex:1
    },
    textinput: {
      marginLeft: 5,
      marginRight: 5,
      height: 50,
      borderColor: '#000000',
      borderWidth: 1,
      paddingLeft: 5
    },
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
      },
    loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
    }
  })

// On connecte le store Redux, ainsi que les films favoris du state de notre application, à notre component Search
const mapStateToProps = state => {
    return {
      favoritesFilm: state.favoritesFilm
    }
  }
  
  export default connect(mapStateToProps)(Search)