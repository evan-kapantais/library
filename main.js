let library = [];

const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const yearInput = document.querySelector("#year");
const categoryInput = document.querySelector("#category");
const readInput = document.querySelector("#read");

const btnAddBook = document.querySelector(".btn--add");
btnAddBook.addEventListener("click", getBookInfo);


class Book {
  constructor(title, author, year, category, read) {
    this.title = title,
    this.author = author,
    this.year = year,
    this.category = category,
    this.read = read
  }
}

Book.prototype.info = function() { 
  return this.title, this.author, this.year, this.category, this.read;
}

function getBookInfo() {
  const book = new Book(titleInput.value, authorInput.value, 
  yearInput.value, categoryInput.value, readInput.checked);

  addBookToLibrary(book);
  renderBookCard(book);
  
  console.log(book.info());
}
  
function addBookToLibrary(book) {
  library.push(book);
  console.log(library);
}

function renderBookCard(book) {
  const bookCard = document.createElement("div");
  bookCard.classList.add("book__card");
  bookCard.innerHTML = `<p class="book__title">${book.title}</p>
                        <p class="book__author">${book.author}</p>
                        <div class="book__footer">
                          <p class="book__year">${book.year}</p>
                          <p class="book__category">${book.category}</p>
                        </div>`;
  if (book.read == true) {
    const readColumn = document.querySelector(".column__read");
    readColumn.appendChild(bookCard);
  } else {
    const notReadColumn = document.querySelector(".column__not-read");
    notReadColumn.appendChild(bookCard);
  }
}

function fillInputs() {
  titleInput.value = "God Is Not Great";
  authorInput.value = "Christopher Hitchens";
  yearInput.value = "2005";
  categoryInput.value = "Non-Fiction";
  readInput.checked = true;
}

// fillInputs();