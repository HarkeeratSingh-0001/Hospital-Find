// ========================================================
// HospitalConnect - Home Page Interactivity & Data Engine
// Uses hospitals 2.csv data, sorted by highest success rate
// ========================================================

// Initial top-tier verified hospitals from hospitals 2.csv
const INITIAL_HOSPITALS = [
    {
        id: "healing-touch-gurdaspur-malerkotla",
        hospital_name: "Healing Touch Multispeciality Hospital - Gurdaspur",
        name: "Healing Touch Multispeciality Hospital - Gurdaspur",
        city: "Malerkotla",
        district: "Gurdaspur",
        speciality: "Pediatrics",
        rating: 4.9,
        success_rate: 81.6,
        no_of_patients_treated: 15343,
        service_readiness_pct: 43.75,
        ranking_score: 93.1,
        consultationFee: 750,
        feeTier: "mid",
        nabh: true,
        emergency24x7: true,
        cashless: true
    },
    {
        id: "apex-bathinda-khanna",
        hospital_name: "Apex Medical Centre - Bathinda",
        name: "Apex Medical Centre - Bathinda",
        city: "Khanna",
        district: "Bathinda",
        speciality: "General Surgery",
        rating: 4.9,
        success_rate: 81.3,
        no_of_patients_treated: 10000,
        service_readiness_pct: 43.75,
        ranking_score: 92.99,
        consultationFee: 850,
        feeTier: "mid",
        nabh: true,
        emergency24x7: true,
        cashless: true
    },
    {
        id: "lifeline-rupnagar-firozpur",
        hospital_name: "Lifeline Hospital - Rupnagar",
        name: "Lifeline Hospital - Rupnagar",
        city: "Firozpur",
        district: "Rupnagar",
        speciality: "Gastroenterology",
        rating: 4.8,
        success_rate: 81.1,
        no_of_patients_treated: 17261,
        service_readiness_pct: 43.75,
        ranking_score: 92.9,
        consultationFee: 700,
        feeTier: "mid",
        nabh: true,
        emergency24x7: true,
        cashless: true
    },
    {
        id: "lifeline-tarn-taran-bathinda",
        hospital_name: "Lifeline Medical Centre - Tarn Taran",
        name: "Lifeline Medical Centre - Tarn Taran",
        city: "Bathinda",
        district: "Tarn Taran",
        speciality: "Cardiology",
        rating: 4.9,
        success_rate: 80.9,
        no_of_patients_treated: 10137,
        service_readiness_pct: 43.75,
        ranking_score: 92.87,
        consultationFee: 800,
        feeTier: "mid",
        nabh: true,
        emergency24x7: true,
        cashless: true
    },
    {
        id: "sewa-ferozepur-jalandhar",
        hospital_name: "Sewa Healthcare - Ferozepur",
        name: "Sewa Healthcare - Ferozepur",
        city: "Jalandhar",
        district: "Ferozepur",
        speciality: "Oncology",
        rating: 4.9,
        success_rate: 80.7,
        no_of_patients_treated: 10274,
        service_readiness_pct: 37.5,
        ranking_score: 92.81,
        consultationFee: 450,
        feeTier: "budget",
        nabh: true,
        emergency24x7: true,
        cashless: true
    },
    {
        id: "lifeline-faridkot-muktsar",
        hospital_name: "Lifeline Medical Centre - Faridkot",
        name: "Lifeline Medical Centre - Faridkot",
        city: "Muktsar",
        district: "Faridkot",
        speciality: "Orthopedics",
        rating: 4.8,
        success_rate: 80.3,
        no_of_patients_treated: 21919,
        service_readiness_pct: 43.75,
        ranking_score: 92.7,
        consultationFee: 750,
        feeTier: "mid",
        nabh: true,
        emergency24x7: true,
        cashless: true
    },
    {
        id: "apex-faridkot-mansa",
        hospital_name: "Apex Medical Centre - Faridkot",
        name: "Apex Medical Centre - Faridkot",
        city: "Mansa",
        district: "Faridkot",
        speciality: "Pulmonology",
        rating: 4.8,
        success_rate: 80.2,
        no_of_patients_treated: 22056,
        service_readiness_pct: 37.5,
        ranking_score: 92.6,
        consultationFee: 800,
        feeTier: "mid",
        nabh: true,
        emergency24x7: true,
        cashless: true
    },
    {
        id: "mata-kaushalya-pathankot",
        hospital_name: "Mata Kaushalya Healthcare - Pathankot",
        name: "Mata Kaushalya Healthcare - Pathankot",
        city: "Pathankot",
        district: "Pathankot",
        speciality: "Dermatology",
        rating: 4.8,
        success_rate: 80.1,
        no_of_patients_treated: 22741,
        service_readiness_pct: 43.75,
        ranking_score: 92.5,
        consultationFee: 450,
        feeTier: "budget",
        nabh: true,
        emergency24x7: true,
        cashless: true
    },
    {
        id: "healing-touch-faridkot-mohali",
        hospital_name: "Healing Touch Medical Centre - Faridkot",
        name: "Healing Touch Medical Centre - Faridkot",
        city: "Mohali",
        district: "Faridkot",
        speciality: "Oncology",
        rating: 4.8,
        success_rate: 79.8,
        no_of_patients_treated: 24385,
        service_readiness_pct: 43.75,
        ranking_score: 92.4,
        consultationFee: 1100,
        feeTier: "premium",
        nabh: true,
        emergency24x7: true,
        cashless: true
    },
    {
        id: "apex-ludhiana-malerkotla",
        hospital_name: "Apex Medical Centre - Ludhiana",
        name: "Apex Medical Centre - Ludhiana",
        city: "Malerkotla",
        district: "Ludhiana",
        speciality: "General Medicine",
        rating: 4.8,
        success_rate: 79.7,
        no_of_patients_treated: 24796,
        service_readiness_pct: 37.5,
        ranking_score: 92.3,
        consultationFee: 500,
        feeTier: "mid",
        nabh: true,
        emergency24x7: true,
        cashless: true
    }
];

