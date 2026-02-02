from fastapi import APIRouter, HTTPException
import pandas as pd
from app.schema.linear_reg import TitanicInput
from app.ml import random_forest, decision_tree

router = APIRouter(
    prefix="/api/v1/titanic",
    tags=["Titanic Predictions"]
)

# REMEMBER -  ML models were trained using column names (like "Age", "Sex"), but we were sending them raw numbers without labels.
# RANDOM FOREST ENDPOINT
@router.post("/random-forest")
def predict_rf(data: TitanicInput):
    # Using Pandas DataFrame to include feature names and avoid sklearn UserWarning
    features = pd.DataFrame([{
        "Pclass": data.Pclass,
        "Sex": data.Sex,
        "Age": data.Age,
        "SibSp": data.SibSp,
        "Parch": data.Parch,
        "Fare": data.Fare,
        "FamilySize": data.FamilySize
    }])
    
    prediction = random_forest.get_prediction(features)
    
    if prediction is None:
        raise HTTPException(status_code=503, detail="Random Forest model not loaded")
        
    return {"model": "Random Forest", "survived": int(prediction[0])}

# DECISION TREE ENDPOINT
@router.post("/decision-tree")
def predict_dt(data: TitanicInput):
    features = pd.DataFrame([{
        "Pclass": data.Pclass,
        "Sex": data.Sex,
        "Age": data.Age,
        "SibSp": data.SibSp,
        "Parch": data.Parch,
        "Fare": data.Fare,
        "FamilySize": data.FamilySize
    }])
    
    prediction = decision_tree.get_prediction(features)
    
    if prediction is None:
        raise HTTPException(status_code=503, detail="Decision Tree model not loaded")
        
    return {"model": "Decision Tree", "survived": int(prediction[0])}
