# backend/app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import linear_reg as linearReg, classification, titanic
from app.ml import random_forest, decision_tree

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load ML models ONCE when the server starts
    print("--- Starting Server: Loading Models ---")
    random_forest.load_model()
    decision_tree.load_model()
    yield
    print("--- Stopping Server ---")

app = FastAPI(lifespan=lifespan)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routes
app.include_router(linearReg.router)
app.include_router(classification.router)
app.include_router(titanic.router)

@app.get("/")
def read_root():
    return {"message": "FastAPI ML Server is Running"}