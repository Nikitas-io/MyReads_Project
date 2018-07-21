import React, {Component} from 'react'
import PropTypes from 'prop-types'

class Book extends Component{

    /**
     * Define the data type we want to see right from the get-go and warn us during development
     * if the prop that's passed to the component doesn't match what is expected.
     */
    static propTypes = {
        book: PropTypes.object.isRequired,
        updateCategory: PropTypes.func.isRequired
    }
    state = {
        //I use this for selecting “selected” on <select> element's correct <option> element.
        currentCategory: this.props.book.shelf 
    }

    render(){

        const {book, updateCategory} = this.props;
        const {currentCategory} = this.state;
        const bookThumbnail = book.imageLinks ? book.imageLinks.smallThumbnail : null;
    
        return (
            <li>
                <div className="book">
                    <div className="book-top">
                        <div className="book-cover" style={{ width: 128, height: 188, backgroundImage: `url(${bookThumbnail})` }}></div>
                            <div className="book-shelf-changer">
                                <select 
                                    className="select-category"
                                    value={currentCategory /*React automatically understands booleans for selected option*/ }
                                    onChange={(event) => updateCategory(book, event.target.value)} 
                                >
                                    <option value="none">None</option>
                                    <option value="currentlyReading">Currently Reading</option>
                                    <option value="wantToRead">Want to Read</option>
                                    <option value="read">Read</option>
                                </select>
                            </div>
                        </div>
                    <div className="book-title">{book.title}</div>
                    <div className="book-authors">{book.authors}</div>
                </div>
            </li>
        )
    }
}

export default Book