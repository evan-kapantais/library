let _library = [];

const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const yearInput = document.querySelector("#year");
const categoryInput = document.querySelector("#category");
const readInput = document.querySelector("#read");
const form = document.querySelector(".book-form");
const btnAddBook = document.querySelector(".btn--add");
const btnShowForm = document.querySelector(".btn--show");
const btnCloseForm = document.querySelector(".btn--close");

window.addEventListener("load", renderLibrary);
btnShowForm.addEventListener("click", showForm);
btnCloseForm.addEventListener("click", closeForm);
btnAddBook.addEventListener("click", getBookInfo);

function showForm() {
  form.classList.add("shown");
}

function closeForm() {
  form.classList.remove("shown");
}

class Book {
  constructor(title, author, year, category, read, index) {
    this.title = title,
    this.author = author,
    this.year = year,
    this.category = category,
    this.read = read
  }
}

function getBookInfo() {
  const book = new Book(titleInput.value, authorInput.value, 
  yearInput.value, categoryInput.value, readInput.checked);

  addBookToLibrary(book);
  renderBookCard(book);
  form.reset();
}

function addBookToLibrary(book) {
  _library.push(book);

  if (localStorage.getItem("library")) {
    const library = JSON.parse(localStorage.getItem("library"));
    library.push(book);
    localStorage.setItem("library", JSON.stringify(library));
  } else {
    localStorage.setItem("library", JSON.stringify(_library));
  }
}

function renderLibrary() {
  if (!localStorage.getItem("library")) {
    return;
  } else {
    const library = JSON.parse(localStorage.getItem("library"));
    library.forEach(book => {
      renderBookCard(book);
    });
  }
}

function renderBookCard(book) {
  const bookCard = document.createElement("div");
  bookCard.classList.add("book__card");
  bookCard.setAttribute("data-key", book.title);
  bookCard.setAttribute("draggable", true);

  bookCard.innerHTML = `<button class="btn btn__delete">X</button>
                        <p class="book__title">${book.title}</p>
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

  bookCard.addEventListener("dragstart", function() {
    
  });

  // bookCard.ondragstart = () => console.log("drag");

  const btnDelete = bookCard.querySelector(".btn__delete");
  btnDelete.addEventListener("click", deleteItem);
}

function deleteItem(e) {
  const card = e.target.parentNode;
  const column = card.parentNode;

  column.removeChild(card);
  const library = JSON.parse(localStorage.getItem("library"));

  const filteredLibrary = library.filter(book => book.title != card.getAttribute("data-key").toLowerCase());
  localStorage.setItem("library", JSON.stringify(filteredLibrary));
}

function fillInputs() {
  titleInput.value = "God Is Not Great";
  authorInput.value = "Christopher Hitchens";
  yearInput.value = "2005";
  categoryInput.value = "Non-Fiction";
  readInput.checked = true;
}