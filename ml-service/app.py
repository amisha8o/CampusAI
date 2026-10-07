from flask import Flask, request, jsonify
from sklearn.ensemble import RandomForestRegressor
import numpy as np

app = Flask(__name__)

# SYNTHETIC DEMONSTRATION DATA ONLY.
# Replace with a properly consented and representative dataset before research evaluation.
X = np.array([
    [5.0, 55, 20, 20, 20, 0, 0],
    [6.0, 65, 35, 40, 35, 1, 0],
    [6.5, 72, 45, 50, 50, 2, 0],
    [7.0, 78, 55, 60, 55, 2, 1],
    [7.5, 82, 65, 65, 65, 3, 1],
    [8.0, 88, 75, 75, 70, 4, 1],
    [8.5, 92, 85, 85, 80, 5, 2],
    [9.0, 96, 90, 90, 90, 6, 2],
    [7.2, 60, 70, 55, 60, 3, 1],
    [8.2, 75, 60, 80, 70, 4, 1],
    [6.8, 90, 40, 45, 65, 2, 0],
    [8.8, 85, 88, 78, 84, 5, 2],
], dtype=float)
y = np.array([25, 38, 48, 58, 68, 78, 88, 95, 62, 74, 56, 87], dtype=float)
model = RandomForestRegressor(n_estimators=80, random_state=42)
model.fit(X, y)

@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "CampusAI ML demo", "dataset": "synthetic demonstration data"})

@app.post("/predict")
def predict():
    data = request.get_json(silent=True) or {}
    fields = ["cgpa", "attendance", "dsaScore", "aptitudeScore", "communicationScore", "projects", "internships"]
    try:
        row = [
            float(data.get("cgpa", 0)),
            float(data.get("attendance", 0)),
            float(data.get("dsaScore", 0)),
            float(data.get("aptitudeScore", 0)),
            float(data.get("communicationScore", 0)),
            float(data.get("projects", 0)),
            float(data.get("internships", 0)),
        ]
        if not 0 <= row[0] <= 10:
            return jsonify({"message": "cgpa must be between 0 and 10"}), 400
        for idx in range(1, 5):
            if not 0 <= row[idx] <= 100:
                return jsonify({"message": f"{fields[idx]} must be between 0 and 100"}), 400
        if row[5] < 0 or row[6] < 0:
            return jsonify({"message": "projects and internships cannot be negative"}), 400
        prediction = float(np.clip(model.predict([row])[0], 0, 100))
        return jsonify({
            "demoPrediction": round(prediction, 2),
            "model": "RandomForestRegressor",
            "dataset": "synthetic demonstration data",
            "warning": "Not validated for real-world placement decisions; do not interpret as a hiring probability."
        })
    except (TypeError, ValueError):
        return jsonify({"message": "Provide numeric profile fields."}), 400

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
