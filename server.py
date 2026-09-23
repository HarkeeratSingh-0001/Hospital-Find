"""
HospitalConnect - Local Web & CSV Database Server
Zero-dependency server using Python's built-in standard library.
Stores registrations into 'users.csv'.
"""

import http.server
import socketserver
import urllib.parse
import csv
import os
import json
import re
from datetime import datetime

PORT = 8000
CSV_FILE = os.path.join(os.path.dirname(__file__), "users.csv")

DISEASE_KEYWORDS = {
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
}

SORTED_DISEASE_KEYWORDS = []
for _spec, _kws in DISEASE_KEYWORDS.items():
    for _kw in _kws:
        SORTED_DISEASE_KEYWORDS.append((_kw, _spec, len(_kw)))
SORTED_DISEASE_KEYWORDS.sort(key=lambda x: x[2], reverse=True)

def detect_disease_server(text):
    if not text:
        return None, ""
    clean = text.lower().strip()
    for kw, spec, _ in SORTED_DISEASE_KEYWORDS:
        pattern = r"(^|\b|\s)" + re.escape(kw) + r"(\b|\s|$)"
        if re.search(pattern, clean):
            rem = re.sub(pattern, " ", clean).strip()
            return spec, rem
    return None, clean
def get_hospitals_filepath():
    """Use only the hospital database in the server directory to avoid unrelated template data."""
    server_dir = os.path.dirname(__file__)
    candidates = [
        os.path.join(server_dir, "hospitals 2.csv"),
        os.path.join(server_dir, "hospitals.csv"),
        os.path.join(os.getcwd(), "hospitals 2.csv"),
    ]
    for path in candidates:
        if os.path.exists(path):
            return path
    return os.path.join(server_dir, "hospitals 2.csv")

HOSPITALS_FILE = get_hospitals_filepath()
CSV_HEADERS = ["id", "timestamp", "name", "email", "phone", "city"]


def init_csv():
    """Ensure the CSV database exists with proper headers."""
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, mode="w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(CSV_HEADERS)
        print(f"[DATABASE] Initialized new database at: {CSV_FILE}")

