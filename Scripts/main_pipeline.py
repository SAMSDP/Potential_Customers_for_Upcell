import pandas as pd
import joblib

# --- Load models ---
churn_usage_model = joblib.load("Models/churn_usage_model.pkl")
telco_churn_model = joblib.load("Models/churn_model.pkl")

# --- Load Data ---
data = pd.read_excel("Data/processed/CDR-Sample-Input.xlsx")

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

# --- Feature Importances (Top 10) ---
try:
    # Check if model is a pipeline
    if hasattr(telco_churn_model, "named_steps"):
        # Take the last step (assumes final estimator is the tree-based model)
        final_step = list(telco_churn_model.named_steps.values())[-1]
    else:
        final_step = telco_churn_model

    # Get importances
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

        # Format as "Feature (xx.xx%)"
        feature_importances["Formatted"] = feature_importances.apply(
            lambda row: f"{row['Feature']} ({row['Importance']*100:.2f}%)", axis=1
        )

        # Join as single string
        top_features_str = ", ".join(feature_importances["Formatted"].tolist())
    else:
        top_features_str = "Model does not support feature importance"

except Exception as e:
    top_features_str = f"Error: {str(e)}"

# --- Add Top 10 Features column (same for all rows) ---
results["Top_10_Features"] = top_features_str

# --- Save final output ---
results.to_excel("final_output.xlsx", index=False)

print("✅ Pipeline completed. Output saved to final_output.xlsx with Top 10 Features column")
