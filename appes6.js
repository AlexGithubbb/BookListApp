class Book{
  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI{
  addBookToList(book){
    const list = document.getElementById('book-list');
    // Create tr element
    const row = document.createElement('tr');

    // insert td into tr
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X<a></td>
    `
      list.append(row);
    // console.log(list);
  }
  clearFields(){
    document.getElementById('title').value = '',
    document.getElementById('author').value = '',
    document.getElementById('isbn').value = '';
  }
  showMessage(message, type){
    // Create message div element
    const mesg = document.createElement('div');
    // add class
    mesg.className += `${type}`;
    // add message
    mesg.appendChild(document.createTextNode(`${message}`));
    const container = document.querySelector('.container');
    const form = document.getElementById('book-form');
    container.insertBefore(mesg, form);

    setTimeout(() => {
      // both ways work!
      // mesg.style.display = 'none';
      mesg.remove();
    }, 2000);
  }
  removeBook(target){
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
      // instantiate the UI
      // const ui = new UI();
      // // show the removed successfully message
      // ui.showMessage('Book removed', 'success')
    }
  }
}


class Store {
  // get data from lS
  static getBooks() {
    console.log('book got from LS');
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    }
    else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks() {
    console.log('book displayed in UI');
    // get books from LS;
    const books = Store.getBooks();
    books.forEach( book =>{
      const ui = new UI();
      ui.addBookToList(book);
    })
  }

  // add data to LS
  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }
  // Remove from LS
  static removeBook(isbn) {
    // console.log(isbn);
    const books = Store.getBooks();
    books.forEach( (book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }// if the isbn from UI and LS matched
    })
    // SEt the LS again after we remove the book
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// display book in UI from LS
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listeneres for add
document.getElementById('book-form').addEventListener('submit', (e) => {
  // Get form values
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;

  // Instantiate a book
  const book = new Book(title, author, isbn);

  // Instantiate UI
  const ui = new UI();
  console.log(ui);

  // Validate
  if (title === '' || author === '' || isbn === '') {
    // show the error message
    ui.showMessage('Please check your input', 'error');
    // alert('failed');
  } else {
    // Add book into UI
    ui.addBookToList(book);

    // Add book to LS
    Store.addBook(book);
    // Clear input fields
    ui.clearFields();
    // show the success message
    ui.showMessage('You added book successfully', 'success');
  }

  e.preventDefault();
});

// Event Listener for Delete
document.getElementById('book-list').addEventListener('click', e => {
  // Instantiate UI
  const ui = new UI();
  // set the filter here
  if (e.target.className === 'delete') {
    ui.removeBook(e.target);
    // Remove from LS
    // we need to get sth unique to remove from both UI and LS, which is isbn number
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  }
  e.preventDefault();
})