def get_next_id():
    """Determine the next auto-incrementing user ID."""
    if not os.path.exists(CSV_FILE):
        return 1
    with open(CSV_FILE, mode="r", newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        rows = list(reader)
        return max(1, len(rows))

def save_user_to_csv(name, email, phone, city):
    """Appends a new user registration row to users.csv."""
    init_csv()
    user_id = get_next_id()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    with open(CSV_FILE, mode="a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([user_id, timestamp, name, email, phone, city])
    
    print(f"[DATABASE] Saved User #{user_id}: {name} ({email}, {city}) into users.csv")
    return user_id


def init_hospitals_csv():
    """Ensure the hospitals database exists."""
    global HOSPITALS_FILE
    HOSPITALS_FILE = get_hospitals_filepath()
    if not os.path.exists(HOSPITALS_FILE):
        with open(HOSPITALS_FILE, mode="w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["hospital_name", "district", "city", "speciality", "hospital_rating", "success_rate", "service_readiness_pct", "ranking_score", "speciality_rank", "overall_rank", "no_of_patients_treated"])
        print(f"[DATABASE] Initialized new hospitals database at: {HOSPITALS_FILE}")


def load_hospitals():
    """Return all hospital records from hospitals 2.csv sorted by success rate descending."""
    file_path = get_hospitals_filepath()
    if not os.path.exists(file_path):
        init_hospitals_csv()
    hospitals = []
    if not os.path.exists(file_path):
        return hospitals

    with open(file_path, mode="r", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row and any((value or "").strip() for value in row.values()):
                hospitals.append(row)

    # Sort in order of success rate (descending)
    def parse_success_rate(item):
        try:
            return float(item.get("success_rate", 0) or 0)
        except (ValueError, TypeError):
            return 0.0

    hospitals.sort(key=parse_success_rate, reverse=True)
    return hospitals


class HospitalConnectHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Accept")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else ""

        if self.path == "/register" or self.path.startswith("/register?"):
            parsed_data = urllib.parse.parse_qs(post_data)
            name = parsed_data.get("name", [""])[0].strip()
            email = parsed_data.get("email", [""])[0].strip()
            phone = parsed_data.get("phone", [""])[0].strip()
            city = parsed_data.get("city", [""])[0].strip()

            # 1. Save record into users.csv
            save_user_to_csv(name, email, phone, city)

            # 2. Redirect to Home Page with user's name & city
            encoded_name = urllib.parse.quote(name)
            encoded_city = urllib.parse.quote(city)
            redirect_url = f"/home.html?name={encoded_name}&city={encoded_city}&registered=1"

            self.send_response(303)
            self.send_header("Location", redirect_url)
            self.end_headers()
            return

        if self.path.startswith("/api/book-appointment"):
            try:
                booking = json.loads(post_data) if post_data else {}
            except Exception:
                booking = {}
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "message": "Appointment booked successfully!", "booking": booking}).encode("utf-8"))
            return

        if self.path.startswith("/api/ai-chat"):
            try:
                chat_data = json.loads(post_data) if post_data else {}
            except Exception:
                chat_data = {}
            msg = chat_data.get("message", "").lower()
            reply = "I can help you explore top hospitals in Punjab ordered by verified success rates and patient volumes."
            if "cardio" in msg or "heart" in msg:
                reply = "For Cardiology, hospitals like Lifeline Medical Centre and Apex Medical Centre have the highest success rates (>80%) and have treated over 10,000 cardiac patients."
            elif "surgery" in msg or "surgeon" in msg:
                reply = "For General Surgery, Apex Medical Centre Bathinda leads with an 81.3% success rate and 10,000+ patients treated."
            elif "rate" in msg or "best" in msg:
                reply = "Hospitals are ranked in order of success rate, with Healing Touch Multispeciality Hospital (81.6%) and Apex Medical Centre (81.3%) at the top."
            
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"reply": reply}).encode("utf-8"))
            return

        self.send_error(404, "Endpoint not found")

    def do_GET(self):
        requested_path = urllib.parse.urlparse(self.path).path

        if self.path == "/" or self.path == "":
            self.path = "/index.html"
            requested_path = "/index.html"

        if requested_path.endswith(".html") and requested_path not in ("/index.html", "/home.html"):
            self.send_error(404, "Only the configured hospital database page is served.")
            return

        # Direct download endpoint for users.csv
        if self.path == "/download-users-csv":
            init_csv()
            self.send_response(200)
            self.send_header("Content-Type", "text/csv; charset=utf-8")
            self.send_header("Content-Disposition", "attachment; filename=\"users.csv\"")
            with open(CSV_FILE, "rb") as f:
                self.wfile.write(f.read())
            return

        # View all users as JSON
        if self.path == "/api/users":
            init_csv()
            users = []
            with open(CSV_FILE, mode="r", newline="", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    users.append(row)
            
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(users, indent=2).encode("utf-8"))
            return

        # View hospitals as JSON (ordered by success rate descending)
        if self.path == "/api/hospitals" or self.path.startswith("/api/hospitals?") or self.path.startswith("/api/hospitals/"):
            hospitals = load_hospitals()

            # Optional query filters
            parsed_url = urllib.parse.urlparse(self.path)
            query_params = urllib.parse.parse_qs(parsed_url.query)
            q = query_params.get("q", [""])[0].strip()
            city = query_params.get("city", [""])[0].strip().lower()
            speciality = query_params.get("speciality", [""])[0].strip()
            quick_filter = query_params.get("filter", [""])[0].strip().lower()

            target_disease = None
            hospital_query = q.lower()

            if speciality:
                det, _ = detect_disease_server(speciality)
                target_disease = det if det else speciality
            elif q:
                det, rem = detect_disease_server(q)
                if det:
                    target_disease = det
                    hospital_query = rem.lower()

            def match_city(target, c, d, name):
                if not target or target in ("all", "all cities", "all cities / regions"):
                    return True
                if target in c or c in target or target in d or d in target or target in name:
                    return True
                # Chandigarh / Tricity handling (Mohali / SAS Nagar / Rupnagar)
                if "chandigarh" in target and ("mohali" in c or "sas nagar" in d or "rupnagar" in c or "mohali" in name):
                    return True
                if "mohali" in target and ("sas nagar" in d or "chandigarh" in name):
                    return True
                return False

            def match_speciality(target, s):
                if not target or target.lower() in ("all", "all specialities", "all diseases / specialities"):
                    return True
                t = target.lower().strip()
                s = s.lower().strip()
                if t == s or t in s or s in t:
                    return True
                # Check keyword list
                for spec, kws in DISEASE_KEYWORDS.items():
                    if spec.lower() == s and any(k == t or k in t or t in k for k in kws):
                        return True
                if "emergency" in t or "trauma" in t:
                    return s in ("general surgery", "general medicine", "cardiology", "orthopedics")
                return False

            def apply_quick_filter(hospital, filter_name):
                if not filter_name or filter_name == "all":
                    return True
                try:
                    rating = float(hospital.get("hospital_rating", 0) or 0)
                    readiness = float(hospital.get("service_readiness_pct", 0) or 0)
                    patients = int(hospital.get("no_of_patients_treated", 0) or 0)
                    success = float(hospital.get("success_rate", 0) or 0)
                except (ValueError, TypeError):
                    rating, readiness, patients, success = 0, 0, 0, 0

                if filter_name in ("nabh", "top-rated"):
                    return rating >= 4.7 or success >= 78.0
                if filter_name in ("icu", "readiness"):
                    return readiness >= 37.5
                if filter_name in ("cashless", "high-volume"):
                    return patients >= 11000
                if filter_name == "high-success":
                    return success >= 78.0
                return True

            if target_disease or hospital_query or city or quick_filter:
                filtered = []
                for h in hospitals:
                    name_val = (h.get("hospital_name") or "").lower()
                    city_val = (h.get("city") or "").lower()
                    dist_val = (h.get("district") or "").lower()
                    spec_val = (h.get("speciality") or "").lower()

                    if target_disease and not match_speciality(target_disease, spec_val):
                        continue

                    if hospital_query:
                        terms = hospital_query.split()
                        combined = f"{name_val} {city_val} {dist_val}" if target_disease else f"{name_val} {city_val} {dist_val} {spec_val}"
                        if not all(t in combined for t in terms):
                            continue

                    if city and not match_city(city, city_val, dist_val, name_val):
                        continue

                    if not apply_quick_filter(h, quick_filter):
                        continue

                    filtered.append(h)

                if filtered:
                    hospitals = filtered
                elif target_disease:
                    # Show records for that disease rather than falling back to all diseases
                    hospitals = [h for h in hospitals if match_speciality(target_disease, (h.get("speciality") or "").lower())]
                else:
                    hospitals = hospitals[:30]

            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps(hospitals, indent=2).encode("utf-8"))
            return

        return super().do_GET()

import os

if __name__ == '__main__':
    
    port = int(os.environ.get('PORT', 5000))
    with socketserver.TCPServer(('0.0.0.0', port), HospitalConnectHandler) as server:
        print(f"HospitalConnect server running on port {port}")
        server.serve_forever()