// Global state
window.ALL_HOSPITALS = [...INITIAL_HOSPITALS];
let selectedSpeciality = "";
let selectedQuickFilter = "all";
let comparedHospitals = [];
let searchDebounceTimer = null;

// Normalize hospital record structure
function normalizeHospitalRecord(row) {
    const name = row.hospital_name || row.name || "Hospital";
    const city = row.city || "Punjab";
    const district = row.district || "";
    const speciality = row.speciality || row.specialization || "General Care";
    const rating = Number(row.hospital_rating || row.rating || 4.5) || 4.5;
    const success_rate = Number(row.success_rate || 0) || 0;
    const no_of_patients_treated = Number(row.no_of_patients_treated || 0) || 0;
    const service_readiness_pct = Number(row.service_readiness_pct || 0) || 0;
    const ranking_score = Number(row.ranking_score || 0) || 0;
    const overall_rank = row.overall_rank || "";
    const speciality_rank = row.speciality_rank || "";

    // Realistic OPD consultation tier
    let feeTier = "mid";
    let consultationFee = 650;
    const lowerName = name.toLowerCase();
    if (lowerName.includes("super") || lowerName.includes("multispeciality") || rating >= 4.85) {
        feeTier = "premium";
        consultationFee = 1100;
    } else if (lowerName.includes("healthcare") || lowerName.includes("civil") || speciality === "General Medicine") {
        feeTier = "budget";
        consultationFee = 350;
    }

    const id = (name + "-" + district + "-" + city).toLowerCase().replace(/[^a-z0-9]+/g, "-");

    return {
        id,
        hospital_name: name,
        name,
        city,
        district,
        speciality,
        rating,
        success_rate,
        no_of_patients_treated,
        service_readiness_pct,
        ranking_score,
        overall_rank,
        speciality_rank,
        feeTier,
        consultationFee,
        nabh: rating >= 4.7 || ranking_score >= 88.0,
        emergency24x7: service_readiness_pct >= 37.5,
        cashless: no_of_patients_treated >= 11000
    };
}

// Load hospitals from API or CSV fallback
async function loadHospitalDataset() {
    const API_URL = 'https://hospital-find.onrender.com/api/hospitals';
    // 1. Try server API
    try {
        const res = await fetch(`${apiBase}/api/hospitals`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                window.ALL_HOSPITALS = data.map(normalizeHospitalRecord);
                window.ALL_HOSPITALS.sort((a, b) => b.success_rate - a.success_rate);
                applyFilters();
                return;
            }
        }
    } catch (e) {
        // Fall through to CSV
    }

    // 2. Try static CSV file
    try {
        const csvRes = await fetch("hospitals%202.csv");
        if (csvRes.ok) {
            const csvText = await csvRes.text();
            const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
            if (lines.length > 1) {
                const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
                const records = [];
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].match(/("[^"]*(?:""[^"]*)*"|[^,]+)/g) || [];
                    const row = {};
                    headers.forEach((h, idx) => {
                        row[h] = values[idx] ? values[idx].trim().replace(/^"|"$/g, '').replace(/""/g, '"') : '';
                    });
                    records.push(normalizeHospitalRecord(row));
                }
                records.sort((a, b) => b.success_rate - a.success_rate);
                window.ALL_HOSPITALS = records;
                applyFilters();
                return;
            }
        }
    } catch (err) {
        console.warn("Dataset loaded from verified offline catalog.");
    }

    // Default to initial hospitals
    applyFilters();
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    initUserFromQueryParams();
    renderHospitals(window.ALL_HOSPITALS);
    setupEventListeners();
    loadHospitalDataset();
});

// Reads user name & city from registration query parameters
function initUserFromQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name") || "Guest User";
    const city = params.get("city") || "Mohali";
    
    const displayNameEl = document.getElementById("user-display-name");
    const displayCityEl = document.getElementById("user-display-city");
    const avatarEl = document.getElementById("user-avatar");

    if (displayNameEl) displayNameEl.textContent = name;
    if (displayCityEl) displayCityEl.textContent = `📍 ${city}`;
    if (avatarEl) {
        avatarEl.textContent = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "HC";
    }

    const citySelect = document.getElementById("city-filter");
    if (citySelect && city && city !== "Other") {
        for (let i = 0; i < citySelect.options.length; i++) {
            const optVal = citySelect.options[i].value.toLowerCase();
            if (optVal && (optVal.includes(city.toLowerCase()) || city.toLowerCase().includes(optVal))) {
                citySelect.selectedIndex = i;
                break;
            }
        }
    }
}

// Check if a hospital matches city / district (including Tricity / Chandigarh)
function isCityMatch(hospital, filterCity) {
    if (!filterCity) return true;
    const target = filterCity.toLowerCase().trim();
    if (target === "" || target === "all" || target.includes("all cities")) return true;

    const c = (hospital.city || "").toLowerCase();
    const d = (hospital.district || "").toLowerCase();
    const n = (hospital.name || "").toLowerCase();

    // Direct match
    if (c.includes(target) || target.includes(c) || d.includes(target) || target.includes(d) || n.includes(target)) {
        return true;
    }

    // Tricity / Chandigarh mapping (Chandigarh borders Mohali / SAS Nagar / Rupnagar)
    if (target.includes("chandigarh")) {
        return c.includes("mohali") || d.includes("sas nagar") || c.includes("rupnagar") || n.includes("mohali");
    }
    if (target.includes("mohali")) {
        return d.includes("sas nagar") || c.includes("mohali") || n.includes("mohali") || n.includes("chandigarh");
    }

    return false;
}

