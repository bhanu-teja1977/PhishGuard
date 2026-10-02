import os
import joblib
import json
import logging

logger = logging.getLogger(__name__)

class ModelService:
    def __init__(self):
        self.model = None
        self.feature_schema = None
        self.model_metadata = None
        self.is_loaded = False
        self._load_model()

    def _load_model(self):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../models"))
        model_path = os.path.join(base_dir, "phishguard_model.joblib")
        schema_path = os.path.join(base_dir, "feature_schema.json")
        meta_path = os.path.join(base_dir, "model_metadata.json")

        try:
            if os.path.exists(model_path):
                self.model = joblib.load(model_path)
            
            if os.path.exists(schema_path):
                with open(schema_path, "r") as f:
                    self.feature_schema = json.load(f).get("URL_FEATURES", [])
                    
            if os.path.exists(meta_path):
                with open(meta_path, "r") as f:
                    self.model_metadata = json.load(f)

            if self.model is not None and self.feature_schema:
                self.is_loaded = True
                logger.info("Model and schema loaded successfully.")
            else:
                logger.error("Failed to load model or schema.")
        except Exception as e:
            logger.error(f"Error loading model artifacts: {e}")
            self.is_loaded = False

    def get_model(self):
        return self.model
        
    def get_schema(self):
        return self.feature_schema
        
    def get_metadata(self):
        return self.model_metadata

model_service = ModelService()
