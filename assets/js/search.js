// search.js

document.addEventListener('DOMContentLoaded', function() {
    let drugs = [];
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const sediaanFilter = document.getElementById('sediaan-filter');
    const kelasFilter = document.getElementById('kelas-terapi-filter');
    const resultsContainer = document.getElementById('results-container');

    // Only fetch YAML and set up search if we're on the search page
    if (searchForm && searchInput && sediaanFilter && kelasFilter && resultsContainer) {
        // Fetch and process the YAML data
        fetch('/medi-search/data/drugs.yml')
            .then(response => response.text())
            .then(data => {
                drugs = jsyaml.load(data);  // You'll need to include js-yaml library
                populateFilters(drugs);
            })
            .catch(error => console.error('Error loading YAML:', error));

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
            const drugName = (drug['Nama Obat'] || '').toLowerCase();
            const drugNameWords = drugName.split(/\s+/);
            const nameMatch = searchTerm === '' || drugNameWords.some(word => word.includes(searchTerm));
            const sediaanMatch = selectedSediaan === '' || drug['Sediaan'] === selectedSediaan;
            const kelasMatch = selectedKelas === '' || drug['Kelas Terapi'] === selectedKelas;
            
            return nameMatch && sediaanMatch && kelasMatch;
        });
    
        displayResults(results);
    }

    function populateFilters(drugs) {
        const sediaanSet = new Set(drugs.map(drug => drug['Sediaan']).filter(Boolean));
        const kelasSet = new Set(drugs.map(drug => drug['Kelas Terapi']).filter(Boolean));

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
                <h3><a href="#" class="drug-title" data-index="${index}">${drug['Nama Obat'].toLowerCase()}</a></h3>
                <p><strong>Kelas Terapi:</strong> ${drug['Kelas Terapi'].toLowerCase()}</p>
                <p><strong>Sub Kelas Terapi 1:</strong> ${drug['Sub Kelas Terapi 1'].toLowerCase()}</p>
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
        for (let [key, value] of Object.entries(drug)) {
            params.append(key, value || '');
        }
        
        // Navigate to the drug details page with the encoded data
        window.location.href = `/medi-search/medicine-details/?${params.toString()}`;
    }
});