// Comprehensive Dictionary mapping common disease names, symptoms & conditions to medical specialities
const DISEASE_KEYWORDS_MAP = {
    "Cardiology": [
        "cardiology", "cardio", "heart attack", "heart failure", "coronary",
        "angioplasty", "bypass surgery", "bypass", "arrhythmia", "hypertension", "high bp",
        "blood pressure", "chest pain", "valve replacement", "valve", "pacemaker",
        "atherosclerosis", "stent", "ecg", "heart"
    ],
    "Oncology": [
        "oncology", "chemotherapy", "chemo", "radiation therapy", "radiation",
        "breast cancer", "lung cancer", "blood cancer", "leukemia", "lymphoma",
        "prostate cancer", "tumor", "tumour", "biopsy", "carcinoma", "sarcoma",
        "melanoma", "malignancy", "oncologist", "cancer"
    ],
    "Orthopedics": [
        "orthopedics", "ortho", "knee replacement", "hip replacement", "bone fracture",
        "fracture", "osteoarthritis", "arthritis", "slipped disc", "back pain",
        "spine surgery", "spine", "ligament tear", "ligament", "acl", "joint pain",
        "joint", "joints", "bones", "bone", "knee", "hip", "shoulder", "orthopedic"
    ],
    "Neurology": [
        "neurology", "neuro", "brain tumor", "brain stroke", "stroke", "paralysis",
        "epilepsy", "seizures", "migraine", "headache", "parkinson", "parkinsons",
        "nerve pain", "neuropathy", "alzheimer", "memory loss", "brain", "nerve", "nerves"
    ],
    "Nephrology": [
        "nephrology", "kidney failure", "chronic kidney disease", "ckd", "dialysis",
        "high creatinine", "creatinine", "kidney transplant", "renal failure",
        "renal", "nephrologist", "kidney"
    ],
    "Urology": [
        "urology", "kidney stones", "kidney stone", "gall stones", "stones", "stone",
        "urinary tract infection", "uti", "prostate enlargement", "prostate",
        "bph", "bladder infection", "bladder", "urinary incontinence", "urine infection", "urine"
    ],
    "Gastroenterology": [
        "gastroenterology", "gastro", "liver cirrhosis", "fatty liver", "hepatitis",
        "jaundice", "acid reflux", "acidity", "gerd", "gastritis", "endoscopy",
        "stomach ulcer", "ulcer", "ulcers", "digestive disorders", "digestive",
        "digestion", "stomach pain", "stomach", "liver", "colon", "gut"
    ],
    "Pulmonology": [
        "pulmonology", "respiratory failure", "respiratory", "asthma", "copd",
        "pneumonia", "tuberculosis", "tb", "bronchitis", "chest infection",
        "breathing problem", "breathing", "cough", "wheezing", "lungs", "lung"
    ],
    "General Surgery": [
        "general surgery", "appendicitis", "appendix", "hernia repair", "hernia",
        "gallbladder surgery", "gallbladder", "laparoscopic surgery", "laparoscopy",
        "piles", "fistula", "trauma surgery", "operation", "surgery", "surgical"
    ],
    "Pediatrics": [
        "pediatrics", "pediatric", "child care", "children care", "child specialist",
        "newborn care", "newborn", "infant jaundice", "infant", "baby care", "baby",
        "nicu", "child vaccination", "vaccination", "pediatrician", "children", "child"
    ],
    "Gynecology": [
        "gynecology", "gynae", "gynecologist", "pregnancy care", "pregnancy",
        "pregnant", "normal delivery", "c-section", "cesarean", "pcos", "pcod",
        "infertility", "menstrual disorders", "period pain", "period", "uterus",
        "ovarian", "womens health", "women health"
    ],
    "Dermatology": [
        "dermatology", "skin allergy", "skin disease", "eczema", "psoriasis",
        "acne", "pimples", "skin rash", "rash", "rashes", "hair fall", "hair loss",
        "alopecia", "vitiligo", "fungal infection", "dermatitis", "itching", "dermatologist", "skin"
    ],
    "Ophthalmology": [
        "ophthalmology", "cataract surgery", "cataract", "glaucoma", "lasik surgery",
        "lasik", "retinal detachment", "retina", "cornea", "eye vision",
        "vision loss", "eye care", "eye surgery", "ophthalmologist", "eyes", "eye"
    ],
    "ENT": [
        "ear nose throat", "ent", "ear infection", "hearing loss", "deafness",
        "tonsillitis", "tonsils", "sinusitis", "sinus", "throat infection",
        "throat pain", "deviated septum", "ear pain", "throat", "nose", "ear"
    ],
    "General Medicine": [
        "general medicine", "internal medicine", "viral fever", "typhoid", "dengue",
        "malaria", "diabetes", "diabetic", "blood sugar", "sugar", "flu", "cold",
        "infection", "weakness", "physician", "general physician", "fever"
    ]
};

// Flatten and sort keywords by length descending so multi-word keywords match first
const SORTED_DISEASE_KEYWORDS = [];
for (const [spec, keywords] of Object.entries(DISEASE_KEYWORDS_MAP)) {
    for (const kw of keywords) {
        SORTED_DISEASE_KEYWORDS.push({ spec, kw, len: kw.length });
    }
}
SORTED_DISEASE_KEYWORDS.sort((a, b) => b.len - a.len);

