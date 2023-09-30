import firstCharToUpperCase from "../utils/first-char-upper-case.js";

export default function displayItemsDiv(item, index) {
    const divDisplayItems = document.createElement('div');
    divDisplayItems.className = 'todo-item';

    let formattedDate = '';
    if (item.date) {
        let dateParts = item.date.split('-');
        formattedDate = `${dateParts[2]}/${dateParts[1]} ${dateParts[0]}`;
    }

    divDisplayItems.innerHTML = `
            <div class="todo-number">#${index + 1}</div>
            <div class="todo-time-date">${item.time} ${formattedDate}</div>
            <div class="todo-priority">${firstCharToUpperCase(item.priority)}</div>
            <div class="todo-description">${item.description}</div>
            <div class="todo-actions">
                <button class="todo-edit" data-index="${index}">Edit</button>
                <button class="todo-done">Done</button>
            </div>
        `;
    return divDisplayItems;
};