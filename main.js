let _library = [];

const form = document.querySelector(".book-form");


// window.addEventListener("load", Display.render);

const BookForm = (function(){
  
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



// const Display = (function(){

  
// })();

class Book {
  constructor(title, author, year, category, column) {
    this.title = title,
    this.author = author,
    this.year = year,
    this.category = category,
    this.column = column
  }
}

// function render() {

//   const storedLibrary = localStorage.getItem("library");

//   if (storedLibrary != null) {
//     const library = JSON.parse(storedLibrary);
//     library.forEach(book => {
//       renderBookCard(book);
//     });
//   }
// }

// function renderBookCard(book) {
//   const bookCard = document.createElement("div");
//   bookCard.classList.add("book__card");
//   bookCard.setAttribute("data-key", book.title);
//   bookCard.setAttribute("draggable", true);

//   bookCard.innerHTML = `<button class="btn btn__delete">X</button>
//                         <p class="book__title">${book.title}</p>
//                         <p class="book__author">${book.author}</p>
//                         <div class="book__footer">
//                           <p class="book__year">${book.year}</p>
//                           <p class="book__category">${book.category}</p>
//                         </div>
//                         <form name="move__form" class="move__form">
//                           <select id="move">
//                             <option value="">Move To...</option>
//                             <option value="backlog">Backlog</option>
//                             <option value="unread">Unread</option>
//                             <option value="read">Read</option>
//                           </select>
//                         </form>`;

//   if (book.column == "backlog") {
//       const backlogColumn = document.querySelector("#backlog");
//       backlogColumn.appendChild(bookCard);
//     } else if (book.column == "unread") {
//       const unreadColumn = document.querySelector("#unread");
//       unreadColumn.appendChild(bookCard);
//     } else {
//       const readColumn = document.querySelector("#read");
//       readColumn.appendChild(bookCard);
//     }

//   const moveForm = bookCard.querySelector("#move");
//   const currentColumnId = bookCard.parentNode.id;
//   moveForm.value = currentColumnId;
//   moveForm.addEventListener("change", () => changeBookCategory(bookCard, moveForm));

//   const btnDelete = bookCard.querySelector(".btn__delete");
//   btnDelete.addEventListener("click", deleteItem);

//   bookCard.addEventListener("dragstart", handleDragStart);
//   bookCard.addEventListener("dragend", handleDragEnd);

//   const columns = document.querySelectorAll(".column");

//   columns.forEach(column => {
//     column.addEventListener("dragover", handleDragOver);
//     column.addEventListener("dragenter", handleDragEnter);
//     column.addEventListener("dragleave", handleDragLeave);
//     column.addEventListener("drop", handleDragDrop);
//   });
// }

// function changeBookCategory(bookCard, moveForm) {
//   const moveFormValue = moveForm.value;
//   const currentColumnId = bookCard.parentNode.id;
//   const targetColumn = document.querySelector(`#${moveFormValue}`);

//   if (moveFormValue != currentColumnId) {
//     targetColumn.appendChild(bookCard);
//     const library = JSON.parse(localStorage.getItem("library"));
//     library.forEach(book => {
//       if (book.title.toLowerCase() == bookCard.getAttribute("data-key").toLowerCase()) {
//         book.column = moveFormValue;
//         localStorage.setItem("library", JSON.stringify(library));
//       }
//     });
//   }
// }

// function deleteItem(e) {
//   const card = e.target.parentNode;
//   const column = card.parentNode;

//   column.removeChild(card);
//   const library = JSON.parse(localStorage.getItem("library"));

//   const filteredLibrary = library.filter(book => book.title.toLowerCase() != card.getAttribute("data-key").toLowerCase());
//   localStorage.setItem("library", JSON.stringify(filteredLibrary));
// }

// //Fill inputs with placeholder book

// function fillInputs() {
//   titleInput.value = "God Is Not Great";
//   authorInput.value = "Christopher Hitchens";
//   yearInput.value = "2005";
//   categoryInput.value = "Non-Fiction";
//   columnInput.value = "backlog";
// }



// // Handle drag

// let draggedCard = null;

// function handleDragStart() {
//   setTimeout(() => {
//     this.style.display = "none";
//   }, 0);
//   draggedCard = this;
//   console.log(draggedCard);
// }

// function handleDragEnd() {
//   this.style.display = "block";
// }

// function handleDragOver(e) {
//   e.preventDefault(e);
// }

// function handleDragEnter(e) {
//   this.classList.add("hovered");
// }

// function handleDragLeave() {
//   this.classList.remove("hovered");
// }

// function handleDragDrop() {
//   this.classList.remove("hovered");
//   this.append(draggedCard);
// }