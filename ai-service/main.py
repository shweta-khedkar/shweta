from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="PrivSyncro AI Microservice", version="1.0.0")

class AnomalyRequest(BaseModel):
    user_id: str
    action: str
    location: str
    timestamp: str

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "PrivSyncro AI Microservice"}

@app.post("/predict-anomaly")
def predict_anomaly(req: AnomalyRequest):
    # Placeholder for scikit-learn anomaly detection model
    # Simulate processing
    score = 0.1 # Example score, < 0.75 is normal
    is_anomaly = score > 0.75
    
    return {
        "user_id": req.user_id,
        "anomaly_score": score,
        "is_anomaly": is_anomaly,
        "message": "Anomaly detected" if is_anomaly else "Normal activity"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
