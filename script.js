let entries = JSON.parse(localStorage.getItem("entries")) || [];

const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const addButton = document.getElementById('addButton');
const entriesList = document.getElementById('entries');
const totalIncome = document.getElementById('totalIncome');
const totalExpenses = document.getElementById('totalExpenses');
const netBalance = document.getElementById('netBalance');
const filterRadios = document.getElementsByName('filter');
const resetButton = document.getElementById('resetButton');

function renderEntries() {
    entriesList.innerHTML = '';
    let totalIncomeValue = 0;
    let totalExpensesValue = 0;

    // Filter entries based on selected radio button
    const filterValue = Array.from(filterRadios).find(r => r.checked)?.value || 'all';
    const filteredEntries = entries.filter(entry => filterValue === 'all' || entry.type === filterValue);

    filteredEntries.forEach(entry => {
        const li = document.createElement('li');
        li.classList.add('flex', 'justify-between', 'p-2', 'border-b', 'my-2');

        li.innerHTML = `
            <span>${entry.description} - $${entry.amount}</span>
            <div>
                <button onclick="editEntry(${entry.id})" class="bg-yellow-500 text-white p-1 mr-2">Edit</button>
                <button onclick="deleteEntry(${entry.id})" class="bg-red-500 text-white p-1">Delete</button>
            </div>
        `;

        entriesList.appendChild(li);

        if (entry.type === 'income') {
            totalIncomeValue += Number(entry.amount);
        } else {
            totalExpensesValue += Number(entry.amount);
        }
    });

    totalIncome.textContent = `Total Income: $${totalIncomeValue}`;
    totalExpenses.textContent = `Total Expenses: $${totalExpensesValue}`;
    netBalance.textContent = `Net Balance: $${totalIncomeValue - totalExpensesValue}`;
}

function addEntry() {
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;

    if (description && amount) {
        const newEntry = {
            id: Date.now(),
            description,
            amount,
            type
        };

        entries.push(newEntry);
        localStorage.setItem("entries", JSON.stringify(entries));
        descriptionInput.value = '';
        amountInput.value = '';
        renderEntries();
    }
}

function deleteEntry(id) {
    entries = entries.filter(entry => entry.id !== id);
    localStorage.setItem("entries", JSON.stringify(entries));
    renderEntries();
}

function editEntry(id) {
    const entry = entries.find(entry => entry.id === id);
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    typeSelect.value = entry.type;

    deleteEntry(id); // Temporarily delete to prevent duplicates on save
}

function resetFields() {
    descriptionInput.value = '';
    amountInput.value = '';
}

addButton.addEventListener('click', addEntry);
filterRadios.forEach(radio => radio.addEventListener('change', renderEntries));
resetButton.addEventListener('click', resetFields);

// Initial render
renderEntries();
