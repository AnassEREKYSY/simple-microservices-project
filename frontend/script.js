document.getElementById('fetchDataBtn').addEventListener('click', () => {
    fetch('http://localhost:3000/api/data')  // Assuming your backend will run on port 3000
        .then(response => response.json())
        .then(data => {
            document.getElementById('data').innerText = JSON.stringify(data);
        })
        .catch(error => console.error('Error fetching data:', error));
});
