import axios from 'axios';

export const getCategories = () => {
  return axios
    .get('/getCategories')
    .then(({ data }) => data.categories)
    .catch(err => {
      console.log(err);
    })
}

export const getRandomJoke = () => {
  return axios
    .get('/getRandom')
    .then(({ data }) => data.random_joke)
    .catch(err => {
        console.error(err);
    })
}

export const getJokeByCategory = (category) => {
  return axios
    .get('/getByCategory', {
        params: { category }
    })
    .then(({ data }) => data.category_jokes)
    .catch(err => {
        console.error(err);
    })
}

export const getJokesBySearch = (search, category) => {
  return axios.get('/search', {
    params: {
        query: search,
        category: category === 'any' ? '' : category
    }})
    .then(({ data }) => data.jokes)
    .catch(err => {
        console.error(err);
    })
  }
