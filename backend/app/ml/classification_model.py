import numpy as np
from sklearn.linear_model import LogisticRegression

# Input feature: marks (reshape because sklearn expects 2D input)
X = np.array([0, 45, 49.9, 51.5, 49.8, 100, 70]).reshape(-1, 1)
y = np.array([0, 0, 0, 1, 0, 1, 1])

# Train the model once when this file is imported
model = LogisticRegression()
model.fit(X, y)
print("Model is trained (CLASSIFICATION - LOGISTIC REGRESSION)")

def get_classification(marks: float):
    """
    Function to use the trained logistic model for classification.
    """
    try:
        marks_array = np.array([[marks]])
        
        # Probability of class 1 (Pass)
        probability = model.predict_proba(marks_array)[0][1]

        # Final prediction
        prediction = model.predict(marks_array)[0]

        return {
            "marks": marks,
            "probability_of_pass": round(float(probability), 3),
            "prediction_label": "Pass" if int(prediction) == 1 else "Fail"
        }
    except Exception as e:
        raise RuntimeError(f"Classification Prediction Error: {str(e)}")
