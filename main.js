class Book {
  constructor(title, author, year, category, column) {
    this.title = title,
    this.author = author,
    this.year = year,
    this.category = category,
    this.column = column
  }
}

const BookForm = (function(){
  
  const form = document.querySelector(".book-form");
  const titleInput = document.querySelector("#title");
  const authorInput = document.querySelector("#author");
  const yearInput = document.querySelector("#year");
  const categoryInput = document.querySelector("#category");
  const columnInput = document.querySelector("#column");
  const btnShowForm = document.querySelector(".btn__show");
  const btnCloseForm = document.querySelector(".btn__close");
  const btnAddBook = document.querySelector(".btn__add");
  const btnFillBook = document.querySelector(".btn__fill");
  
  const showForm = () => {
    setTimeout(() => {
      form.classList.add("shown");
    }, 200);
    form.style.width = "300px";
    btnShowForm.setAttribute("disabled", true);
  }

  const closeForm = () => {
    setTimeout(() => {
      form.style.width = 0;
    }, 200);
    form.classList.remove("shown");
    btnShowForm.removeAttribute("disabled");
  }

  const toTitleCase = (str) => {
    return str.toLowerCase().split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.substr(1)).join(' ');
  }
  
  const getFormInfo = (e) => {
    e.preventDefault();
    const book = new Book(toTitleCase(titleInput.value), toTitleCase(authorInput.value), 
    yearInput.value, categoryInput.value, columnInput.value);
    
    Library.addBook(book);
    renderBookCard(book);
    form.reset();
  }

  const fillInputs = () => {
      titleInput.value = "God Is Not Great";
      authorInput.value = "Christopher Hitchens";
      yearInput.value = "2005";
      categoryInput.value = "Non-Fiction";
      columnInput.value = "backlog";
    }
  
  btnShowForm.addEventListener("click", showForm);
  btnCloseForm.addEventListener("click", closeForm);
  btnAddBook.addEventListener("click", getFormInfo);
  btnFillBook.addEventListener("click", fillInputs);

})();

const Card = (function(book){

  function createCard(book) {
    const card = document.createElement("div");
    card.classList.add("book__card");
    card.setAttribute("data-key", book.title);
    card.setAttribute("draggable", true);
    
    card.innerHTML = `<button class="btn btn__delete">X</button>
                          <p class="book__title">${book.title}</p>
                          <p class="book__author">${book.author}</p>
                          <div class="book__footer">
                            <p class="book__year">${book.year}</p>
                            <p class="book__category">${book.category}</p>
                          </div>`;

    const targetColumn = document.querySelector(`#${book.column}`);
    targetColumn.appendChild(card);
    
    const btnDelete = card.querySelector(".btn__delete");
    btnDelete.addEventListener("click", Card.deleteItem);
    
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);
    
    const columns = document.querySelectorAll(".column");
    
    columns.forEach(column => {
      column.addEventListener("dragover", handleDragOver);
      column.addEventListener("dragenter", handleDragEnter);
      column.addEventListener("dragleave", handleDragLeave);
      column.addEventListener("drop", handleDragDrop);
    });

    return card;
  }

  return {createCard};
})();

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

  const getBook = (title) => {
    const library = get();
    return library.find(book => book.title == title);
  }

  const deleteBook = (book) => {
    set(get().filter(b => b.title != book.title));
  }

  const render = (() => {
    get().forEach(book => {
      Card.createCard(book);
    });
  })();

  return {get, set, addBook, getBook, deleteBook, render};
})();

const Heading = (function(){

  const mainHeading = document.querySelector(".main-heading");
  mainHeading.addEventListener("keypress", handleMainHeading);
  mainHeading.addEventListener("blur", handleMainHeading);

  const get = () => {
    return JSON.parse(localStorage.getItem("main-heading"));
  }

  const set = (heading) => {   
    localStorage.setItem("main-heading", JSON.stringify(heading));
  }

  function handleMainHeading(e) {
    if (e.type == "blur") {
      mainHeading.innerText = e.target.innerText;
      set(mainHeading.innerText);
    } else if (e.type == "keypress") {
      if (e.which == 13) {
        mainHeading.innerText = e.target.innerText;
        set(mainHeading.innerText);
        e.target.blur();
      }
    }
  }
  
  const render = (() => {
    mainHeading.innerText = get();
  })();

})();

function deleteItem(e) {
  const card = e.target.parentNode;
  const cardTitle = card.getAttribute("data-key");
  const column = card.parentNode;
  const book = Library.getBook(cardTitle);
  
  column.removeChild(card);
  Library.deleteBook(book);
}

// Handle drag

let draggedCard = null;
let draggedCardKey = null;
let initialColumnId = null;


function handleDragStart() {
  setTimeout(() => {
    this.style.display = "none";
  }, 0);

  draggedCard = this;
  draggedCardKey = this.getAttribute("data-key");
  initialColumnId = this.parentNode.id;
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

function handleDragDrop(e) {
  if (initialColumnId == e.target.id) {
    return;
  }

  const newColumnId = e.target.id;
  const library = Library.get();
  const book = library.find(b => {
    return draggedCardKey == b.title;
  });
  const newBook = book;
  newBook.column = newColumnId;

  Library.deleteBook(book);
  Library.addBook(newBook);

  this.classList.remove("hovered");
  this.append(draggedCard);
}