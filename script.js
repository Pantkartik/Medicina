document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const loginSection = document.getElementById("login-section");
    const mainContent = document.getElementById("main-content");
    const symptomCheckerSection = document.getElementById("symptom-checker");
    const symptomCheckerButton = document.getElementById("symptom-checker-btn");
    const checkSymptomsButton = document.getElementById("check-symptoms");
    const symptomList = document.getElementById("symptom-list");
    const resultContainer = document.getElementById("result-container");
    const diseaseChartCanvas = document.getElementById("diseaseChart");

    const symptoms = ["Fever", "Cough", "Fatigue", "Headache", "Shortness of breath"];

    // Disease-Symptom Mapping
    const diseaseData = {
        "Common Cold": ["Cough", "Fatigue"],
        "Flu": ["Fever", "Cough", "Fatigue"],
        "COVID-19": ["Fever", "Cough", "Shortness of breath"],
        "Allergies": ["Cough", "Headache"]
    };

    // Populate symptom list dynamically
    symptoms.forEach(symptom => {
        const label = document.createElement("label");
        label.classList.add("symptom-label");
        label.innerHTML = `<input type="checkbox" value="${symptom}"> ${symptom}`;
        symptomList.appendChild(label);
    });

    // Login Functionality
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        console.log("Username:", username); // Debugging statement
        console.log("Password:", password); // Debugging statement

        if (username === "KARTIKPANT" && password === "12345678") {
            loginSection.classList.add("hidden");
            mainContent.classList.remove("hidden");
        } else {
            alert("Invalid username or password.");
        }
    });

    // Show Symptom Checker Section
    symptomCheckerButton.addEventListener("click", function () {
        symptomCheckerSection.classList.remove("hidden");
    });

    // Check Symptoms Functionality
    checkSymptomsButton.addEventListener("click", function () {
        const selectedSymptoms = Array.from(symptomList.querySelectorAll("input:checked"))
            .map(input => input.value);

        if (selectedSymptoms.length === 0) {
            alert("Please select at least one symptom.");
            return;
        }

        // Calculate likelihood dynamically
        const diseaseLikelihood = {};
        Object.keys(diseaseData).forEach(disease => {
            const matchingSymptoms = diseaseData[disease].filter(symptom => selectedSymptoms.includes(symptom)).length;
            const totalSymptoms = diseaseData[disease].length;
            diseaseLikelihood[disease] = Math.round((matchingSymptoms / totalSymptoms) * 100);
        });

        displayChart(diseaseLikelihood);
        displayResult(selectedSymptoms, diseaseLikelihood);
    });

    function displayChart(diseaseLikelihood) {
        const ctx = diseaseChartCanvas.getContext("2d");

        // Destroy previous chart instance (if exists)
        if (window.diseaseChart) {
            window.diseaseChart.destroy();
        }

        // Create new chart
        window.diseaseChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: Object.keys(diseaseLikelihood),
                datasets: [{
                    label: "Likelihood (%)",
                    data: Object.values(diseaseLikelihood),
                    backgroundColor: ["#4a90e2", "#50c878", "#ffcc00", "#ff6347"],
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                animation: {
                    duration: 1000,
                    easing: 'easeOutBounce'
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    function displayResult(selectedSymptoms, diseaseLikelihood) {
        resultContainer.innerHTML = ""; // Clear previous results

        const resultTitle = document.createElement("h3");
        resultTitle.textContent = "Analysis Result:";
        resultTitle.classList.add("result-title");

        const selectedSymptomsText = document.createElement("p");
        selectedSymptomsText.textContent = `Selected Symptoms: ${selectedSymptoms.join(", ")}`;

        const likelyDisease = Object.keys(diseaseLikelihood).reduce((a, b) => diseaseLikelihood[a] > diseaseLikelihood[b] ? a : b);
        const likelyDiseaseText = document.createElement("p");
        likelyDiseaseText.innerHTML = `<strong>Most likely condition:</strong> ${likelyDisease} (${diseaseLikelihood[likelyDisease]}%)`;

        resultContainer.appendChild(resultTitle);
        resultContainer.appendChild(selectedSymptomsText);
        resultContainer.appendChild(likelyDiseaseText);

        // Add animation effect
        resultContainer.classList.add("fade-in");
    }
});
