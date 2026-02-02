from fastapi import APIRouter, HTTPException
from app.schema.linear_reg import PassengerInput
from app.ml.linear_model import get_prediction

router = APIRouter(
    prefix="/api/v1/ml",
    tags=["Linear Regression"]
)

@router.post("/predict")
def predict_profit(data: PassengerInput):
    # Log incoming request
    print(f"Request received: Passengers = {data.passengers}")
    
    # 1. Input Validation (Proper Error Handling)
    if data.passengers < 0:
        raise HTTPException(status_code=400, detail="Passenger count cannot be negative.")
    
    if data.passengers > 1000000: # Example logic limit
        raise HTTPException(status_code=400, detail="Passenger count too high for this model.")

    try:
        # 2. Use the pre-trained model
        prediction, rmse = get_prediction(data.passengers)

        return {
            "status": "success",
            "data": {
                "passengers": data.passengers,
                "predicted_profit": prediction,
                "rmse": rmse,
                "message": "rmse is based on training error (not accuracy)"
            }
        }
    except Exception as e:
        # 3. Handle model failures
        raise HTTPException(status_code=500, detail=f"Model Inference Failed: {str(e)}")
