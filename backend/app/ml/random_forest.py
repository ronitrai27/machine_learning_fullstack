import joblib
import os

# Global variable to store the model in RAM
model = None

def load_model():
    global model
    current_dir = os.path.dirname(__file__)
    model_path = os.path.join(current_dir, "random_forest_model.pkl")
    
    try:
        model = joblib.load(model_path)
        print("Random Forest Model loaded!")
    except Exception as e:
        print(f"Error loading RF Model: {e}")

# Just a simple function to run the prediction
def get_prediction(features):
    if model is None:
        return None
    print("Prediction:", model.predict(features))
    return model.predict(features)
