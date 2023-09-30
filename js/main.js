import clearForm from "./utils/clear-form.js";
import displayDescriptionDiv from "./components/displayDescriptionDiv.js"
import displayItemsDiv from "./components/displayItemsDiv.js";

// Select and create DOM elements
const btnOpenModal = document.querySelector('.btn-open-form');
const btnCloseModal = document.querySelector('#closeTodoFormButton')
const btnAddNewItem = document.querySelector('.btn-add-todo-item')
const modalForm = document.querySelector('.modal');
const searchInput = document.querySelector('#searchbox');
const sortByMenu = document.querySelector('.sort-items-by-type');
const btnStartNow = document.querySelector('.btn-start-now');
const welcomeSection = document.querySelector('.welcome-section')
const sectionDisplayItems = document.querySelector('.todo-items');
const clearItems = () => document.querySelector('.todo-items').innerHTML = '';
const getDisplayDescription = () => document.querySelector('.todo-item-description');

// Retrieve or initialize list items
let listItems = JSON.parse(localStorage.getItem('todoItems')) || [];

// Function to display items
function displayItems(items = listItems) {

    clearItems();
    clearForm();

    // Add or remove the 'hidden' class based on whether there are any items
    if (items.length > 0) {
        welcomeSection.classList.add('hidden');
        localStorage.setItem('hideWelcome', 'true');
    } else {
        welcomeSection.classList.remove('hidden');
        localStorage.setItem('hideWelcome', 'false');
        const displayDescriptionElement = getDisplayDescription();
        if (displayDescriptionElement) {
            displayDescriptionElement.remove();
        }
        return;
    }
    const divDisplayDescriptionElement = displayDescriptionDiv();
    sectionDisplayItems.appendChild(divDisplayDescriptionElement);

    items.forEach((item, index) => {

        const divDisplayItemsElement = displayItemsDiv(item, index);
        sectionDisplayItems.appendChild(divDisplayItemsElement);

        const btnEdit = divDisplayItemsElement.querySelector('.todo-edit');
        const btnDone = divDisplayItemsElement.querySelector('.todo-done');

        btnEdit.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            editItem(index);
        });

        let timerId;
        clearTimeout(timerId);
        divDisplayItemsElement.classList.remove('todo-item-done', 'todo-item-remove');
        btnDone.textContent = 'Done';

        btnDone.addEventListener('click', () => {
            if (btnDone.textContent === 'Done') {
                divDisplayItemsElement.classList.add('todo-item-done');
                btnDone.textContent = 'Undo';
                btnEdit.disabled = true;
                timerId = setTimeout(() => {
                    divDisplayItemsElement.classList.add('todo-item-remove');
                    setTimeout(() => {
                        if (divDisplayItemsElement.classList.contains('todo-item-remove')) {
                            listItems.splice(index, 1);
                            localStorage.setItem('todoItems', JSON.stringify(listItems));
                            divDisplayItemsElement.remove(); // Remove the item from the DOM directly

                            // If there are no more items, remove the Description div and display the welcome message
                            if (listItems.length === 0) {
                                const displayDescriptionElement = getDisplayDescription();
                                if (displayDescriptionElement) {
                                    displayDescriptionElement.remove();
                                }
                                welcomeSection.classList.remove('hidden');
                            }
                        }
                    }, 2500);
                }, 1000);

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        btnDone.click();
                    }
                }, {once: true});
            } else {
                clearTimeout(timerId);
                divDisplayItemsElement.classList.remove('todo-item-done', 'todo-item-remove');
                btnDone.textContent = 'Done';
                btnEdit.disabled = false;
            }
        });
    });
}

// Function to edit an item
function editItem(index) {
    const item = listItems[index];
    document.querySelector('#date').value = item.date;
    document.querySelector('#time').value = item.time;
    document.querySelector('#priority').value = item.priority;
    document.querySelector('#description').value = item.description;
    btnAddNewItem.textContent = 'Edit Todo';
    btnAddNewItem.setAttribute('data-index', index);
    btnAddNewItem.removeEventListener('click', addItem);
    btnAddNewItem.addEventListener('click', updateItem, {once: true});
    modalForm.classList.remove('hidden');
    document.querySelector('#description').focus();
}

