const statusElement = document.getElementById('status');
const sensor1Element = document.getElementById('sensor1');
const sensor2Element = document.getElementById('sensor2');
const sensor3Element = document.getElementById('sensor3');

function updateStatus(message) {
    statusElement.textContent = message;
}

function updateSensorValues(data) {
    sensor1Element.textContent = data.sensor1 !== null ? data.sensor1.toFixed(2) : '-';
    sensor2Element.textContent = data.sensor2 !== null ? data.sensor2.toFixed(2) : '-';
    sensor3Element.textContent = data.sensor3 !== null ? data.sensor3.toFixed(2) : '-';
}

function fetchData() {
    updateStatus('Fetching data...');
    fetch('http://localhost:3000/data')
        .then(response => response.json())
        .then(data => {
            if (data && (data.sensor1 !== null || data.sensor2 !== null || data.sensor3 !== null)) {
                updateStatus('Data received');
                updateSensorValues(data);
            } else {
                updateStatus('No data available');
                updateSensorValues({sensor1: null, sensor2: null, sensor3: null});
            }
        })
        .catch(error => {
            console.error('Error:', error);
            updateStatus('Error fetching data');
        });
}

setInterval(fetchData, 1000);