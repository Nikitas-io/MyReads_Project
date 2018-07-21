import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Debounce } from "react-throttle";
import Book from './Book'
import * as fetchBooks from '../BooksAPI'

class SearchBar extends Component{
    state = {
        query: '',
        showingBooks: [],
        message: '',
        messageFlag: false
    };
  
    /**
     * Load the books from the user's categories.
     * It is specifically asked that search results are not shown when all of the text is deleted out of the search input box.
    componentDidMount() {
        this.categoryBooks();
    } */

    /**
     * Update the query and set the showingBooks state according to that query.
     */
	updateQuery = (query) => {
        //Fetch books that match the query.
        if(query){
            fetchBooks.search(query)
            .then((books) => { 
                if(books){
                    this.setState({showingBooks: books});
                }
            })
            .catch((error) => `Something went terribly wrong! Here's your error: ${error}`);
        }
        //If the query is empty, fetch all books that are in the categories again.
        else{
            this.categoryBooks();
        }
        this.setState( {query: query.trim()});
    }

    /**
     * Update the book's category in the server and set the corresponding message.
     * @param {*} book The book that changed category.
     * @param {*} shelf The new shelf that it's going to be inserted in.
     */
    updateCategory(book, shelf) {
        fetchBooks.update(book, shelf)
        .then(() => {
            let newMessage;
            if(shelf === "currentlyReading"){
                newMessage = `Let us know your impressions once you finish '${book.title}'.`;
            }else if(shelf === "wantToRead"){
                newMessage = `'${book.title}' has been added to your read-list.`;
            }else if(shelf === "read"){
                newMessage = `How was '${book.title}'? Let us know.`;
            }else{
                newMessage = `Cool...`;
            }
            //Save the message.
            this.setState({message: newMessage});

            //Raise flag to show message.
            this.setState({messageFlag: true});

            //Clear message after 4 seconds.
            setTimeout(()=>{
                this.setState({messageFlag: false});
            }, 4000);
        })
        .catch((error) => `Something went terribly wrong! Here's your error: ${error}`);
    }
    
    /**
     * Get the books that already exist in the user's categories.
     */
    categoryBooks = () => {
        fetchBooks.getAll()
        .then((allBooks) => {
            this.setState({ showingBooks: allBooks });
        })
        .catch((error) => `Something went terribly wrong! Here's your error: ${error}`);
    }

    render(){
        const {showingBooks, message, messageFlag}=this.state;

        return( 
            <div className="search-books">
                <div className="search-books-bar">
                    <Link className="close-search" to="/">Close</Link>
                    <div className="search-books-input-wrapper">
                        {/*
                            Debounce: Our event handler will only be called if at least 500ms
                            have passed since the last event. In this case, this means that the typed input
                            will only be processed 500ms after the user's last keystroke. It is necessary that
                            I remove the value attribute (value={this.state.query}) fot Debounce to work.
                        */}
                        <Debounce time="500" handler="onChange">
                            <input 
                                type="text" 
                                placeholder="Search by title or author"
                                onChange={(event)=>this.updateQuery(event.target.value)}
                            />
                        </Debounce>
                    </div>
                </div>
                <div className="search-books-results">
                    { //Print a message when a book changes category.
                        messageFlag && (
                        <span>{message}</span>
                    )}
                    <ol className="books-grid">
                        {showingBooks.error ? (
                            <h1>No books found with that title
                                <span role="img" aria-label="jsx-a11y/accessible-emoji"> 💩</span>
                            </h1>
                        ): 
                            showingBooks.map((book) =>
                                <Book
                                    key={book.id}
                                    book={book}
                                    updateCategory={this.updateCategory.bind(this)}
                                />)
                        }    
                    </ol>
                </div>
            </div>
        )
    }
}

export default SearchBar