import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

# --- DEMO TRAINING DATA ---
# x = passengers, y = profit
X = np.array([[10], [20], [30], [50], [100], [200]])
y = np.array([100, 200, 300, 500, 1000, 2000])

# Train model once when this file is imported
model = LinearRegression()
model.fit(X, y)

# Calculate RMSE on training data
y_pred_train = model.predict(X)
mse = mean_squared_error(y, y_pred_train)
rmse = np.sqrt(mse)

print("Model is trained (LINEAR REGRESSION)")

def get_prediction(passengers: float):
    """
    Function to use the trained model for prediction.
    """
    try:
        prediction = model.predict(np.array([[passengers]]))
        return float(prediction[0]), float(rmse)
    except Exception as e:
        raise RuntimeError(f"Linear Regression Prediction Error: {str(e)}")
