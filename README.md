# 📊 Potential Customers for Upsell  

A comprehensive **customer intelligence platform** that leverages **machine learning** to identify upsell opportunities, predict churn risk, and provide actionable recommendations for telecommunications companies.  

---

## 📋 Table of Contents  
- [🚀 Project Overview](#-project-overview)  
- [📦 Dependencies](#-dependencies)  
- [🛠️ Technology Stack](#️-technology-stack)  
- [🏗️ Architecture Diagram](#-architecture-diagram)  
- [📁 File Structure](#-file-structure)  
- [📄 File Explanations](#-file-explanations)  
- [🔄 Data Flow](#-data-flow)  
- [📊 Input/Output Formats](#-inputoutput-formats)  
- [⚙️ Environment Configuration](#️-environment-configuration)  
- [📦 Installation & Setup](#-installation--setup)  
- [🚀 Usage Guide](#-usage-guide)  
- [🤝 Contributing](#-contributing)  
- [📄 License](#-license)   

---

## 🚀 Project Overview  
**Potential Customers for Upsell** provides:  
✨ Real-time analytics dashboard  
🤖 ML-powered churn prediction & upsell opportunities  
📊 Customer segmentation & insights  
🎯 AI-driven recommendations  
📑 Data export (CSV/PDF)  
📱 Responsive UI with modern charts & filters  

---

## 📦 Dependencies  

### ⚛️ Frontend Dependencies (`package.json`)  

#### Runtime Dependencies (what the app needs to run)  
| Dependency       | Purpose                 | Used In |
|------------------|-------------------------|---------|
| **react & react-dom** | Core React library | All React components |
| **react-router-dom**  | Client-side routing | Navigation between pages |
| **lucide-react**      | Icon library        | Icons in all pages (Home, TrendingUp, etc.) |
| **chart.js**          | Charting library           | `Chart.jsx`, `Scatter.jsx` |
| **react-chartjs-2**   | React wrapper for Chart.js | `Chart.jsx`, `Scatter.jsx` |
| **axios**             | HTTP client for API calls (**missing in repo**) | API files (`cdrApi.js`, etc.) |

#### Development Dependencies (tools for building the app)  
| Dependency              | Purpose |
|--------------------------|---------|
| **@vitejs/plugin-react** | Vite integration for React |
| **vite**                 | Build tool + dev server |
| **typescript & @types/** | TypeScript support |
| **eslint & plugins**     | Code linting |
| **tailwindcss & postcss**| CSS framework + processing |
| **autoprefixer**         | CSS vendor prefixing |

---

### 🐍 Backend Dependencies (`requirements.txt`)  

| Package            | Purpose | Used In |
|--------------------|---------|---------|
| **Django**         | Web framework | Entire backend |
| **djangorestframework** | REST APIs | `views.py`, `urls.py` |
| **django-cors-headers** | Allow frontend-backend comms | Django `settings.py` |
| **pandas**         | Data manipulation | `main_pipeline.py`, views |
| **scikit-learn**   | ML training/predictions | `main_pipeline.py` |
| **xgboost / lightgbm** | Gradient boosting | Model training |
| **joblib**         | Save/load ML models | `main_pipeline.py` |
| **openpyxl / xlrd**| Read Excel files | `main_pipeline.py` |
| **psycopg2-binary**| PostgreSQL adapter | DB connection |

---

### 📌 Example `requirements.txt`:  
- Django==4.2.7
- djangorestframework==3.14.0
- django-cors-headers==4.3.1
- pandas==2.0.3
- scikit-learn==1.3.2
- xgboost==2.0.3
- joblib==1.3.2
- openpyxl==3.1.2
- psycopg2-binary==2.9.9

---

### 🌐 External Resource Dependencies 
| Resource               | Type | Required By             | Purpose                                 |
| ---------------------- | ---- | ----------------------- | --------------------------------------- |
| `churn_model.pkl`      | File | `main_pipeline.py`      | ML predictions                          |
| `churn_usage_model...` | File | `Analytics.jsx`         | Dashboard simulation before backend     |
| `telco.csv`            | Data | `supportApi.js`         | Mock data files                         |
| `sampleApi.js`         | File | `api.js`                | API service (Frontend pages) ⚠️ Missing |
| PostgreSQL Database    | DB   | `models.py`, `views.py` | Persistent storage                      |

---

### 🛠 Development & Build Tool Dependencies
| Tool           | Purpose                        |
| -------------- | ------------------------------ |
| Node.js (v16+) | Run frontend                   |
| Python (v3.8+) | Run backend                    |
| pip            | Python package installer       |
| npm / yarn     | Node package manager           |
| Git            | Version control                |
| PostgreSQL     | Production DB (SQLite for dev) |


---

## 🛠️ Technology Stack

### 🎨 Frontend
- Framework: React 18 + Vite ⚡  
- Styling: Tailwind CSS  
- Charts: Chart.js + react-chartjs-2
- Icons: Lucide React
- API Calls: Axios

---

### ⚙️ Backend
- Framework: Django 4.2+
- API: Django REST Framework
- Database: PostgreSQL / SQLite
- ML Libraries: Scikit-learn, XGBoost, LightGBM
- Data Processing: Pandas, NumPy

---

### 🤖 Machine Learning
- Model Persistence: Joblib
- Feature Engineering & Predictions: main_pipeline.py

---

## 🏗️ Architecture Diagram

![alt text](<WhatsApp Image 2025-09-03 at 09.08.56.jpeg>)

```text
┌──────────────────┐    HTTP/JSON    ┌─────────────────┐    SQL   ┌─────────────────┐  
│  React Frontend  │ ◄─────────────► │   Django API    │ ◄───────►│   Database      │  
│                  │                 │   Server        │          │   (PostgreSQL)  │  
│ - Dashboard      │                 │ - Views.py      │          │ - CDR Data      │  
│ - Analytics      │                 │ - Models.py     │          │ - Telco Data    │  
│ - Predictions    │    WebSocket    │ - URLs.py       │          │ - Support Data  │  
│ - Segments       │   (Optional)    └─────────────────┘          └─────────────────┘  
│ - Recommendations│  
└──────────────────┘
         │
         ▼
┌───────────────────┐  
│   ML Pipeline     │  
│   (Python)        │  
│ - main_pipeline.py│  
│ - Model Files     │  
└───────────────────┘
```
---

## 📁 File Structure
Potential_Customers_for_Upsell/  
├── Frontend/  
│   ├── src/  
│   │   ├── components/     # Reusable UI components  
│   │   ├── pages/          # Application pages  
│   │   ├── api/            # API service modules  
│   │   ├── database/       # Mock/sample data  
│   │   └── assets/css/     # Styling  
│   └── package.json  
├── Backend/  
│   ├── backend/            # Django settings & core  
│   ├── api/                # API app (models, views, serializers)  
│   └── requirements.txt  
├── Models/                 # Trained ML models 
├── Scripts/  
│   └── main_pipeline.py    # ML pipeline  
└── README.md

---

## 📄 File Explanations

### 🎨 Frontend Components
- Card.jsx → Reusable card UI
- Chart.jsx → Configurable charts
- Scatter.jsx → Scatter plots for segmentation
- Table.jsx → Dynamic data tables
- Form.jsx → File upload forms

---

### 📊 Pages
- Dashboard.jsx → KPIs & churn trends
- Analytics.jsx → Filters, usage charts, customer tables
- Prediction.jsx → ML predictions with CSV uploads
- Segments.jsx → Customer clustering visualizations
- Recommendations.jsx → AI-generated recommendations

---

### ⚙️ Backend Files
- models.py → Defines DB schema (CDR, Telco, Support)
- views.py → API endpoints
- urls.py → Routing
- serializers.py → Data serialization

---

### 🤖 ML Pipeline
- main_pipeline.py → Data processing, feature engineering, prediction

---

## 🔄 Data Flow
- Data Ingestion → CSV upload / API request
- Processing → ML pipeline (validation, prediction)
- Analysis → Results stored temporarily
- Output → Frontend charts, recommendations, exports

---

## 📊 Input/Output Formats

### Input
- CSV Upload → phone_number, account_length, day_mins, etc.
- API → /api/cdr/, /api/telco/, /api/support/

### Output
- JSON API Responses → customer metrics & churn rate
- Prediction Results → churn probability, recommended products

---

## ⚙️ Environment Configuration

Create a .env file in Backend/

### Django Settings
DEBUG=True  
SECRET_KEY=your-secret-key-here  
DATABASE_URL=postgresql://username:password@localhost:5432/upcell_db

### ML Model Paths
CHURN_MODEL_PATH=Models/churn_model.pkl  
USAGE_MODEL_PATH=Models/churn_usage_model.pkl

### API Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

---

## 📦 Installation & Setup

### 🖥 Backend Setup
git clone <repository-url>  
cd Potential_Customers_for_Upsell/Backend  

python -m venv venv  
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt  
python manage.py migrate  
python manage.py createsuperuser  
python manage.py runserver

### 🎨 Frontend Setup
cd ../Frontend  
npm install  
npm run dev

### 🤖 ML Models Setup
Place model files in Models/  
churn_model.pkl  
churn_usage_model.pkl

---

## 🚀 Usage Guide
- Dashboard → Monitor churn rate & KPIs
- Predictions → Upload CSV for churn analysis
- Segments → Visualize customer clusters
- Recommendations → Get AI-driven suggestions
- Export → CSV/PDF reports

---

## 🤝 Contributing
We ❤️ contributions!  
Fork the repo  
Create a branch → git checkout -b feature/amazing-feature  
Commit changes → git commit -m 'Add amazing feature  
Push branch → git push origin feature/amazing-feature  
Open a Pull Request 🚀

---

### Guidelines
Follow PEP8 (Python)  
Use ESLint (JavaScript)  
Write tests 🧪  
Update docs 📖

---

## 📄 License
Licensed under the MIT License – see the LICENSE file.

---

