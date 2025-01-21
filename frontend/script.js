// Handle form submission for creating a user
document.getElementById('createUserForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
    })
    .then(response => response.json())
    .then(data => {
        alert('User created successfully!');
        document.getElementById('name').value = '';  // Clear the form fields
        document.getElementById('email').value = '';
    })
    .catch(error => console.error('Error creating user:', error));
});

// Fetch and display all users when the button is clicked
document.getElementById('fetchUsersBtn').addEventListener('click', () => {
    fetch('http://localhost:3000/api/users')
        .then(response => response.json())
        .then(users => {
            const usersListDiv = document.getElementById('usersList');
            usersListDiv.innerHTML = ''; // Clear any previous users

            if (users.length === 0) {
                usersListDiv.innerHTML = '<p>No users found.</p>';
            } else {
                const table = document.createElement('table');
                const headerRow = document.createElement('tr');
                const nameHeader = document.createElement('th');
                nameHeader.textContent = 'Name';
                const emailHeader = document.createElement('th');
                emailHeader.textContent = 'Email';
                headerRow.appendChild(nameHeader);
                headerRow.appendChild(emailHeader);
                table.appendChild(headerRow);

                users.forEach(user => {
                    const row = document.createElement('tr');
                    const nameCell = document.createElement('td');
                    nameCell.textContent = user.name;
                    const emailCell = document.createElement('td');
                    emailCell.textContent = user.email;
                    row.appendChild(nameCell);
                    row.appendChild(emailCell);
                    table.appendChild(row);
                });

                usersListDiv.appendChild(table);
            }
        })
        .catch(error => console.error('Error fetching users:', error));
});
