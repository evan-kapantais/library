let library = [];

class Book {
  constructor(name, author, pages, read) {
    this.name = name,
    this.author = author,
    this.pages = pages,
    this.read = read 
  }
}

Book.prototype.info = function() { 
  return this.name + " by " + this.author + ", " + this.pages + " pages, " + this.read + ".";}

const book = new Book("Brave New World", "Aldous Huxley", 230, "read");
console.log(book.info());

function addBookToLibrary(book) {
  
}