// Detect disease keyword from text query
function detectDiseaseFromText(query) {
    if (!query) return { speciality: null, matchedKeyword: null, remainingQuery: "" };
    const cleanQuery = query.toLowerCase().trim();

    for (const item of SORTED_DISEASE_KEYWORDS) {
        const escaped = item.kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(^|\\b|\\s)${escaped}(\\b|\\s|$)`, 'i');
        if (regex.test(cleanQuery)) {
            const remaining = cleanQuery.replace(regex, ' ').replace(/\s+/g, ' ').trim();
            return {
                speciality: item.spec,
                matchedKeyword: item.kw,
                remainingQuery: remaining
            };
        }
    }
    return { speciality: null, matchedKeyword: null, remainingQuery: cleanQuery };
}

// Check if a hospital matches speciality or disease
function isSpecialityMatch(hospital, filterSpec) {
    if (!filterSpec || filterSpec === "" || filterSpec.toLowerCase() === "all") return true;
    const target = filterSpec.toLowerCase().trim();
    const s = (hospital.speciality || "").toLowerCase().trim();

    if (s === target || s.includes(target) || target.includes(s)) return true;

    // Check if target is a known synonym/disease of this hospital's speciality
    for (const [spec, keywords] of Object.entries(DISEASE_KEYWORDS_MAP)) {
        if (spec.toLowerCase() === s) {
            if (keywords.some(k => k === target || target.includes(k) || k.includes(target))) {
                return true;
            }
        }
    }

    if (target.includes("emergency") || target.includes("trauma")) {
        return s.includes("surgery") || s.includes("medicine") || s.includes("cardiology") || s.includes("orthopedics");
    }
    return false;
}

// Quick Select a Single Disease (used by chips, dropdown, and card pills)
function selectDisease(diseaseName) {
    selectedSpeciality = diseaseName;
    const specSelect = document.getElementById("speciality-filter");
    if (specSelect) specSelect.value = diseaseName;

    document.querySelectorAll("#speciality-chips .chip").forEach(c => {
        c.classList.toggle("active", (c.getAttribute("data-spec") || "").toLowerCase() === (diseaseName || "").toLowerCase());
    });

    applyFilters();

    const hospSection = document.getElementById("hospitals");
    if (hospSection) {
        hospSection.scrollIntoView({ behavior: "smooth" });
    }
}

// Clear Single Disease Filter and return to All Diseases view
function clearDiseaseFilter() {
    selectedSpeciality = "";
    const specSelect = document.getElementById("speciality-filter");
    if (specSelect) specSelect.value = "";

    document.querySelectorAll("#speciality-chips .chip").forEach((c, idx) => {
        c.classList.toggle("active", idx === 0);
    });

    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        const detected = detectDiseaseFromText(searchInput.value);
        if (detected.speciality) {
            searchInput.value = detected.remainingQuery;
        }
    }

    applyFilters();
}

// Main Filter Function: Intelligent Disease Recognition & Single-Disease vs Grouped Hospital view
function applyFilters() {
    const searchInput = document.getElementById("search-input");
    const citySelect = document.getElementById("city-filter");
    const specSelect = document.getElementById("speciality-filter");
    const budgetSelect = document.getElementById("budget-filter");

    const rawSearch = searchInput ? searchInput.value.trim() : "";
    const cityVal = citySelect ? citySelect.value.trim() : "";
    const specDropdownVal = specSelect ? specSelect.value.trim() : "";
    const budgetVal = budgetSelect ? budgetSelect.value.trim() : "";

    // 1. Determine whether a particular disease is searched/selected
    let activeDisease = selectedSpeciality || specDropdownVal;
    let hospitalQuery = rawSearch;

    if (!activeDisease && rawSearch) {
        const detected = detectDiseaseFromText(rawSearch);
        if (detected.speciality) {
            activeDisease = detected.speciality;
            hospitalQuery = detected.remainingQuery;

            // Reflect detected disease in dropdown and chips
            if (specSelect) specSelect.value = activeDisease;
            document.querySelectorAll("#speciality-chips .chip").forEach(c => {
                c.classList.toggle("active", (c.getAttribute("data-spec") || "").toLowerCase() === activeDisease.toLowerCase());
            });
        }
    }

    const isSingleDisease = Boolean(activeDisease);
    window.CURRENT_ACTIVE_DISEASE = isSingleDisease ? activeDisease : "";

    // Update the Active Disease Filter Notification Bar
    const activeBar = document.getElementById("active-disease-bar");
    const activeBadge = document.getElementById("active-disease-badge");
    const activeSubtext = document.getElementById("active-disease-subtext");
    if (activeBar) {
        if (isSingleDisease) {
            activeBar.style.display = "flex";
            if (activeBadge) activeBadge.textContent = `🎯 Single Disease Mode: ${activeDisease}`;
            if (activeSubtext) activeSubtext.textContent = `Showing verified success rates for ${activeDisease} only. Other disease cards are hidden.`;
        } else {
            activeBar.style.display = "none";
        }
    }

    let dataset = window.ALL_HOSPITALS && window.ALL_HOSPITALS.length > 0
        ? window.ALL_HOSPITALS
        : INITIAL_HOSPITALS;

    // 2. CASE A: Single Disease View Mode
    if (isSingleDisease) {
        let filtered = dataset.filter(h => {
            // Must strictly match this single disease
            if (!isSpecialityMatch(h, activeDisease)) return false;

            // Hospital name / location filter if user entered text
            if (hospitalQuery) {
                const terms = hospitalQuery.toLowerCase().split(/\s+/).filter(Boolean);
                const combined = `${h.name} ${h.city} ${h.district}`.toLowerCase();
                if (!terms.every(t => combined.includes(t))) return false;
            }

            // City Filter
            if (cityVal && !isCityMatch(h, cityVal)) return false;

            // Budget Filter
            if (budgetVal && budgetVal !== "all" && h.feeTier !== budgetVal) return false;

            // Quick Filter Toggles
            if (selectedQuickFilter === "nabh" && (h.rating < 4.7 && h.success_rate < 78.0)) return false;
            if (selectedQuickFilter === "icu" && (h.service_readiness_pct < 37.5 && !h.emergency24x7)) return false;
            if ((selectedQuickFilter === "cashless" || selectedQuickFilter === "high-volume") && h.no_of_patients_treated < 11000) return false;
            if (selectedQuickFilter === "high-success" && h.success_rate < 78.0) return false;

            return true;
        });

        // Sort descending strictly by single disease success rate
        filtered.sort((a, b) => (Number(b.success_rate) || 0) - (Number(a.success_rate) || 0));

        // Fallback if no exact match for combined city + disease
        if (filtered.length === 0) {
            const diseaseFallback = dataset
                .filter(h => isSpecialityMatch(h, activeDisease))
                .slice()
                .sort((a, b) => (Number(b.success_rate) || 0) - (Number(a.success_rate) || 0));

            renderHospitals(diseaseFallback, {
                isSingleDisease: true,
                disease: activeDisease,
                isFallback: true
            });
            return;
        }

        renderHospitals(filtered, {
            isSingleDisease: true,
            disease: activeDisease,
            isFallback: false
        });
        return;
    }

    // 3. CASE B: General Hospital Search (No disease specified) -> Group by Unique Hospital
    let matchedRows = dataset.filter(h => {
        // Hospital name / speciality / location search
        if (hospitalQuery) {
            const terms = hospitalQuery.toLowerCase().split(/\s+/).filter(Boolean);
            const combined = `${h.name} ${h.city} ${h.district} ${h.speciality}`.toLowerCase();
            if (!terms.every(t => combined.includes(t))) return false;
        }

        // City Filter
        if (cityVal && !isCityMatch(h, cityVal)) return false;

        // Budget Filter
        if (budgetVal && budgetVal !== "all" && h.feeTier !== budgetVal) return false;

        // Quick Filter Toggles
        if (selectedQuickFilter === "nabh" && (h.rating < 4.7 && h.success_rate < 78.0)) return false;
        if (selectedQuickFilter === "icu" && (h.service_readiness_pct < 37.5 && !h.emergency24x7)) return false;
        if ((selectedQuickFilter === "cashless" || selectedQuickFilter === "high-volume") && h.no_of_patients_treated < 11000) return false;
        if (selectedQuickFilter === "high-success" && h.success_rate < 78.0) return false;

        return true;
    });

    // Group rows by unique hospital name so hospitals don't duplicate 10 times
    const hospitalMap = new Map();
    matchedRows.forEach(h => {
        const key = (h.name || "Hospital").toLowerCase();
        if (!hospitalMap.has(key)) {
            hospitalMap.set(key, {
                id: h.id,
                name: h.name,
                city: h.city,
                district: h.district,
                rating: h.rating,
                ranking_score: h.ranking_score,
                service_readiness_pct: h.service_readiness_pct,
                overall_rank: h.overall_rank,
                feeTier: h.feeTier,
                consultationFee: h.consultationFee,
                nabh: h.nabh,
                emergency24x7: h.emergency24x7,
                cashless: h.cashless,
                departments: []
            });
        }
        hospitalMap.get(key).departments.push({
            speciality: h.speciality,
            success_rate: h.success_rate,
            no_of_patients_treated: h.no_of_patients_treated,
            speciality_rank: h.speciality_rank
        });
    });

    const groupedHospitals = Array.from(hospitalMap.values()).map(h => {
        h.departments.sort((a, b) => b.success_rate - a.success_rate);
        const totalPatients = h.departments.reduce((sum, d) => sum + (Number(d.no_of_patients_treated) || 0), 0);
        const avgSuccess = h.departments.length > 0
            ? h.departments.reduce((sum, d) => sum + (Number(d.success_rate) || 0), 0) / h.departments.length
            : 0;
        const topSuccess = h.departments.length > 0 ? h.departments[0].success_rate : 0;
        return {
            ...h,
            total_patients: totalPatients,
            avg_success_rate: avgSuccess,
            success_rate: topSuccess
        };
    });

    // Sort hospitals descending by average success rate
    groupedHospitals.sort((a, b) => b.avg_success_rate - a.avg_success_rate);

    if (groupedHospitals.length === 0) {
        // Fallback to top hospitals in Punjab
        const fallbackResults = dataset.slice(0, 30);
        renderHospitals(fallbackResults, { isSingleDisease: false, isFallback: true });
        return;
    }

    renderHospitals(groupedHospitals, { isSingleDisease: false, isFallback: false });
}

// Render Hospital Cards with Single Disease Rate or Grouped Hospital View
function renderHospitals(list, options = {}) {
    const isSingleDisease = Boolean(options.isSingleDisease);
    const disease = options.disease || "";
    const isFallback = Boolean(options.isFallback);

    const container = document.getElementById("hospitals-container");
    const noResultsMsg = document.getElementById("no-results-msg");
    const countHeading = document.getElementById("results-count-heading");
    const subtextEl = document.getElementById("results-subtext");

    if (!container) return;

    if (!list || list.length === 0) {
        container.innerHTML = "";
        if (noResultsMsg) noResultsMsg.style.display = "block";
        if (countHeading) countHeading.textContent = "0 Hospitals Found";
        if (subtextEl) subtextEl.textContent = "Try changing or resetting your search filters.";
        return;
    }

    if (noResultsMsg) noResultsMsg.style.display = "none";

    // Dynamic Headings based on Single Disease Mode
    if (countHeading) {
        if (isSingleDisease) {
            countHeading.textContent = `Top Hospitals for ${disease} (${list.length} available)`;
        } else if (isFallback) {
            countHeading.textContent = `Top Recommended Hospitals (${list.length} available)`;
        } else {
            countHeading.textContent = `Available Hospitals (${list.length})`;
        }
    }

    if (subtextEl) {
        if (isSingleDisease) {
            subtextEl.innerHTML = `🎯 Showing verified success rates for <strong>${disease}</strong> only • Sorted by highest success rate`;
        } else if (isFallback) {
            subtextEl.innerHTML = `<span style="color:#d97706; font-weight:600;">⚠️ Showing top success-rate hospitals in Punjab:</span>`;
        } else {
            subtextEl.textContent = "Ordered by Highest Success Rate • Click any disease below to view single disease rate";
        }
    }

    // Limit initial DOM render to top 100 for maximum performance
    const toRender = list.slice(0, 100);

    if (isSingleDisease) {
        // ==========================================
        // SINGLE DISEASE VIEW: ONLY ONE DISEASE SHOWN
        // ==========================================
        container.innerHTML = toRender.map((h, index) => {
            const isCompared = comparedHospitals.some(item => item.id === h.id);
            const compareBtnText = isCompared ? "✓ Added to Compare" : "+ Add to Compare";
            const compareBtnClass = isCompared ? "btn-add-compare added" : "btn-add-compare";

            const locText = h.city && h.district && h.city !== h.district
                ? `${h.city}, ${h.district}`
                : (h.city || h.district || "Punjab");

            const safeName = (h.name || "Hospital").replace(/'/g, "\\'");
            const rankLabel = h.speciality_rank ? `#${h.speciality_rank} in ${disease}` : `#${index + 1} Success Rank`;

            return `
                <div class="hospital-card single-disease-card" data-id="${h.id}" style="animation-delay: ${(index % 12) * 0.04}s;">
                    <div class="card-header">
                        <div class="card-top-badges">
                            <div>
                                <span class="badge-tag badge-nabh">${rankLabel}</span>
                                <span class="badge-tag badge-emergency" style="margin-left:4px;">🎯 ${h.success_rate}% ${disease} Success</span>
                            </div>
                            <div class="rating-badge">★ ${Number(h.rating).toFixed(1)}</div>
                        </div>
                        <h3 class="hospital-name">${h.name}</h3>
                        <div class="hospital-loc">📍 ${locText}</div>
                    </div>

                    <div class="card-body">
                        <div class="single-disease-badge-callout">
                            <span class="disease-focus-label">Searched Disease:</span>
                            <span class="disease-focus-val">🩺 ${disease}</span>
                        </div>

                        <div class="card-pricing-row single-disease-highlight">
                            <div class="price-item">
                                <span class="price-label">🎯 ${disease} Success Rate</span>
                                <span class="price-val" style="color: #047857; font-size: 17px; font-weight: 800;">${h.success_rate}%</span>
                            </div>
                            <div class="price-item" style="text-align: right;">
                                <span class="price-label">👥 ${disease} Patients Treated</span>
                                <span class="price-val" style="color: #0f172a; font-size: 15px;">${Number(h.no_of_patients_treated).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div class="card-footer">
                        <button class="btn-book" onclick="openBookingModal('${h.id}', '${safeName}', '${h.city}', '${disease}')">
                            Book Appointment
                        </button>
                        <button class="${compareBtnClass}" onclick="toggleCompareHospital('${h.id}')">
                            ${compareBtnText}
                        </button>
                    </div>
                </div>
            `;
        }).join("");
    } else {
        // ==========================================
        // GROUPED HOSPITAL VIEW (NO DISEASE FILTER)
        // ==========================================
        container.innerHTML = toRender.map((h, index) => {
            const isCompared = comparedHospitals.some(item => item.id === h.id);
            const compareBtnText = isCompared ? "✓ Added to Compare" : "+ Add to Compare";
            const compareBtnClass = isCompared ? "btn-add-compare added" : "btn-add-compare";

            const locText = h.city && h.district && h.city !== h.district
                ? `${h.city}, ${h.district}`
                : (h.city || h.district || "Punjab");

            const safeName = (h.name || "Hospital").replace(/'/g, "\\'");
            const avgRateStr = h.avg_success_rate ? h.avg_success_rate.toFixed(1) : (h.success_rate || 0);

            return `
                <div class="hospital-card" data-id="${h.id}" style="animation-delay: ${(index % 12) * 0.04}s;">
                    <div class="card-header">
                        <div class="card-top-badges">
                            <div>
                                <span class="badge-tag badge-nabh">#${index + 1} Hospital Rank</span>
                                <span class="badge-tag badge-emergency" style="margin-left:4px;">🎯 ${avgRateStr}% Avg Success</span>
                            </div>
                            <div class="rating-badge">★ ${Number(h.rating).toFixed(1)}</div>
                        </div>
                        <h3 class="hospital-name">${h.name}</h3>
                        <div class="hospital-loc">📍 ${locText}</div>
                    </div>

                    <div class="card-body">
                        <div class="card-pricing-row">
                            <div class="price-item">
                                <span class="price-label">🎯 Overall Avg Success</span>
                                <span class="price-val" style="color: #047857; font-size: 15px;">${avgRateStr}%</span>
                            </div>
                            <div class="price-item" style="text-align: right;">
                                <span class="price-label">👥 Total Patients Treated</span>
                                <span class="price-val" style="color: #0f172a; font-size: 15px;">${Number(h.total_patients || h.no_of_patients_treated || 0).toLocaleString()}</span>
                            </div>
                        </div>

                        <div>
                            <div class="price-label" style="margin-bottom: 6px;">Treated Diseases &amp; Rates (Click to filter single disease):</div>
                            <div class="specialities-tags">
                                ${(h.departments || []).map(d => `
                                    <button type="button" class="spec-pill dept-pill-btn" onclick="selectDisease('${d.speciality}')" title="Click to view single disease success rate for ${d.speciality}">
                                        ${d.speciality} <strong style="color: #059669; margin-left: 3px;">${d.success_rate}%</strong>
                                    </button>
                                `).join("")}
                            </div>
                        </div>
                    </div>

                    <div class="card-footer">
                        <button class="btn-book" onclick="openBookingModal('${h.id}', '${safeName}', '${h.city}')">
                            Book Appointment
                        </button>
                        <button class="${compareBtnClass}" onclick="toggleCompareHospital('${h.id}')">
                            ${compareBtnText}
                        </button>
                    </div>
                </div>
            `;
        }).join("");
    }
}

