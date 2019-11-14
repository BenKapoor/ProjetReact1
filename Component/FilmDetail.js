// Components/FilmDetail.js

import React from 'react'
import { StyleSheet, View, ActivityIndicator, Text, ScrollView, Image, TouchableOpacity, Share, Platform } from 'react-native'
import { getFilmDetailFromApi, getImageFromApi } from '../Api/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'
import EnlargeShrink from '../Animations/EnlargeShrink'

class FilmDetail extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state
        // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté à la navigation
        if (params.film != undefined && Platform.OS === 'ios') {
          return {
              // On a besoin d'afficher une image, il faut donc passe par une Touchable une fois de plus
              headerRight: <TouchableOpacity
                              style={styles.share_touchable_headerrightbutton}
                              onPress={() => params.shareFilm()}>
                              <Image
                                style={styles.share_image}
                                source={require('../Images/ic_share.png')} />
                            </TouchableOpacity>
          }
        }
    }

    constructor(props){
        super(props)
        this.state = {
            film: undefined,
            // permet de gérer le chargement
            isLoading: true
        }
    }   

    // Fonction pour faire passer la fonction _shareFilm et le film aux paramètres de la navigation. 
    // Ainsi on aura accès à ces données au moment de définir le headerRight
    _updateNavigationParams() {
        this.props.navigation.setParams({
        shareFilm: this._shareFilm,
        film: this.state.film
        })
    }

    componentDidMount() {
        const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.navigation.state.params.idFilm)
        if (favoriteFilmIndex !== -1) { // Film déjà dans nos favoris, on a déjà son détail
          // Pas besoin d'appeler l'API ici, on ajoute le détail stocké dans notre state global au state de notre component
          this.setState({
            film: this.props.favoritesFilm[favoriteFilmIndex]
          }, () => { this._updateNavigationParams() })
          return
        }
        // Le film n'est pas dans nos favoris, on n'a pas son détail
        // On appelle l'API pour récupérer son détail
        this.setState({ isLoading: true })
        getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
          this.setState({
            film: data,
            isLoading: false
          }, () => { this._updateNavigationParams() })
        })
      }

    _ShareFilm(){
        const { film } = this.state
        Share.share({title: film.title, message: film.overview })
    }

    _displayFloatingActionButton(){
        const { film } = this.state
        if (film != undefined && Platform.OS === 'android') {
            return (
                <TouchableOpacity
                    style={styles.share_touchable_floatingactionbutton}
                    onPress={()=>this._ShareFilm()}
                >
                    <Image
                        style={styles.share_image}
                        source={require('../Images/ic_share.png')}
                    />

                </TouchableOpacity>
            )
            
        }
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                <ActivityIndicator size='large' />
                </View>
            )
        }
    }

    _toggleFavorite() {
        // action de type "TOGLLE_FAVORITE" et ayant la valeur du film en cours
        const action = { type: "TOGGLE_FAVORITE", value: this.state.film }
        //envoie d'action au store grace à dispatch
        this.props.dispatch(action)
    }
    
    componentDidUpdate() {
        // on test si redux fonctionne pour l'ajout et la suppression des fav 
        // et si le componant passe bien dans le cycle de vie updating à chaque changmeent de la liste fav
        console.log(this.props.favoritesFilm);
        
    }

    _displayFavoriteImage() {
        var sourceImage = require('../Images/ic_favorite_border.png')
        // Par défaut, si le film n'est pas en favoris, on veut qu'au clic sur le bouton, 
        // celui-ci s'agrandisse => shouldEnlarge à true
        var shouldEnlarge = false 
        //findIndex permet de savoir si le film fait parti des fav
        // on va comparer les identifiants avec celui du film
        // si l'id ne vaut pas -1 alors le film fait parti des favoris
        if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
            sourceImage = require('../Images/ic_favorite.png')
            // Si le film est dans les favoris, 
            // on veut qu'au clic sur le bouton, celui-ci se rétrécisse => shouldEnlarge à false
            shouldEnlarge = true 
        }
        return (
            <EnlargeShrink 
                shouldEnlarge={shouldEnlarge}>               
                <Image
                    source={sourceImage}
                    style={styles.favorite_image}
                />
            </EnlargeShrink>
        )
    }

    _displayFilm() {
        const { film } = this.state
        if (this.state.film != undefined) {
            return (
                <ScrollView style={styles.scrollview_container}>
                    <Image 
                        style={styles.image}
                        source={{uri: getImageFromApi(film.backdrop_path)}}
                    />
                    <Text style={styles.title_text}>{film.title}</Text>
                    <TouchableOpacity 
                        style={styles.favorite_container}
                        onPress={() => this._toggleFavorite()}>
                        {this._displayFavoriteImage()}
                    </TouchableOpacity>
                    <Text style={styles.original_title_text}>VO: {film.original_title}</Text>
                    <Text style={styles.overview_text}>{film.overview}</Text>
                    <Text style={styles.default_text}>Sortie le: {moment(film.release_date).calendar()}</Text>
                    <Text style={styles.default_text}>Note: {film.vote_average}</Text>
                    <Text style={styles.default_text}>Nombre de votes: {film.vote_count}</Text>
                    <Text style={styles.default_text}>Budget: {numeral(film.budget).format('0,0[.]00 $') }</Text>
                    <Text style={styles.default_text}>Genre(s): {film.genres.map(function(genre){
                        return genre.name
                    }).join(" / ")}
                    </Text>
                    <Text style={styles.default_text}>Compagnies: {film.production_companies.map(function(production){
                        return production.name
                    }).join(" / ")}
                    </Text>
                </ScrollView>
            )
        }
    }

    render() {
        console.log(this.props);
        
        return (
          <View style={styles.main_container}>
            {this._displayFilm()}
            {this._displayLoading()}
            {this._displayFloatingActionButton()}
          </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
    },
    loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
    },
    scrollView_container: {
        flex: 1
    },
    image: {
        height: 169,
        margin: 5
      },
    original_title_text:{
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 12,
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        color: '#000000',
        textAlign: 'center'
      },
    title_text: {
        fontWeight: 'bold',
        fontSize: 35,
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        color: '#000000',
        textAlign: 'center'
      },
    overview_text: {
        fontStyle: 'italic',
        color: '#666666',
        margin: 5,
        marginBottom: 15
      },
    default_text: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
      },
    favorite_container: {
          alignItems: "center"
      },
    favorite_image: {
        flex: 1,
        width: null,
        height: null,
    },
    share_touchable_floatingactionbutton: {
        position: 'absolute',
        width: 60,
        height: 60,
        right: 30,
        bottom: 30,
        borderRadius: 30,
        backgroundColor: '#e91e63',
        justifyContent: 'center',
        alignItems: 'center'
      },
    share_image: {
        width: 30,
        height: 30
    },
    share_touchable_headerrightbutton: {
        marginRight: 8
    }
})

// on connecte le state global aux props de FilmDetail
const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}
export default connect(mapStateToProps)(FilmDetail)