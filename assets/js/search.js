document.addEventListener('DOMContentLoaded', function() {
    let drugs = [];
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const sediaanFilter = document.getElementById('sediaan-filter');
    const kelasFilter = document.getElementById('kelas-terapi-filter');
    const resultsContainer = document.getElementById('results-container');

    // Fetch and process the CSV data
    fetch('/drug-search/data/drugs.csv')
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

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedSediaan = sediaanFilter.value;
        const selectedKelas = kelasFilter.value;
    
        const results = drugs.filter(drug => {
            // Split the drug name into words for more flexible matching
            const drugNameWords = drug[0].toLowerCase().split(/\s+/);
            
            // Check if any word in the drug name contains the search term
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

        results.forEach(drug => {
            const card = document.createElement('div');
            card.className = 'drug-card';
            card.innerHTML = `
                <h3>${drug[0].toLowerCase()}</h3>
                <p><strong>Kelas Terapi:</strong> ${drug[1].toLowerCase()}</p>
                <p><strong>Sub Kelas Terapi 1:</strong> ${drug[2].toLowerCase()}</p>
                <p><strong>Kekuatan:</strong> ${drug[5].toLowerCase()}</p>
                <p><strong>Satuan:</strong> ${drug[6].toLowerCase()}</p>
                <p><strong>Sediaan:</strong> ${drug[7].toLowerCase()}</p>
                <p><strong>Restriksi Obat:</strong> ${drug[15].toLowerCase()}</p>
            `;
            resultsContainer.appendChild(card);
        });
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
