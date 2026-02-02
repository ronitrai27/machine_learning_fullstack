from pydantic import BaseModel

class PassengerInput(BaseModel):
    passengers: int
    
class StudentMarksInput(BaseModel):
    studentMarks: float

# for decision tree and random forest
class TitanicInput(BaseModel):
    Pclass: int
    Sex: int
    Age: float
    SibSp: int
    Parch: int
    Fare: float
    FamilySize: int