// API/TMDBApi.js

const API_TOKEN = "d61b72d9e24007db2f095dd48787e1f8";

export function getFilmsFromApiWithSearchedText (text, page) {
  const url = 'https://api.themoviedb.org/3/search/movie?api_key=' + API_TOKEN + '&language=fr&query=' 
  + text + "&page=" + page
  // utilisation de la librairie fetch pour l'appel API
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error))
}

// API/TMDBApi.js

export function getImageFromApi (name) {
    return 'https://image.tmdb.org/t/p/w300' + name
  }

export function getFilmDetailFromApi (id) {
  const url = 'https://api.themoviedb.org/3/movie/ '+ id +'?api_key=' + API_TOKEN + '&language=fr'
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error))
}