// Function to add an item
function addItem(e) {
    e.preventDefault();
    const newItem = {
        date: document.querySelector('#date').value,
        time: document.querySelector('#time').value,
        priority: document.querySelector('#priority').value,
        description: document.querySelector('#description').value,
    };
    listItems.push(newItem);
    displayItems();
    localStorage.setItem('todoItems', JSON.stringify(listItems));
    modalForm.classList.add('hidden');
    btnAddNewItem.textContent = 'Add Todo';
    btnAddNewItem.removeEventListener('click', updateItem);
    btnAddNewItem.addEventListener('click', addItem, {once: true});
}

// Function to update an item
function updateItem(e) {
    e.preventDefault();
    const index = btnAddNewItem.getAttribute('data-index');
    listItems[index] = {
        date: document.querySelector('#date').value,
        time: document.querySelector('#time').value,
        priority: document.querySelector('#priority').value,
        description: document.querySelector('#description').value,
    };
    displayItems();
    localStorage.setItem('todoItems', JSON.stringify(listItems));
    modalForm.classList.add('hidden');
    btnAddNewItem.textContent = 'Add Todo';
    btnAddNewItem.removeEventListener('click', updateItem);
    btnAddNewItem.addEventListener('click', addItem, {once: true});
}

// Event listener for window load
window.addEventListener('load', () => {
    displayItems();
    const selectedSort = localStorage.getItem('selectedSort');
    if (selectedSort) {
        sortByMenu.value = selectedSort;
        const event = new Event('change');
        sortByMenu.dispatchEvent(event);
    }
    if (localStorage.getItem('hideWelcome') === 'true') {
        welcomeSection.classList.add('hidden');
    }
});

// Function open modal form
const openModalForm = () => {
    const currentDate = new Date();
    let dateString = currentDate.toISOString().substring(0, 10);
    const timeString = currentDate.toTimeString().substring(0, 5);

    modalForm.classList.remove('hidden');
    clearForm();
    btnAddNewItem.textContent = 'Add Todo';
    btnAddNewItem.removeEventListener('click', updateItem);
    btnAddNewItem.addEventListener('click', addItem, {once: true});
    document.querySelector('#date').value = dateString;
    document.querySelector('#time').value = timeString;
    document.querySelector('#priority').value = 'high';
    document.querySelector('#description').focus();
}

// Event listener for opening the modal
btnOpenModal.addEventListener('click', openModalForm);

// Event listener for start-now button
btnStartNow.addEventListener('click', openModalForm);

// Event listener for closing the modal
btnCloseModal.addEventListener('click', () => {
    modalForm.classList.add('hidden');
    btnAddNewItem.textContent = 'Add Todo';
    btnAddNewItem.removeEventListener('click', updateItem);
    btnAddNewItem.addEventListener('click', addItem, {once: true});
})

// Event listener for form submission
const todoForm = document.querySelector('.todo-form');
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (btnAddNewItem.textContent === 'Add Todo') {
        addItem(e);
    } else {
        updateItem(e);
    }
});

// Event listener for search input
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredItems = listItems.filter(item => item.description.toLowerCase().includes(searchTerm));
    displayItems(filteredItems);
});

// Event listener for sort menu
sortByMenu.addEventListener('change', (e) => {
    const sortValue = e.target.value;
    let sortedItems;
    if (sortValue === 'date') {
        sortedItems = [...listItems].sort((a, b) => {
            const dateA = new Date(a.date.split('-').join(','));
            const dateB = new Date(b.date.split('-').join(','));
            return dateB - dateA;
        });
    } else if (sortValue === 'priority') {
        sortedItems = [...listItems].sort((a, b) => {
            const priorityValues = {
                'high': 3,
                'medium': 2,
                'low': 1
            };
            return priorityValues[b.priority.toLowerCase()] - priorityValues[a.priority.toLowerCase()];
        });
    } else if (sortValue === 'time') {
        sortedItems = [...listItems].sort((a, b) => {
            return b.time.localeCompare(a.time);
        });
    }
    displayItems(sortedItems);

    // Save the selected sort option in the localStorage
    localStorage.setItem('selectedSort', sortValue);
});

// Event listener for Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modalForm.classList.add('hidden');
    }
});

document.addEventListener('click', (e) => {
    if (e.target === modalForm) {
        modalForm.classList.add('hidden');
    }
});