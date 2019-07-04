const library = document.querySelector(".library");

let myLibrary = [];

const Book = function (title, author, pages, read = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  
  Book.prototype.info = () => {
    let isRead = read ? "read" : "not read yet";
    let info = title + " by " + author + ", " + pages + " pages, " + isRead;
    return info;
  }
}

function addBook(book) {
  myLibrary.push(book);
}

let book1 = new Book("Free Will", "Sam Harris", 155, true);
let book2 = new Book("The Other America", "Michael Harrington", 163, true);
addBook(book1.info());
addBook(book2.info());

library.innerHTML = myLibrary;