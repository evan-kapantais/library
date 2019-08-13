let _library = [];

const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const yearInput = document.querySelector("#year");
const categoryInput = document.querySelector("#category");
const columnInput = document.querySelector("#column");
const form = document.querySelector(".book-form");
const btnAddBook = document.querySelector(".btn__add");
const btnShowForm = document.querySelector(".btn__show");
const btnCloseForm = document.querySelector(".btn__close");
const mainHeading = document.querySelector(".main-heading");

window.addEventListener("load", render);
btnAddBook.addEventListener("click", getFormInfo);

const bookForm = {
  showForm: () => {
    setTimeout(() => {
      form.classList.add("shown");
    }, 200);
    form.style.width = "300px";
    btnShowForm.setAttribute("disabled", true);
  },
  closeForm: () => {
    setTimeout(() => {
      form.style.width = 0;
    }, 200);
    form.classList.remove("shown");
    btnShowForm.removeAttribute("disabled");
  }
}

btnShowForm.addEventListener("click", bookForm.showForm);
btnCloseForm.addEventListener("click", bookForm.closeForm);

const Library = (function(){
  
  const get = () => {
    return JSON.parse(localStorage.getItem("library"));
  }

  const set = (library) => {
    localStorage.setItem("library", JSON.stringify(library));
  }
  
  const addBook = (book) => {
    let library = get();

    if (library == null) {
      library = [];
      library.push(book);
      set(library);
    } else {
      library.push(book);
      set(library);
    }
  }

  const removeBook = (book) => {
    set(get().filter(b => b.title != book.title));
  }

  const render = () => {
    get().forEach(book => {
      renderBookCard(book);
    });
  }

  return {get, set, addBook, removeBook, render};
})();

const Display = (function(){

  
})();

class Book {
  constructor(title, author, year, category, column) {
    this.title = title,
    this.author = author,
    this.year = year,
    this.category = category,
    this.column = column
  }
}

// const book = new Book("title", "author", "2012", "psy", "read");
// console.log(book);
// Library.addBook(book);

// const book1 = new Book("titlewdee", "cweauthor", "2012", "pvrsy", "rrvrvead");
// Library.addBook(book1);

function toTitleCase(str) {
  return str.toLowerCase().split(' ')
  .map(w => w.charAt(0).toUpperCase() + w.substr(1)).join(' ');
}

function getFormInfo(e) {
  e.preventDefault();

  const book = new Book(toTitleCase(titleInput.value), toTitleCase(authorInput.value), 
  yearInput.value, categoryInput.value, columnInput.value);

  addBookToLibrary(book);
  // Library.addBook(book);
  renderBookCard(book);
  form.reset();
}

function addBookToLibrary(book) {
  let library = [];

  if (localStorage.getItem("library") != null) {
    library = JSON.parse(localStorage.getItem("library"));
    library.push(book);
    localStorage.setItem("library", JSON.stringify(library));
  } else {
    library.push(book);
    localStorage.setItem("library", JSON.stringify(library));
  }
}

function render() {

  const storedHeading = localStorage.getItem("main-heading");
  const mainHeadingElement = document.querySelector(".main-heading");
  const storedLibrary = localStorage.getItem("library");

  if (storedLibrary != null) {
    const library = JSON.parse(storedLibrary);
    library.forEach(book => {
      renderBookCard(book);
    });
  }

  if (storedHeading != null) {
    mainHeadingElement.innerText = storedHeading;
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
                        </div>
                        <form name="move__form" class="move__form">
                          <select id="move">
                            <option value="">Move To...</option>
                            <option value="backlog">Backlog</option>
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                          </select>
                        </form>`;

  if (book.column == "backlog") {
      const backlogColumn = document.querySelector("#backlog");
      backlogColumn.appendChild(bookCard);
    } else if (book.column == "unread") {
      const unreadColumn = document.querySelector("#unread");
      unreadColumn.appendChild(bookCard);
    } else {
      const readColumn = document.querySelector("#read");
      readColumn.appendChild(bookCard);
    }

  const moveForm = bookCard.querySelector("#move");
  const currentColumnId = bookCard.parentNode.id;
  moveForm.value = currentColumnId;
  moveForm.addEventListener("change", () => changeBookCategory(bookCard, moveForm));

  const btnDelete = bookCard.querySelector(".btn__delete");
  btnDelete.addEventListener("click", deleteItem);

  bookCard.addEventListener("dragstart", handleDragStart);
  bookCard.addEventListener("dragend", handleDragEnd);

  const columns = document.querySelectorAll(".column");

  columns.forEach(column => {
    column.addEventListener("dragover", handleDragOver);
    column.addEventListener("dragenter", handleDragEnter);
    column.addEventListener("dragleave", handleDragLeave);
    column.addEventListener("drop", handleDragDrop);
  });
}

function changeBookCategory(bookCard, moveForm) {
  const moveFormValue = moveForm.value;
  const currentColumnId = bookCard.parentNode.id;
  const targetColumn = document.querySelector(`#${moveFormValue}`);

  if (moveFormValue != currentColumnId) {
    targetColumn.appendChild(bookCard);
    const library = JSON.parse(localStorage.getItem("library"));
    library.forEach(book => {
      if (book.title.toLowerCase() == bookCard.getAttribute("data-key").toLowerCase()) {
        book.column = moveFormValue;
        localStorage.setItem("library", JSON.stringify(library));
      }
    });
  }
}

function deleteItem(e) {
  const card = e.target.parentNode;
  const column = card.parentNode;

  column.removeChild(card);
  const library = JSON.parse(localStorage.getItem("library"));

  const filteredLibrary = library.filter(book => book.title.toLowerCase() != card.getAttribute("data-key").toLowerCase());
  localStorage.setItem("library", JSON.stringify(filteredLibrary));
}

//Fill inputs with placeholder book

function fillInputs() {
  titleInput.value = "God Is Not Great";
  authorInput.value = "Christopher Hitchens";
  yearInput.value = "2005";
  categoryInput.value = "Non-Fiction";
  columnInput.value = "backlog";
}

mainHeading.addEventListener("keypress", handleMainHeading);
mainHeading.addEventListener("blur", handleMainHeading);

function handleMainHeading(e) {
  if (e.type == "blur") {
    mainHeading.innerText = e.target.innerText;
    localStorage.setItem("main-heading", mainHeading.innerText);
  } else if (e.type == "keypress") {
    if (e.which == 13) {
      mainHeading.innerText = e.target.innerText;
      localStorage.setItem("main-heading", mainHeading.innerText);
      e.target.blur();
    }
  }
}

// Handle drag

let draggedCard = null;

function handleDragStart() {
  setTimeout(() => {
    this.style.display = "none";
  }, 0);
  draggedCard = this;
  console.log(draggedCard);
}

function handleDragEnd() {
  this.style.display = "block";
}

function handleDragOver(e) {
  e.preventDefault(e);
}

function handleDragEnter(e) {
  this.classList.add("hovered");
}

function handleDragLeave() {
  this.classList.remove("hovered");
}

function handleDragDrop() {
  this.classList.remove("hovered");
  this.append(draggedCard);
}