const symptomData = require('../data/symptoms.json');

const analyzeSymptoms = (userSymptoms) => {
    const inputSymptoms = userSymptoms.map(s => s.toLowerCase().trim());

    let possibleConditions = [];
    let doctorRecommendations = new Set();
    let suggestedMedicines = new Set();
    let isEmergency = false;

    inputSymptoms.forEach(input => {
        const match = symptomData.find(data => input.includes(data.symptom));

        if (match) {
            // Add specialization
            doctorRecommendations.add(match.specialization);

            // Add medicines
            match.common_medicines.forEach(med => suggestedMedicines.add(med));

            // Check emergency
            if (match.emergency) {
                isEmergency = true;
            }

            // Simple condition mapping (In real app, this would be more complex/ML)
            possibleConditions.push({
                name: `Possible issue related to ${match.symptom}`,
                probability: 'Medium'
            });
        }
    });

    // Fallback if no specific match
    if (possibleConditions.length === 0) {
        doctorRecommendations.add("General Physician");
        possibleConditions.push({
            name: "Unidentified general symptoms",
            probability: "Low"
        });
    }

    // Force emergency override if key terms present
    const emergencyKeywords = ['chest pain', 'heart attack', 'unconscious', 'breathing', 'stroke'];
    if (inputSymptoms.some(s => emergencyKeywords.some(k => s.includes(k)))) {
        isEmergency = true;
    }

    return {
        conditions: possibleConditions,
        recommendedDoctor: Array.from(doctorRecommendations).join(', '),
        suggestedMedicine: Array.from(suggestedMedicines),
        emergencyWarning: isEmergency
    };
};

module.exports = { analyzeSymptoms };