// Setup real-time event listeners for all filters
function setupEventListeners() {
    // 1. Live Instant Search (Debounced 150ms)
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(applyFilters, 150);
        });
    }

    // 2. City Dropdown Change
    const citySelect = document.getElementById("city-filter");
    if (citySelect) {
        citySelect.addEventListener("change", applyFilters);
    }

    // 3. Speciality Dropdown Change (syncs chip)
    const specSelect = document.getElementById("speciality-filter");
    if (specSelect) {
        specSelect.addEventListener("change", () => {
            selectedSpeciality = specSelect.value;
            document.querySelectorAll("#speciality-chips .chip").forEach(c => {
                c.classList.toggle("active", c.getAttribute("data-spec").toLowerCase() === selectedSpeciality.toLowerCase());
            });
            applyFilters();
        });
    }

    // 4. Budget Dropdown Change
    const budgetSelect = document.getElementById("budget-filter");
    if (budgetSelect) {
        budgetSelect.addEventListener("change", applyFilters);
    }

    // 5. Speciality Chips Click
    const chips = document.querySelectorAll("#speciality-chips .chip");
    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            selectedSpeciality = chip.getAttribute("data-spec") || "";

            // Sync with dropdown
            if (specSelect) {
                specSelect.value = selectedSpeciality;
            }
            applyFilters();
        });
    });

    // 6. Quick Filter Toggles Click
    const toggles = document.querySelectorAll(".quick-filter-toggles .filter-toggle");
    toggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
            toggles.forEach(t => t.classList.remove("active"));
            toggle.classList.add("active");
            selectedQuickFilter = toggle.getAttribute("data-filter") || "all";
            applyFilters();
        });
    });

    // 7. Form Submit
    const searchForm = document.getElementById("hospital-search-form");
    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            applyFilters();
        });
    }

    // 8. Compare Button
    const openCompareBtn = document.getElementById("open-compare-btn");
    if (openCompareBtn) {
        openCompareBtn.addEventListener("click", () => {
            if (comparedHospitals.length === 0) {
                alert("Please add at least 1 or 2 hospitals to compare first using '+ Add to Compare'.");
                return;
            }
            openCompareModal();
        });
    }

    // 9. AI Button
    const navAiBtn = document.getElementById("nav-ai-btn");
    if (navAiBtn) {
        navAiBtn.addEventListener("click", (e) => {
            e.preventDefault();
            toggleAIChat(true);
        });
    }

    // 10. Nav Tabs Click & Scroll Spy
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            if (href && href.startsWith("#") && href !== "#ai-assistant") {
                navLinks.forEach(l => l.classList.remove("active"));
                this.classList.add("active");
            }
        });
    });

    // Scroll spy to highlight active nav tab on scroll
    window.addEventListener("scroll", () => {
        const sections = [
            { id: "search-section", el: document.getElementById("search-section") },
            { id: "specialities", el: document.getElementById("specialities") },
            { id: "hospitals", el: document.getElementById("hospitals") }
        ];

        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        let currentSectionId = "";

        sections.forEach(({ id, el }) => {
            if (el) {
                const top = el.offsetTop - 140;
                const height = el.offsetHeight;
                if (scrollY >= top && scrollY < top + height) {
                    currentSectionId = id;
                }
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                const href = link.getAttribute("href");
                if (href === `#${currentSectionId}`) {
                    navLinks.forEach(l => l.classList.remove("active"));
                    link.classList.add("active");
                }
            });
        }
    }, { passive: true });
}

