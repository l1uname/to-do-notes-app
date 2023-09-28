import firstCharToUpperCase from "../utils/first-char-upper-case.js";

export default function displayItemsDiv(item, index) {
    const divDisplayItems = document.createElement('div');
    divDisplayItems.className = 'todo-item';
    divDisplayItems.innerHTML = `
            <div class="todo-number">#${index + 1}</div>
            <div class="todo-time-date">${item.time} ${item.date.split('-').reverse().join('/')}</div>
            <div class="todo-priority">${firstCharToUpperCase(item.priority)}</div>
            <div class="todo-description">${item.description}</div>
            <div class="todo-actions">
                <button class="todo-edit" data-index="${index}">Edit</button>
                <button class="todo-done">Done</button>
            </div>
        `;
    return divDisplayItems;
};