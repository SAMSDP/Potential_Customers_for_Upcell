import pandas as pd
import joblib

# load models
churn_usage_model = joblib.load("Models/churn_usage_model.pkl")
telco_churn_model = joblib.load("Models/telco_churn_model.pkl")

# --- Load Data ---
data = pd.read_excel("CDR-Sample-Input.xlsx")

# Save identifiers (non-numeric columns) separately
id_cols = ["Phone Number"]  # <-- add more if needed
identifiers = data[id_cols]

# Drop them from the features used for prediction
X = data.drop(columns=id_cols)

# --- Run churn_usage_model ---
churn_pred = churn_usage_model.predict(X)
usage_category = churn_pred[:, 1]  # assuming 2nd column is usage_category

# --- Run churn probability model ---
churn_proba = telco_churn_model.predict_proba(X)[:, 1]  # probability of churn

# --- Add results back to dataframe ---
results = data.copy()
results["Churn_Prediction"] = churn_pred[:, 0]  # assuming 1st column is churn prediction
results["Usage_Category"] = usage_category
results["Churn_Probability"] = churn_proba

# --- Recommended Products based on function ---
def recommend_products(row):
    recs = []
    if row["Usage_Category"] == 0:
        recs.append("Basic Retention Offer")
    elif row["Usage_Category"] == 1:
        recs.append("Accessories / Minor Upsell")
    elif row["Usage_Category"] == 2:
        recs.append("Software Products / Premium Add-ons")
    return recs

results["Recommended_Products"] = results.apply(recommend_products, axis=1)

# --- Save final output ---
results.to_excel("final_output.xlsx", index=False)

print("✅ Pipeline completed. Output saved to final_output.xlsx")