// Reset all filters to default state
function resetFilters() {
    const searchInput = document.getElementById("search-input");
    const citySelect = document.getElementById("city-filter");
    const specSelect = document.getElementById("speciality-filter");
    const budgetSelect = document.getElementById("budget-filter");

    if (searchInput) searchInput.value = "";
    if (citySelect) citySelect.value = "";
    if (specSelect) specSelect.value = "";
    if (budgetSelect) budgetSelect.value = "";

    selectedSpeciality = "";
    selectedQuickFilter = "all";
    window.CURRENT_ACTIVE_DISEASE = "";

    const activeBar = document.getElementById("active-disease-bar");
    if (activeBar) activeBar.style.display = "none";

    document.querySelectorAll("#speciality-chips .chip").forEach((c, idx) => {
        c.classList.toggle("active", idx === 0);
    });
    document.querySelectorAll(".quick-filter-toggles .filter-toggle").forEach((t, idx) => {
        t.classList.toggle("active", idx === 0);
    });

    applyFilters();
}

// Filter by clicking a city in the footer
function filterByCity(cityName) {
    const citySelect = document.getElementById("city-filter");
    if (citySelect) {
        citySelect.value = cityName;
        applyFilters();
        window.scrollTo({ top: 350, behavior: "smooth" });
    }
}

