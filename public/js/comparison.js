document.addEventListener('DOMContentLoaded', function() {
    let compareVehicles = [];

    function buildComparisonTable(vehicles) {
        if (vehicles.length === 0) return '<p>Select vehicles to compare</p>';

        const features = [
            { name: 'Year', key: 'inv_year' },
            { name: 'Make', key: 'inv_make' },
            { name: 'Model', key: 'inv_model' },
            { name: 'Price', key: 'inv_price', format: (val) => `$${new Intl.NumberFormat().format(val)}` },
            { name: 'Mileage', key: 'inv_miles', format: (val) => `${new Intl.NumberFormat().format(val)} miles` },
            { name: 'Color', key: 'inv_color' },
            { name: 'Description', key: 'inv_description' }
        ];

        return `
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Features</th>
                        ${vehicles.map(v => `
                            <th class="vehicle-column">
                                ${v.inv_year} ${v.inv_make} ${v.inv_model}
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${features.map(feature => `
                        <tr>
                            <td class="feature-name">${feature.name}</td>
                            ${vehicles.map(vehicle => `
                                <td class="feature-value">
                                    ${feature.format ? 
                                        feature.format(vehicle[feature.key]) : 
                                        vehicle[feature.key]}
                                </td>
                            `).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Define functions in global scope
    window.updateComparisonTable = function() {
        const content = document.getElementById('compareContent');
        content.innerHTML = buildComparisonTable(compareVehicles);
    };

    window.addToCompare = async function(invId) {
        try {
            const response = await fetch('/inv/vehicle/' + invId);
            if (!response.ok) throw new Error('Could not fetch vehicle');
            const data = await response.json();
            
            if (!data || !data.vehicle) {
                throw new Error('No vehicle data received');
            }
            
            compareVehicles = [data.vehicle];
            
            document.getElementById('compareOverlay').style.display = 'block';
            document.getElementById('comparePopup').style.display = 'block';
            
            updateComparisonTable();
            
            // Get and populate dropdown
            const allVehiclesResponse = await fetch('/inv/vehicles');
            const allData = await allVehiclesResponse.json();
            
            const select = document.getElementById('vehicleSelect');
            select.innerHTML = '<option value="">Select a vehicle to compare</option>';
            allData.vehicles
                .filter(v => v.inv_id !== parseInt(invId))
                .forEach(v => {
                    select.innerHTML += `
                        <option value="${v.inv_id}">
                            ${v.inv_year} ${v.inv_make} ${v.inv_model}
                        </option>
                    `;
                });
        } catch (error) {
            console.error('Comparison error:', error);
            alert('Error loading comparison data');
        }
    };

    window.closeComparePopup = function() {
        document.getElementById('compareOverlay').style.display = 'none';
        document.getElementById('comparePopup').style.display = 'none';
        compareVehicles = [];
    };

    // Load initial vehicle if pre-selected
    const firstVehicle = document.getElementById('firstVehicle');
    if (firstVehicle.value) {
        updateFirstVehicle(firstVehicle.value);
    }
});

async function updateFirstVehicle(invId) {
    if (!invId) return;
    const vehicleDetails = await fetchVehicleDetails(invId);
    displayVehicleDetails('firstVehicleDetails', vehicleDetails);
}

async function updateSecondVehicle(invId) {
    if (!invId) return;
    const vehicleDetails = await fetchVehicleDetails(invId);
    displayVehicleDetails('secondVehicleDetails', vehicleDetails);
}

async function fetchVehicleDetails(invId) {
    try {
        const response = await fetch(`/inv/vehicle/${invId}`);
        const data = await response.json();
        return data.vehicle;
    } catch (error) {
        console.error('Error fetching vehicle:', error);
        return null;
    }
}

function displayVehicleDetails(elementId, vehicle) {
    if (!vehicle) return;

    const element = document.getElementById(elementId);
    element.innerHTML = `
        <table>
            <tr>
                <th>Price</th>
                <td>$${new Intl.NumberFormat().format(vehicle.inv_price)}</td>
            </tr>
            <tr>
                <th>Year</th>
                <td>${vehicle.inv_year}</td>
            </tr>
            <tr>
                <th>Make</th>
                <td>${vehicle.inv_make}</td>
            </tr>
            <tr>
                <th>Model</th>
                <td>${vehicle.inv_model}</td>
            </tr>
            <tr>
                <th>Mileage</th>
                <td>${new Intl.NumberFormat().format(vehicle.inv_miles)} miles</td>
            </tr>
            <tr>
                <th>Color</th>
                <td>${vehicle.inv_color}</td>
            </tr>
            <tr>
                <th>Description</th>
                <td>${vehicle.inv_description}</td>
            </tr>
        </table>
    `;
}