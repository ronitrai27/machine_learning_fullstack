# API Endpoints Documentation

This document lists all the available Machine Learning endpoints in the backend system.

---

## 1. Linear Regression Prediction
Predicts profit based on the number of passengers.

- **URL**: `/api/v1/ml/predict`
- **Method**: `POST`
- **Description**: Uses a trained Linear Regression model to predict profit.
- **Request Body (JSON)**:
    ```json
    {
      "passengers": 120
    }
    ```
- **Success Response (200 OK)**:
    ```json
    {
      "status": "success",
      "data": {
        "passengers": 120,
        "predicted_profit": 1200.0,
        "rmse": 0.0,
        "message": "rmse is based on training error (not accuracy)"
      }
    }
    ```
- **Error Responses**:
    - `400 Bad Request`: If passengers < 0 or too high.
    - `500 Internal Server Error`: If model inference fails.

---

## 2. Logistic Regression Classification
Classifies whether a student will Pass or Fail based on their marks.

- **URL**: `/api/v1/ml/logistic`
- **Method**: `POST`
- **Description**: Uses a trained Logistic Regression model to classify pass/fail probability.
- **Request Body (JSON)**:
    ```json
    {
      "studentMarks": 75.5
    }
    ```
- **Success Response (200 OK)**:
    ```json
    {
      "status": "success",
      "data": {
        "marks": 75.5,
        "probability_of_pass": 0.999,
        "prediction_label": "Pass"
      }
    }
    ```
- **Error Responses**:
    - `400 Bad Request`: If marks are not between 0 and 100.
    - `500 Internal Server Error`: If model inference fails.

---

## Error Handling Summary
The system uses standard HTTP status codes:
- `200`: Success
- `400`: Invalid User Input (handled via Pydantic or manual checks)
- `422`: Unprocessable Entity (FastAPI automatic validation error)
- `500`: System or Model Error

---

## 3. Random Forest Prediction (Titanic)
Predicts survival on the Titanic dataset using a Random Forest model.

- **URL**: `/api/v1/titanic/random-forest`
- **Method**: `POST`
- **Description**: Uses the loaded Random Forest classifier.
- **Request Body (JSON)**:
    ```json
    {
      "Pclass": 3,
      "Sex": 1,
      "Age": 22.0,
      "SibSp": 1,
      "Parch": 0,
      "Fare": 7.25,
      "FamilySize": 2
    }
    ```
- **Success Response (200 OK)**:
    ```json
    {
      "model": "Random Forest",
      "survived": 0
    }
    ```
- **Error Responses**:
    - `503 Service Unavailable`: If model is not loaded.
    - `400 Bad Request`: If prediction fails.

---

## 4. Decision Tree Prediction (Titanic)
Predicts survival on the Titanic dataset using a Decision Tree model.

- **URL**: `/api/v1/titanic/decision-tree`
- **Method**: `POST`
- **Description**: Uses the loaded Decision Tree classifier.
- **Request Body (JSON)**:
    ```json
    {
      "Pclass": 1,
      "Sex": 0,
      "Age": 38.0,
      "SibSp": 1,
      "Parch": 0,
      "Fare": 71.28,
      "FamilySize": 2
    }
    ```
- **Success Response (200 OK)**:
    ```json
    {
      "model": "Decision Tree",
      "survived": 1
    }
    ```
- **Error Responses**:
    - `503 Service Unavailable`: If model is not loaded.
    - `400 Bad Request`: If prediction fails.