// Toggle hospital in compare tray
function toggleCompareHospital(id) {
    const index = comparedHospitals.findIndex(h => h.id === id);
    if (index > -1) {
        comparedHospitals.splice(index, 1);
    } else {
        if (comparedHospitals.length >= 3) {
            alert("You can compare up to 3 hospitals at a time.");
            return;
        }
        const item = (window.ALL_HOSPITALS || []).find(h => h.id === id) || INITIAL_HOSPITALS.find(h => h.id === id);
        if (item) comparedHospitals.push(item);
    }

    updateCompareUI();
    applyFilters();
}

function updateCompareUI() {
    const countSpan = document.getElementById("compare-count");
    const dock = document.getElementById("compare-dock");
    const dockText = document.getElementById("compare-dock-text");
    const dockList = document.getElementById("compare-dock-list");
    const compareBtn = document.getElementById("open-compare-btn");

    if (countSpan) countSpan.textContent = comparedHospitals.length;

    if (compareBtn) {
        compareBtn.classList.remove("bump");
        void compareBtn.offsetWidth; // trigger reflow
        compareBtn.classList.add("bump");
    }

    if (comparedHospitals.length > 0) {
        dock.classList.add("visible");
        dockText.textContent = `${comparedHospitals.length} of 3 hospitals selected`;
        dockList.innerHTML = comparedHospitals.map(h => `
            <div class="compare-pill">
                <span>${h.name}</span>
                <span class="compare-pill-remove" onclick="toggleCompareHospital('${h.id}')">&times;</span>
            </div>
        `).join("");
    } else {
        dock.classList.remove("visible");
    }
}

function clearComparison() {
    comparedHospitals = [];
    updateCompareUI();
    applyFilters();
}

