document.addEventListener("DOMContentLoaded", function () {
    const symptomCheckerSection = document.getElementById("symptom-checker");
    const symptomCheckerButton = document.getElementById("symptom-checker-btn");
    const checkSymptomsButton = document.getElementById("check-symptoms");
    const symptomList = document.getElementById("symptom-list");
    const questionContainer = document.getElementById("question-container");
    const resultContainer = document.getElementById("result-container");
    const diseaseChartCanvas = document.getElementById("diseaseChart");

    const symptoms = [
        "Fever", "Cough", "Fatigue", "Headache", "Shortness of breath", "Sore throat", "Runny nose",
        "Muscle aches", "Chills", "Loss of taste or smell", "Nausea", "Vomiting", "Diarrhea",
        "Abdominal pain", "Rash", "Itchy eyes", "Chest pain", "Dizziness", "Joint pain", "Swollen lymph nodes",
        "Wheezing", "Sneezing", "Night sweats", "Weight loss", "Blurred vision", "Earache", "Back pain",
        "Bloody stool", "Bloody urine", "Difficulty swallowing", "Hives", "Swelling", "Yellowing of skin or eyes",
        "Dark urine", "Light-colored stools", "Seizures", "Confusion", "Memory loss", "Tingling or numbness",
        "Weakness", "Paralysis", "Hallucinations", "Mood swings", "Anxiety", "Depression", "Insomnia",
        "Excessive sleepiness", "Hair loss", "Brittle nails", "Dry skin", "Easy bruising", "Bleeding gums",
        "Swollen tongue", "Enlarged spleen", "Enlarged liver", "Heart palpitations", "High blood pressure",
        "Low blood pressure", "Rapid heart rate", "Slow heart rate", "Irregular heartbeat"
    ];

    // Disease-Symptom Mapping
    const diseaseData = {
        "Common Cold": ["Cough", "Fatigue", "Sore throat", "Runny nose", "Sneezing"],
        "Flu": ["Fever", "Cough", "Fatigue", "Muscle aches", "Chills"],
        "COVID-19": ["Fever", "Cough", "Shortness of breath", "Loss of taste or smell", "Fatigue"],
        "Allergies": ["Cough", "Headache", "Itchy eyes", "Rash", "Sneezing"],
        "Asthma": ["Shortness of breath", "Wheezing", "Chest pain", "Cough"],
        "Bronchitis": ["Cough", "Fatigue", "Shortness of breath", "Chest pain"],
        "Pneumonia": ["Fever", "Cough", "Shortness of breath", "Chest pain", "Fatigue"],
        "Stomach Flu": ["Nausea", "Vomiting", "Diarrhea", "Abdominal pain", "Fatigue"],
        "Food Poisoning": ["Nausea", "Vomiting", "Diarrhea", "Abdominal pain", "Fever"],
        "Appendicitis": ["Abdominal pain", "Nausea", "Vomiting", "Fever", "Loss of appetite"]
    };

    // Additional Questions for Each Disease
    const additionalQuestions = {
        "Common Cold": [
            { question: "Do you have a runny nose?", options: ["Yes", "No", "Sometimes"] },
            { question: "Do you have a sore throat?", options: ["Yes", "No", "Sometimes"] }
        ],
        "Flu": [
            { question: "Do you have muscle aches?", options: ["Yes", "No", "Sometimes"] },
            { question: "Do you have chills?", options: ["Yes", "No", "Sometimes"] }
        ],
        "COVID-19": [
            { question: "Have you lost your sense of taste or smell?", options: ["Yes", "No", "Sometimes"] },
            { question: "Do you have body aches?", options: ["Yes", "No", "Sometimes"] }
        ],
        "Allergies": [
            { question: "Do you have itchy eyes?", options: ["Yes", "No", "Sometimes"] },
            { question: "Do you have a rash?", options: ["Yes", "No", "Sometimes"] }
        ],
        "Asthma": [
            { question: "Do you have wheezing?", options: ["Yes", "No", "Sometimes"] },
            { question: "Do you have chest pain?", options: ["Yes", "No", "Sometimes"] }
        ],
        "Bronchitis": [
            { question: "Do you have chest pain?", options: ["Yes", "No", "Sometimes"] },
            { question: "Do you have shortness of breath?", options: ["Yes", "No", "Sometimes"] }
        ],
        "Pneumonia": [
            { question: "Do you have chest pain?", options: ["Yes", "No", "Sometimes"] },
            { question: "Do you have shortness of breath?", options: ["Yes", "No", "Sometimes"] }
        ],
        "Stomach Flu": [
            { question: "Do you have abdominal pain?", options: ["Yes", "No", "Sometimes"] },
            { question: "Do you have fatigue?", options: ["Yes", "No", "Sometimes"] }
        ],
        "Food Poisoning": [
            { question: "Do you have abdominal pain?", options: ["Yes", "No", "Sometimes"] },
            { question: "Do you have fever?", options: ["Yes", "No", "Sometimes"] }
        ],
        "Appendicitis": [
            { question: "Do you have loss of appetite?", options: ["Yes", "No", "Sometimes"] },
            { question: "Do you have nausea?", options: ["Yes", "No", "Sometimes"] }
        ]
    };

    // Populate symptom list dynamically
    symptoms.forEach(symptom => {
        const label = document.createElement("label");
        label.classList.add("symptom-label");
        label.innerHTML = `<input type="checkbox" value="${symptom}"> ${symptom}`;
        symptomList.appendChild(label);
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

        // Ask additional questions based on the most likely disease
        const likelyDisease = Object.keys(diseaseLikelihood).reduce((a, b) => diseaseLikelihood[a] > diseaseLikelihood[b] ? a : b);
        askAdditionalQuestions(likelyDisease, diseaseLikelihood, selectedSymptoms);
    });

    function askAdditionalQuestions(likelyDisease, diseaseLikelihood, selectedSymptoms) {
        const questions = additionalQuestions[likelyDisease];
        let additionalPoints = 0;
        questionContainer.innerHTML = ""; // Clear previous questions

        questions.forEach((questionObj, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("question");
            questionDiv.innerHTML = `
                <label>${questionObj.question}</label>
                ${questionObj.options.map(option => `<label><input type="radio" name="question${index}" value="${option}"> ${option}</label>`).join('')}
            `;
            questionContainer.appendChild(questionDiv);
        });

        questionContainer.classList.remove("hidden");

        const analyzeButton = document.createElement("button");
        analyzeButton.textContent = "Analyze";
        analyzeButton.classList.add("login-button");
        questionContainer.appendChild(analyzeButton);

        analyzeButton.addEventListener("click", function () {
            questions.forEach((questionObj, index) => {
                const answer = document.querySelector(`input[name="question${index}"]:checked`);
                if (answer) {
                    if (answer.value === "Yes") {
                        additionalPoints += 10; // Add points for each positive answer
                    } else if (answer.value === "Sometimes") {
                        additionalPoints += 5; // Add points for each "Sometimes" answer
                    }
                }
            });

            // Update likelihood based on additional questions
            diseaseLikelihood[likelyDisease] += additionalPoints;

            displayChart(diseaseLikelihood);
            displayResult(selectedSymptoms, diseaseLikelihood);
            questionContainer.classList.add("hidden");
        });
    }

    function displayChart(diseaseLikelihood) {
        const ctx = diseaseChartCanvas.getContext("2d");

        // Destroy previous chart instance (if exists)
        if (window.diseaseChart) {
            window.diseaseChart.destroy();
        }

        // Create new chart
        window.diseaseChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: Object.keys(diseaseLikelihood),
                datasets: [{
                    label: "Likelihood (%)",
                    data: Object.values(diseaseLikelihood),
                    backgroundColor: ["#4a90e2", "#50c878", "#ffcc00", "#ff6347", "#9966ff", "#ff6384", "#36a2eb", "#ffcd56", "#ff6384", "#4bc0c0"],
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                animation: {
                    duration: 1000,
                    easing: 'easeOutBounce'
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

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    // Login Functionality
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        console.log("Username:", username); // Debugging statement
        console.log("Password:", password); // Debugging statement

        if (username === "kartik" && password === "1234") {
            window.open("main.html", "_blank");
        } else {
            alert("Invalid username or password.");
        }
    });
});
