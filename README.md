# 🏥 NearMed

> **Find suitable and budget-friendly hospitals in your locality.**

NearMed is a web-based hospital discovery platform designed to help users find and explore hospitals based on available hospital information and locality. The project provides a simple and user-friendly interface for accessing hospital data and making hospital searches easier.

---

## 📌 Problem Statement

Finding a suitable hospital can be difficult because hospital information is often scattered across different sources. Users may have trouble comparing hospitals based on factors such as **location, cost, facilities, and available services**.

NearMed aims to provide a centralized platform where hospital information can be presented in an easier-to-search and understand format.

---

## 🎯 Objectives

* 🔍 Make hospital searching easier for users
* 🏥 Provide centralized hospital information
* 💰 Help users identify budget-friendly hospital options
* 📍 Assist users in finding hospitals in their locality
* 🖥️ Provide a simple and attractive web interface
* 📊 Use structured hospital data for searching and displaying information

---

## ✨ Features

### 🔐 User Interface

* Simple and clean interface
* User-friendly navigation
* Responsive webpage design
* Attractive hospital-themed interface

### 🔎 Hospital Search

* Search hospital information from the available dataset
* Display relevant hospital details
* Support locality-based hospital discovery

### 📊 Hospital Dataset

* Hospital information is stored in a CSV dataset
* Structured data can be processed using Python
* Dataset can be expanded with additional hospital information

### 🐍 Python Backend

* Python server handles backend functionality
* Connects the web interface with the hospital data
* Provides a foundation for further backend development

---

## 🛠️ Technology Stack

| Technology          | Purpose                             |
| ------------------- | ----------------------------------- |
| 🌐 HTML5            | Structure of webpages               |
| 🎨 CSS3             | Styling and visual design           |
| ⚡ JavaScript        | Client-side interactions            |
| 🐍 Python           | Backend/server-side functionality   |
| 📊 CSV              | Hospital dataset storage            |
| 📦 Python Libraries | Backend dependencies                |
| 💻 VS Code          | Development environment             |
| 🔗 Git & GitHub     | Version control and project hosting |

---

## 🏗️ Project Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Web Interface    │
                    │     HTML + CSS       │
                    │    + JavaScript     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Python Server    │
                    │      server.py      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Hospital Dataset  │
                    │       CSV File      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Hospital Information│
                    │   Displayed to User │
                    └─────────────────────┘
```

---

## 📂 Project Structure

```text
Hospital-Find/
│
├── 📄 index.html
├── 📄 home.html
│
├── 🎨 style.css
├── 🎨 home.css
│
├── ⚡ home.js
│
├── 🐍 server.py
├── 📦 requirements.txt
│
├── 📊 hospitals 2.csv
│
├── 🖼️ background.png
│
├── 📄 .gitattributes
│
└── 📄 README.md
```

The repository currently contains these core frontend, backend, dataset, and configuration files.

---

## ⚙️ How It Works

The basic workflow of Hospital-Find is:

```text
User
  ↓
Open Website
  ↓
Homepage
  ↓
Search / Explore Hospitals
  ↓
Python Backend
  ↓
Hospital CSV Dataset
  ↓
Process Hospital Information
  ↓
Display Hospital Results
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/HarkeeratSingh-0001/Hospital-Find.git
```

### 2. Open the Project

```bash
cd Hospital-Find
```

You can open the project in **Visual Studio Code**.

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the Python Server

```bash
python server.py
```

### 5. Open the Website

After starting the server, open the local address shown by the Python application in your browser.

---

## 📊 Dataset

The project includes a hospital dataset:

```text
hospitals 2.csv
```

The dataset is used as the source of hospital information for the application.

Possible hospital information can include details such as:

* Hospital name
* Location
* Address
* Hospital type
* Available facilities
* Contact information
* Cost-related information
* Other hospital attributes

---

## 🎨 Frontend

The frontend is developed using:

### HTML

HTML provides the basic structure of the website, including pages, forms, navigation, and content.

### CSS

CSS is used to create the visual design, layout, spacing, colors, and overall appearance of the application.

### JavaScript

JavaScript provides client-side functionality and interaction within the website.

---

## 🐍 Backend

The project uses **Python** for backend/server functionality.

The main backend file is:

```text
server.py
```

The Python backend acts as the connection between the website and the hospital dataset, providing a foundation for processing and serving hospital information.

---

## 🔮 Future Improvements

The project can be extended with several additional features:

* 🗄️ MySQL database integration
* 🔐 User authentication and registration
* 📍 GPS/location-based hospital search
* 🔎 Advanced filtering
* 💰 Hospital cost comparison
* 🏥 Hospital specialization filtering
* ⭐ Hospital ratings and reviews
* 📅 Appointment booking
* 👨‍⚕️ Doctor information
* 🧭 Map integration
* 🤖 AI-powered hospital recommendation
* 📱 Improved mobile responsiveness
* 📊 Hospital statistics and analytics
* ☁️ Online deployment

---

## 🎓 Project Use

Hospital-Find can be used as:

* 🎓 College project
* 💻 Web development project
* 🏆 Hackathon prototype
* 📊 Data-driven application
* 🏥 Healthcare technology prototype

---

## 🤝 Contributing

Contributions and improvements are welcome.

If you would like to contribute:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Commit your changes
5. Push the branch
6. Create a Pull Request

---

## 👨‍💻 Developer

**Harkeerat Singh**

GitHub:
https://github.com/HarkeeratSingh-0001

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is intended for **educational and demonstration purposes**.

---

### 🏥 NearMed

**Making hospital discovery simpler, more accessible, and easier to understand.**