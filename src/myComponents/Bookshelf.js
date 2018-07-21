import React, {Component} from 'react'
import Book from './Book'
import { Link } from 'react-router-dom';
import escapeRegExp from 'escape-string-regexp'
import * as fetchBooks from '../BooksAPI';

class BookShelf extends Component{
    
    state = {
        currentlyReading: [],
        wantToRead: [],
        read: []
    };

    /**
     * When the search page loads up, show the books that already exist in the user's categories.
     */
    componentDidMount() {
        this.setCategories();
    }

    /**
     * Update the book's category in the server and set the new category state.
     * @param {*} book The book that changed category.
     * @param {*} shelf The new shelf that it's going to be inserted in.
     */
    updateCategory(book, shelf) {
        fetchBooks.update(book, shelf)
        .then(() => this.setCategories())
        .catch(() => alert((error) => `Something went terribly wrong! Here's your error: ${error}`));
    }

    /**
     * Set the books in the appropriate categories that the user has chosen.
     */
    setCategories() {
        fetchBooks.getAll().then(allBooks => {
            const currentlyReadingMatch = new RegExp(escapeRegExp('currentlyReading'));
            let currentlyReadingFetched;
            if(allBooks){
                 currentlyReadingFetched = allBooks.filter(book => currentlyReadingMatch.test(book.shelf));
            } else{
                 currentlyReadingFetched = null;
            } 

            const wantToReadMatch = new RegExp(escapeRegExp('wantToRead'));
            let wantToReadFetched;
            if(allBooks){
                wantToReadFetched = allBooks.filter(book => wantToReadMatch.test(book.shelf));
            } else{
                wantToReadFetched = null;
            } 

            const haveReadMatch = new RegExp(escapeRegExp('read'));
            let haveReadFetched;
            if(allBooks){
                haveReadFetched = allBooks.filter(book => haveReadMatch.test(book.shelf));
            } else{
                haveReadFetched = null;
            }

            this.setState({
                currentlyReading: currentlyReadingFetched,
                wantToRead: wantToReadFetched, 
                read: haveReadFetched
            });
        });
    }

    /**
     * Render the shelves with their corresponding books.
     */
    renderShelf(booksInCategory, categoryName) {
        return (
            <div className="bookshelf">
                <h2 className="bookshelf-title">{categoryName}</h2>
                <div className="bookshelf-books">
                    <ol className="books-grid">
                        {booksInCategory.map((book) =>
                            <Book
                                key={book.id}
                                book={book}
                                updateCategory={this.updateCategory.bind(this)}
                            />)}
                    </ol>
                </div>
            </div>
        )
    }

    render() {
        const { currentlyReading, wantToRead, read } = this.state;

        return (
            <div className="list-books">
                <div className="list-books-title">
                    <h1>MyReads</h1>
                </div>
                <div className="list-books-content">
                    <div>
                        {this.renderShelf(currentlyReading, 'Currently Reading')}
                        {this.renderShelf(wantToRead, 'Want to Read')}
                        {this.renderShelf(read, 'Read')}
                    </div>
                </div>
                <div className="open-search">
                    <Link to='/search'>
                        Add a book
                    </Link>
                </div>
            </div>
        );
  }
}

export default BookShelf