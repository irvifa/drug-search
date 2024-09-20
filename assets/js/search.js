// search.js

document.addEventListener('DOMContentLoaded', function() {
    let drugs = [];
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const sediaanFilter = document.getElementById('sediaan-filter');
    const kelasFilter = document.getElementById('kelas-terapi-filter');
    const resultsContainer = document.getElementById('results-container');

    // Only fetch CSV and set up search if we're on the search page
    if (searchForm && searchInput && sediaanFilter && kelasFilter && resultsContainer) {
        // Fetch and process the CSV data
        fetch('/medi-search/data/drugs.csv')
            .then(response => response.text())
            .then(data => {
                drugs = CSVToArray(data);
                const headers = drugs[0];
                drugs = drugs.slice(1);  // Remove header row
                populateFilters(drugs);
            })
            .catch(error => console.error('Error loading CSV:', error));

        // Event listener for form submission
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch();
        });
    }

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedSediaan = sediaanFilter.value;
        const selectedKelas = kelasFilter.value;
    
        const results = drugs.filter(drug => {
            const drugNameWords = drug[0].toLowerCase().split(/\s+/);
            const nameMatch = searchTerm === '' || drugNameWords.some(word => word.includes(searchTerm));
            const sediaanMatch = selectedSediaan === '' || drug[7] === selectedSediaan;
            const kelasMatch = selectedKelas === '' || drug[1] === selectedKelas;
            
            return nameMatch && sediaanMatch && kelasMatch;
        });
    
        displayResults(results);
    }

    function populateFilters(drugs) {
        const sediaanSet = new Set(drugs.map(drug => drug[7]));
        const kelasSet = new Set(drugs.map(drug => drug[1]));

        populateFilter(sediaanFilter, sediaanSet);
        populateFilter(kelasFilter, kelasSet);
    }

    function populateFilter(selectElement, optionsSet) {
        optionsSet.forEach(option => {
            if (option) {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                selectElement.appendChild(optionElement);
            }
        });
    }

    function displayResults(results) {
        resultsContainer.innerHTML = '';
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            return;
        }

        results.forEach((drug, index) => {
            const card = document.createElement('div');
            card.className = 'drug-card';
            card.innerHTML = `
                <h3><a href="#" class="drug-title" data-index="${index}">${drug[0].toLowerCase()}</a></h3>
                <p><strong>Kelas Terapi:</strong> ${drug[1].toLowerCase()}</p>
                <p><strong>Sub Kelas Terapi 1:</strong> ${drug[2].toLowerCase()}</p>
            `;
            resultsContainer.appendChild(card);
        });

        // Add click event listeners to drug titles
        document.querySelectorAll('.drug-title').forEach(title => {
            title.addEventListener('click', function(e) {
                e.preventDefault();
                const index = this.getAttribute('data-index');
                navigateToDrugDetails(results[index]);
            });
        });
    }

    function navigateToDrugDetails(drug) {
        // Encode drug data as URL parameters
        const params = new URLSearchParams();
        drug.forEach((value, index) => {
            params.append(`param${index}`, value);
        });
        
        // Navigate to the drug details page with the encoded data
        window.location.href = `/medi-search/medicine-details?${params.toString()}`;
    }

    // Function to parse CSV
    function CSVToArray(strData, strDelimiter = ',') {
        const objPattern = new RegExp(
            ("(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
             "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
             "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi"
        );
        let arrData = [[]];
        let arrMatches = null;
        while (arrMatches = objPattern.exec(strData)) {
            const strMatchedDelimiter = arrMatches[1];
            if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
                arrData.push([]);
            }
            let strMatchedValue;
            if (arrMatches[2]) {
                strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
            } else {
                strMatchedValue = arrMatches[3];
            }
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        return arrData;
    }
});

// Function to load drug details (called on the drug details page)
function loadMedicineDetails() {
    const drugDetails = document.getElementById('medicine-details');
    const backButton = document.getElementById('back-to-search');
    if (!drugDetails || !backButton) return; // Exit if not on the drug details page

    const urlParams = new URLSearchParams(window.location.search);
    const drugData = [];
    for (let i = 0; i < 16; i++) {
        drugData.push(urlParams.get(`param${i}`));
    }

    drugDetails.innerHTML = `
        <h2>${drugData[0] ? drugData[0].toLowerCase() : 'Drug Name Not Available'}</h2>
        <p><strong>Kelas Terapi:</strong> ${drugData[1] ? drugData[1].toLowerCase() : 'N/A'}</p>
        <p><strong>Sub Kelas Terapi 1:</strong> ${drugData[2] ? drugData[2].toLowerCase() : 'N/A'}</p>
        <p><strong>Sub Kelas Terapi 2:</strong> ${drugData[3] ? drugData[3].toLowerCase() : 'N/A'}</p>
        <p><strong>Perlu Resep:</strong> ${drugData[4] ? drugData[4].toLowerCase() : 'N/A'}</p>
        <p><strong>Kekuatan:</strong> ${drugData[5] ? drugData[5].toLowerCase() : 'N/A'}</p>
        <p><strong>Satuan:</strong> ${drugData[6] ? drugData[6].toLowerCase() : 'N/A'}</p>
        <p><strong>Sediaan:</strong> ${drugData[7] ? drugData[7].toLowerCase() : 'N/A'}</p>
        <p><strong>Restriksi Obat:</strong> ${drugData[15] ? drugData[15].toLowerCase() : 'N/A'}</p>
    `;

    // Add event listener to the back button
    backButton.addEventListener('click', function() {
        window.location.href = '/medi-search/';
    });
}

// Call loadMedicineDetails when the DOM is loaded
document.addEventListener('DOMContentLoaded', loadMedicineDetails);