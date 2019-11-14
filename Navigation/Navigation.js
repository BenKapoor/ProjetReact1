// Navigation/Navigation.js

// N'oubliez pas l'import de React ici. On en a besoin pour rendre nos components React Native Image !
import React from 'react'  
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { StyleSheet, Image, Text } from 'react-native';
import Search from '../Component/Search'
import FilmDetail from '../Component/FilmDetail'
import Favorites from '../Component/Favorites'
import Test from '../Component/Test'

const SearchStackNavigator = createStackNavigator({
    Search: { // Ici j'ai appelé la vue "Search" mais on peut mettre ce que l'on veut. C'est le nom qu'on utilisera pour appeler cette vue
        screen: Search,
        navigationOptions: {
        title: 'Rechercher'
        }
    },
    FilmDetail: {
        screen: FilmDetail
  }
})

const FavoritesStackNavigator = createStackNavigator({
    Favorites: {
      screen: Favorites,
      navigationOptions: {
        title: 'Favoris'
      }
    },
    FilmDetail: {
      screen: FilmDetail
    }
  })

const MoviesTabNavigator = createBottomTabNavigator(
    {
        Search: {
            screen: SearchStackNavigator,
            navigationOptions: {
            tabBarIcon: () => { // On définit le rendu de nos icônes par les images récemment ajoutés au projet
                return <Image
                source={require('../Images/ic_search.png')}
                style={styles.icon}/> // On applique un style pour les redimensionner comme il faut
            }
            }
        },
        Favorites: {
            screen: FavoritesStackNavigator,
            navigationOptions: {
            tabBarIcon: () => {
                return <Image
                source={require('../Images/ic_favorite.png')}
                style={styles.icon}/>
            }
            }
      },
      Test: {
        screen: Test,
        navigationOptions: {
            tabBarIcon: () => {
                return <Text>Test</Text>
                }
        }
    },
    },
    {
      tabBarOptions: {
        activeBackgroundColor: '#DDDDDD', // Couleur d'arrière-plan de l'onglet sélectionné
        inactiveBackgroundColor: '#FFFFFF', // Couleur d'arrière-plan des onglets non sélectionnés
        showLabel: false, // On masque les titres
        showIcon: true // On informe le TabNavigator qu'on souhaite afficher les icônes définis
      }
    }
  )
  
  const styles = StyleSheet.create({
    icon: {
      width: 30,
      height: 30
    }
  })
  
  export default createAppContainer(MoviesTabNavigator)