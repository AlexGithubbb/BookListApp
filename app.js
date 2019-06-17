// Book constructor
function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
// UI constructor

function UI (){}

// localStorage.clear();

UI.prototype.addBookToList = function (book){

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
}

UI.prototype.clearFields = function(){
    document.getElementById('title').value = '',
    document.getElementById('author').value = '',
    document.getElementById('isbn').value = '';
}

UI.prototype.showMessage = function(message, type){
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

// remove book
UI.prototype.removeBook = function(target){
  if(target.className === 'delete'){
    target.parentElement.parentElement.remove();
    // instantiate the UI
    // const ui = new UI();
    // // show the removed successfully message
    // ui.showMessage('Book removed', 'success')
  }
}

function Store() {}

Store.prototype.getBooks = function () {
  let books;
  // let books = JSON.parse(localStorage.getItem('books')) || [];
  if (localStorage.getItem('books') === null) {
    books = [];
  }
  else {
    books = JSON.parse(localStorage.getItem('books'));
  }
  return books;
}

Store.prototype.displayBook = function () {
  const store = new Store();
  const books = store.getBooks();
  books.forEach(function(book){
    const ui = new UI();
    ui.addBookToList(book);
  })
}

// OK
Store.prototype.addBookToList = function (book) {
  // instantiate the Store
  const store = new Store();
  const books = store.getBooks();
  // console.log(books);
  books.push(book);
  // console.log(books);
  localStorage.setItem('books', JSON.stringify(books));
}

Store.prototype.removeBook = function (isbn) {
  // remove from LS
  const store = new Store();
  const books = store.getBooks();
  books.forEach((book, index) => {
    if (book.isbn === isbn) {
      books.splice(index, 1);
    }
  })
  localStorage.setItem('books', JSON.stringify(books));
}


// const store = new Store();
// console.log(store);
// console.log(store.addBookToList());
document.addEventListener('DOMContentLoaded', function(){
  const store = new Store();
  store.displayBook();
})

// Event Listeneres for add

document.getElementById('book-form').addEventListener('submit', function(e) {
  // Get form values
  const title = document.getElementById('title').value,
        author= document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

  // Instantiate a book
  const book = new Book(title, author, isbn);

  // Instantiate UI
  const ui = new UI();

  // Instantiate LS
  const store = new Store();
  // Validate
  if(title === '' || author === '' || isbn === ''){
   // show the error message
    ui.showMessage('Please check your input','error');
    // alert('failed');
  }else{
    // Add book into UI
    ui.addBookToList(book);
    // Add book into LS
    store.addBookToList(book);
    // Clear input fields
    ui.clearFields();
    // show the success message
    ui.showMessage('You added book successfully','success');
  }

  e.preventDefault();
});

// Event Listener for Delete
document.getElementById('book-list').addEventListener('click', function(e){
  // Instantiate UI
  const ui = new UI();
  // set the filter here
  if(e.target.className === 'delete'){
    ui.removeBook(e.target);
    const store = new Store();
    // console.log(e.target.parentElement.previousElementSibling.textContent);
    store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  }
})






