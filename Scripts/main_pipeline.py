import pandas as pd
import joblib
import json
import sys

# --- Helper function for signals ---
def signal(phase, status):
    """
    phase: str - Name of the pipeline phase
    status: str - 'start' or 'done'
    Emits a JSON signal to stdout (for frontend tracking).
    """
    msg = {"type": "signal", "phase": phase, "status": status}
    print(json.dumps(msg))
    sys.stdout.flush()

# --- Load models ---
churn_usage_model = joblib.load("Models/churn_usage_model.pkl")
telco_churn_model = joblib.load("Models/churn_model.pkl")

# ===========================
# 1. DATA VALIDATION
# ===========================
signal("Data Validation", "start")

data = pd.read_excel("D:\cts datasets\CDR-Sample-Input.xlsx")

# Save identifiers (non-numeric columns) separately
id_cols = ["Phone Number"]  # <-- add more if needed
identifiers = data[id_cols]

# Drop them from the features used for prediction
X = data.drop(columns=id_cols)

# Store tenure column temporarily before removing it
tenure_data = X["tenure"]  # Store tenure data temporarily
X = X.drop(columns=["tenure"])  # Remove tenure column for model inference

signal("Data Validation", "done")

# ===========================
# 2. CDR MODEL INFERENCE
# ===========================
signal("CDR Model Inference", "start")

churn_pred = churn_usage_model.predict(X)
usage_category = churn_pred[:, 1]  # assuming 2nd column is usage_category

signal("CDR Model Inference", "done")

# ===========================
# 3. SUPPORT MODEL INFERENCE
# ===========================
signal("Support Model Inference", "start")

# If you have additional support models, run them here
# Currently skipping (placeholder)

signal("Support Model Inference", "done")

# ===========================
# 4. TELCO MODEL
# ===========================
signal("Telco Model", "start")

churn_proba = telco_churn_model.predict_proba(X)[:, 1]  # probability of churn

signal("Telco Model", "done")

# ===========================
# 5. DECISION LEVEL FUSION
# ===========================
signal("Decision Level Fusion", "start")

results = data.copy()
results["Churn_Prediction"] = churn_pred[:, 0]  # assuming 1st column is churn prediction
results["Usage_Category"] = usage_category
results["Churn_Probability"] = churn_proba

# Add the tenure column back to results
# Add the temporary tenure data back

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

# --- Feature Importances (Top 10) ---
top_features_list = []
try:
    if hasattr(telco_churn_model, "named_steps"):
        final_step = list(telco_churn_model.named_steps.values())[-1]
    else:
        final_step = telco_churn_model

    if hasattr(final_step, "feature_importances_"):  # tree-based models
        importances = final_step.feature_importances_
    elif hasattr(final_step, "coef_"):  # linear models
        importances = abs(final_step.coef_[0])
    else:
        importances = None

    if importances is not None:
        feature_importances = pd.DataFrame({
            "Feature": X.columns,
            "Importance": importances
        }).sort_values(by="Importance", ascending=False).head(10)

        # Convert to list of dicts
        top_features_list = [
            {"feature": row["Feature"], "importance": round(row["Importance"] * 100, 2)}
            for _, row in feature_importances.iterrows()
        ]
    else:
        top_features_list = []
except Exception as e:
    top_features_list = [{"error": str(e)}]

# Add the same Top 10 features to every row (for consistency)
results["Top_10_Features"] = [top_features_list] * len(results)

# Add tenure column to the end by dropping it first if exists, then adding it
if 'tenure' in results.columns:
    results = results.drop(columns=['tenure'])
results["tenure"] = tenure_data.values
print("tenure data values:", tenure_data.values)

signal("Decision Level Fusion", "done")

# ===========================
# FINAL JSON RESPONSE
# ===========================
signal("Pipeline", "completed")

response = {
    "status": "success",
    "message": "Pipeline completed successfully",
    "results": results.to_dict(orient="records")
}

print(json.dumps(response, indent=2))