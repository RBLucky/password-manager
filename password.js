"use strict";

document.addEventListener('DOMContentLoaded', loadStoredCards); // Load cards on page load

function convertToJSON() {
    let form = document.getElementById("dataForm");
    let formData = {};

    for (let i = 0; i < form.elements.length - 1; ++i) {
        let element = form.elements[i];
        if (element.type !== "submit") {
            formData[element.name] = element.value;
        }
    }

    let jsonData = JSON.stringify(formData);

    // Store the data in localStorage with a unique key
    const storageKey = `password-${Date.now()}`;
    localStorage.setItem(storageKey, jsonData);

    // Add the new card to the UI
    addCard(formData, storageKey);

    form.reset(); // Clear the form
    updateNoPasswordsMessage(); // Update the message visibility
}

function loadStoredCards() {
    let cards = document.getElementById('section');

    // Clear any existing content
    cards.innerHTML = '';

    if (localStorage.length === 0) {
        updateNoPasswordsMessage();
    } else {
        for (let i = 0; i < localStorage.length; ++i) {
            if (localStorage.key(i).startsWith('password-')) {
                let jsonData = JSON.parse(localStorage.getItem(localStorage.key(i)));
                addCard(jsonData, localStorage.key(i));
            }
        }
    }

    updateNoPasswordsMessage();
}

function addCard(data, key) {
    let cards = document.getElementById('section');

    let card = document.createElement('div');
    card.classList.add('card', 'mb-3');
    card.setAttribute('data-key', key);

    let cardHeader = document.createElement('h5');
    cardHeader.classList.add('card-header');
    cardHeader.innerHTML = data.name;

    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    let cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.innerHTML = `${data.name} Details`;

    let cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.innerHTML = `These are your stored password details for ${data.name}.`;

    let passwordParagraph = document.createElement('p');
    passwordParagraph.classList.add('card-text', 'password-text');
    passwordParagraph.style.display = 'none'; // Hidden by default

    let btnToggle = document.createElement('button');
    btnToggle.classList.add('btn', 'btn-outline-primary', 'me-2');
    btnToggle.innerHTML = "Show Password";
    btnToggle.addEventListener('click', function () {
        if (passwordParagraph.style.display === 'none') {
            passwordParagraph.innerHTML = `Password: ${data.password}`;
            passwordParagraph.style.display = 'block';
            btnToggle.innerHTML = "Hide Password";
        } else {
            passwordParagraph.style.display = 'none';
            btnToggle.innerHTML = "Show Password";
        }
    });

    let btnDelete = document.createElement('button');
    btnDelete.classList.add('btn', 'btn-outline-danger');
    btnDelete.innerHTML = "Delete";
    btnDelete.addEventListener('click', function () {
        localStorage.removeItem(key);
        card.remove();
        updateNoPasswordsMessage();
    });

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(passwordParagraph); // Add password paragraph
    cardBody.appendChild(btnToggle); // Add toggle button
    cardBody.appendChild(btnDelete); // Add delete button

    card.appendChild(cardHeader);
    card.appendChild(cardBody);

    cards.appendChild(card);
}

function updateNoPasswordsMessage() {
    let nothing = document.getElementById('nothing');
    let cards = document.getElementById('section');

    // Check if any password items exist in localStorage
    let hasPasswords = false;
    for (let i = 0; i < localStorage.length; ++i) {
        if (localStorage.key(i).startsWith('password-')) {
            hasPasswords = true;
            break;
        }
    }

    if (hasPasswords) {
        nothing.style.display = 'none';
        cards.style.display = 'block';
    } else {
        nothing.style.display = 'block';
        cards.style.display = 'none';
    }
}
