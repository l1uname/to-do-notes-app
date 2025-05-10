import clearForm from "./utils/clear-form.js";
import displayDescriptionDiv from "./components/displayDescriptionDiv.js"
import displayItemsDiv from "./components/displayItemsDiv.js";

// Select and create DOM elements
const btnOpenModal = document.querySelector('.btn-cta');
const btnCloseModal = document.querySelector('.btn-close-form')
const btnAddNewItem = document.querySelector('.btn-add-todo-item')
const modalForm = document.querySelector('.modal');
const searchInput = document.querySelector('.search-input');
const dropdown = document.querySelector('.dropdown');
const toggle = dropdown.querySelector('.dropdown-toggle');
const menu = dropdown.querySelector('.dropdown-menu');
const options = dropdown.querySelectorAll('.dropdown-menu li');
const btnStartNow = document.querySelector('.btn-start-now');
const welcomeSection = document.querySelector('.welcome-section')
const sectionDisplayItems = document.querySelector('.todo-items');
const clearItems = () => document.querySelector('.todo-items').innerHTML = '';
const getDisplayDescription = () => document.querySelector('.todo-item-description');
const searchButton = document.querySelector('.search-button');
const dateInput = document.querySelectorAll('.date-item');

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
                            divDisplayItemsElement.remove();

                            // If there are no more items, remove the Description div and display the welcome message
                            if (listItems.length === 0) {
                                const displayDescriptionElement = getDisplayDescription();
                                if (displayDescriptionElement) {
                                    displayDescriptionElement.remove();
                                }
                                welcomeSection.classList.remove('hidden');
                            }
                        }
                    }, 1200);
                }, 300);

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
        dropdown.value = selectedSort;
        const event = new Event('change');
        dropdown.dispatchEvent(event);
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
dropdown.addEventListener('change', (e) => {
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

// Search button ripple effect
searchButton.addEventListener('click', function (e) {
    const circle = document.createElement('span');
    circle.classList.add('ripple');

    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = `${size}px`;

    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    this.appendChild(circle);

    circle.addEventListener('animationend', () => {
        circle.remove();
    });
});

let currentIndex = -1;

// Toggle dropdown with mouse
toggle.addEventListener('click', () => {
    const isOpen = dropdown.classList.toggle('open');
    menu.style.display = isOpen ? 'block' : 'none';

    if (isOpen && options.length > 0) {
        currentIndex = 0;
        options[currentIndex].focus();
    }
});

// Toggle dropdown with keyboard
toggle.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        const isOpen = dropdown.classList.toggle('open');
        menu.style.display = isOpen ? 'block' : 'none';

        if (isOpen && options.length > 0) {
            currentIndex = 0;
            options[currentIndex].focus();
        }
    }
});

options.forEach((option, index) => {
    option.addEventListener('click', () => {
        toggle.textContent = option.textContent;
        toggle.dataset.value = option.dataset.value;
        menu.style.display = 'none';
        dropdown.classList.remove('open');
        toggle.focus();
    });

    option.addEventListener('keydown', (e) => {
        e.preventDefault();

        switch (e.key) {
            case 'ArrowDown':
                currentIndex = (index + 1) % options.length;
                options[currentIndex].focus();
                break;
            case 'ArrowUp':
                currentIndex = (index - 1 + options.length) % options.length;
                options[currentIndex].focus();
                break;
            case 'Enter':
                toggle.textContent = option.textContent;
                toggle.dataset.value = option.dataset.value;
                menu.style.display = 'none';
                dropdown.classList.remove('open');
                toggle.focus();
                break;
            case 'Escape':
                menu.style.display = 'none';
                dropdown.classList.remove('open');
                toggle.focus();
                break;
            default:
                e.preventDefault();
        }
    });
});

// Close when clicking outside
document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
        menu.style.display = 'none';
        dropdown.classList.remove('open');
    }
});

dateInput.forEach((input) => {
    input.addEventListener('click', function() {
        this.showPicker();
    });
})