function openCompareModal() {
    if (comparedHospitals.length === 0) return;

    const modal = document.getElementById("compare-modal");
    const modalContent = document.getElementById("compare-modal-content");
    const activeDisease = window.CURRENT_ACTIVE_DISEASE || "";

    modalContent.innerHTML = `
        <table class="compare-table">
            <thead>
                <tr>
                    <th>Feature</th>
                    ${comparedHospitals.map(h => `<th><strong>${h.name}</strong><br><small>${h.city}, ${h.district}</small></th>`).join("")}
                </tr>
            </thead>
            <tbody>
                <tr style="background: #f0fdf4;">
                    <td><strong>🎯 ${activeDisease ? activeDisease + ' Success Rate' : 'Success Rate'}</strong></td>
                    ${comparedHospitals.map(h => `<td style="color:#059669; font-weight:bold; font-size:16px;">${h.success_rate || h.avg_success_rate || 0}%</td>`).join("")}
                </tr>
                <tr style="background: #eff6ff;">
                    <td><strong>👥 Patients Treated</strong></td>
                    ${comparedHospitals.map(h => `<td style="color:#2563eb; font-weight:bold; font-size:16px;">${Number(h.no_of_patients_treated || h.total_patients || 0).toLocaleString()}</td>`).join("")}
                </tr>
                <tr>
                    <td>Patient Rating</td>
                    ${comparedHospitals.map(h => `<td>★ ${Number(h.rating).toFixed(1)}</td>`).join("")}
                </tr>
                <tr>
                    <td>Speciality / Department</td>
                    ${comparedHospitals.map(h => `<td>${h.speciality || (h.departments ? h.departments.map(d => d.speciality).join(', ') : 'Multispeciality')}</td>`).join("")}
                </tr>
                <tr>
                    <td>24/7 Service Readiness</td>
                    ${comparedHospitals.map(h => `<td>${h.service_readiness_pct ? h.service_readiness_pct + '%' : 'Standard'}</td>`).join("")}
                </tr>
                <tr>
                    <td>Est. Consultation Tier</td>
                    ${comparedHospitals.map(h => `<td><strong>₹${h.consultationFee || 650}</strong> (${h.feeTier || 'mid'})</td>`).join("")}
                </tr>
            </tbody>
        </table>
    `;

    modal.classList.add("active");
}

function closeCompareModal() {
    document.getElementById("compare-modal").classList.remove("active");
}

// Appointment Modal
function openBookingModal(id, name, city, defaultSpec) {
    const modal = document.getElementById("booking-modal");
    document.getElementById("booking-hospital-name").textContent = `Book at ${name}`;
    document.getElementById("booking-hospital-sub").textContent = `Location: ${city}`;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById("book-patient-date").value = tomorrow.toISOString().split("T")[0];

    const userName = document.getElementById("user-display-name").textContent;
    if (userName && userName !== "Welcome!" && userName !== "Guest User") {
        document.getElementById("book-patient-name").value = userName;
    }

    const specSelect = document.getElementById("book-patient-spec");
    if (specSelect && defaultSpec) {
        for (let i = 0; i < specSelect.options.length; i++) {
            if (specSelect.options[i].value.toLowerCase() === defaultSpec.toLowerCase()) {
                specSelect.selectedIndex = i;
                break;
            }
        }
    }

    document.getElementById("booking-success-msg").style.display = "none";
    modal.classList.add("active");
}

function closeBookingModal() {
    document.getElementById("booking-modal").classList.remove("active");
}

function handleConfirmBooking(e) {
    e.preventDefault();
    document.getElementById("booking-success-msg").style.display = "block";
    setTimeout(() => {
        closeBookingModal();
        alert("Appointment successfully registered! You will receive an SMS confirmation shortly.");
    }, 1200);
}

// AI Chatbot
function toggleAIChat(forceOpen) {
    const chatWindow = document.getElementById("ai-chat-window");
    if (forceOpen === true) chatWindow.classList.add("open");
    else if (forceOpen === false) chatWindow.classList.remove("open");
    else chatWindow.classList.toggle("open");
}

function sendQuickPrompt(promptText) {
    const input = document.getElementById("chat-user-input");
    input.value = promptText;
    handleSendChatMessage();
}

function handleSendChatMessage() {
    const input = document.getElementById("chat-user-input");
    const message = input.value.trim();
    if (!message) return;

    appendChatMessage(message, "user");
    input.value = "";

    setTimeout(() => {
        const response = generateAIResponse(message);
        appendChatMessage(response, "ai");
    }, 600);
}

function appendChatMessage(text, sender) {
    const container = document.getElementById("chat-messages");
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = text;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

function generateAIResponse(query) {
    const lower = query.toLowerCase();

    if (lower.includes("cardio") || lower.includes("heart") || lower.includes("chest")) {
        return `For <strong>Cardiology</strong>, <strong>Lifeline Medical Centre (Tarn Taran / Bathinda)</strong> leads our network with an <strong>80.9% success rate</strong> and over 10,137 treated cardiac patients.`;
    }
    if (lower.includes("surgery") || lower.includes("surgeon")) {
        return `For <strong>General Surgery</strong>, <strong>Apex Medical Centre (Bathinda / Khanna)</strong> has the highest recorded success rate at <strong>81.3%</strong> with 10,000+ successful operations.`;
    }
    if (lower.includes("gastro") || lower.includes("digest") || lower.includes("stomach")) {
        return `For <strong>Gastroenterology</strong>, <strong>Lifeline Hospital Rupnagar</strong> ranks highest with an <strong>81.1% success rate</strong> and 17,261 patients treated.`;
    }
    if (lower.includes("emergency") || lower.includes("ambulance")) {
        return `🚨 For immediate life-saving care, dial <strong>108</strong>. Facilities with high emergency readiness (≥43.75%) include <strong>Healing Touch Multispeciality</strong> and <strong>Apex Medical Centre</strong>.`;
    }
    if (lower.includes("rate") || lower.includes("success") || lower.includes("best")) {
        return `Top hospitals by verified success rate in Punjab:<br>1. <strong>Healing Touch Multispeciality (81.6%)</strong> - 15,343 patients<br>2. <strong>Apex Medical Centre (81.3%)</strong> - 10,000 patients<br>3. <strong>Lifeline Hospital (81.1%)</strong> - 17,261 patients.`;
    }

    return `Based on our verified database of 5,000 hospital records across Punjab, hospitals are sorted in order of <strong>highest success rate</strong>. You can filter by City, Speciality, or quick badges above.`;
}

// Global exports for inline HTML calls
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;
window.filterByCity = filterByCity;
window.renderHospitals = renderHospitals;
window.selectDisease = selectDisease;
window.clearDiseaseFilter = clearDiseaseFilter;
window.openBookingModal = openBookingModal;