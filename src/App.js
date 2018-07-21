import React from 'react'
import './App.css'
import SearchBar from './myComponents/SearchBar';
import BookShelf from './myComponents/Bookshelf';
import { Route } from 'react-router-dom'

class BooksApp extends React.Component {

  render() {
    return (
      <div className="app">
        <Route path="/" exact component={BookShelf} />
        <Route path="/search" component={SearchBar}/>
      </div>
    )
  }
}

export default BooksApp
