from fastapi import APIRouter, HTTPException
from app.schema.linear_reg import StudentMarksInput
from app.ml.classification_model import get_classification

router = APIRouter(
    prefix="/api/v1/ml",
    tags=["Logistic Regression"]
)

@router.post("/logistic")
def logistic_classification(data: StudentMarksInput):
    print(f"Request received: Marks = {data.studentMarks}")

    if data.studentMarks < 0 or data.studentMarks > 100:
        raise HTTPException(status_code=400, detail="Marks must be between 0 and 100.")

    try:
        # using the pre-trained model.....
        result = get_classification(data.studentMarks)
        
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        # Handling errors.....
        raise HTTPException(status_code=500, detail=f"Classification Model Failed: {str(e)}")


