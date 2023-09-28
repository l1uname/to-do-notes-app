export default function displayDescriptionDiv() {
    const divDisplayDescription = document.createElement('div');
    divDisplayDescription.className = 'todo-item-description';
    divDisplayDescription.innerHTML = `
        <div>Num:</div>
        <div>Time:</div>
        <div>Priority:</div>
        <div>Description:</div>
        <div>Actions</div>
    `;
    return divDisplayDescription;
}