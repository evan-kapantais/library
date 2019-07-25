let library = [];

class Book {
  constructor(name, author, date, read) {
    this.name = name,
    this.author = author,
    this.date = date,
    this.read = read 
  }
}

Book.prototype.info = function() { 
  return this.name + " by " + this.author + ", " + this.date + ", " + this.read + ".";
}
  
function addBookToLibrary(book) {
  library.push(book);
}

function renderLibrary() {
  const libraryDiv = document.querySelector(".library");
  libraryDiv.innerHTML = library;
}

const book1 = new Book("Brave New World", "Aldous Huxley", 1930, "read");
const book2 = new Book("Talking To My Daughter", "Yanis Varoufakis", 2016, "not read");

addBookToLibrary(book1);
addBookToLibrary(book2);

console.log(library);

// renderLibrary();
