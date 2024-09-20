---
layout: default
title: Drug Details - MediSearch
permalink: /medicine-details/
---

<div id="drug-details">
    <!-- Drug details will be inserted here by JavaScript -->
</div>

<button id="back-to-search" class="back-button">Back to Search</button>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const drugDetails = document.getElementById('drug-details');
    const backButton = document.getElementById('back-to-search');
    
    if (drugDetails) {
        const urlParams = new URLSearchParams(window.location.search);
        const drug = Object.fromEntries(urlParams);

        drugDetails.innerHTML = `
            <h2>${drug['Nama Obat'] ? drug['Nama Obat'].toLowerCase() : 'Drug Name Not Available'}</h2>
            <p><strong>Kelas Terapi:</strong> ${drug['Kelas Terapi'] ? drug['Kelas Terapi'].toLowerCase() : 'N/A'}</p>
            <p><strong>Sub Kelas Terapi 1:</strong> ${drug['Sub Kelas Terapi 1'] ? drug['Sub Kelas Terapi 1'].toLowerCase() : 'N/A'}</p>
            <p><strong>Sub Kelas Terapi 2:</strong> ${drug['Sub Kelas Terapi 2'] ? drug['Sub Kelas Terapi 2'].toLowerCase() : 'N/A'}</p>
            <p><strong>Sub Kelas Terapi 3:</strong> ${drug['Sub Kelas Terapi 3'] ? drug['Sub Kelas Terapi 3'].toLowerCase() : 'N/A'}</p>
            <p><strong>Kekuatan:</strong> ${drug['Kekuatan'] ? drug['Kekuatan'].toLowerCase() : 'N/A'}</p>
            <p><strong>Satuan:</strong> ${drug['Satuan'] ? drug['Satuan'].toLowerCase() : 'N/A'}</p>
            <p><strong>Sediaan:</strong> ${drug['Sediaan'] ? drug['Sediaan'].toLowerCase() : 'N/A'}</p>
            <p><strong>Komposisi:</strong> ${drug['Komposisi'] ? drug['Komposisi'].toLowerCase() : 'N/A'}</p>
            <p><strong>Tingkat Faskes FPKTP:</strong> ${drug['Tingkat Faskes FPKTP'] ? drug['Tingkat Faskes FPKTP'].toLowerCase() : 'N/A'}</p>
            <p><strong>Tingkat Faskes FPKTL:</strong> ${drug['Tingkat Faskes FPKTL'] ? drug['Tingkat Faskes FPKTL'].toLowerCase() : 'N/A'}</p>
            <p><strong>PP:</strong> ${drug['PP'] ? drug['PP'].toLowerCase() : 'N/A'}</p>
            <p><strong>PRB:</strong> ${drug['PRB'] ? drug['PRB'].toLowerCase() : 'N/A'}</p>
            <p><strong>OEN:</strong> ${drug['OEN'] ? drug['OEN'].toLowerCase() : 'N/A'}</p>
            <p><strong>Program [P]:</strong> ${drug['Program [P]'] ? drug['Program [P]'].toLowerCase() : 'N/A'}</p>
            <p><strong>Kanker [Ca]:</strong> ${drug['Kanker [Ca]'] ? drug['Kanker [Ca]'].toLowerCase() : 'N/A'}</p>
            <p><strong>Restriksi Obat:</strong> ${drug['Restriksi Obat'] ? drug['Restriksi Obat'].toLowerCase() : 'N/A'}</p>
        `;
    }

    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = '{{ site.baseurl }}/';
        });
    }
});
</script>