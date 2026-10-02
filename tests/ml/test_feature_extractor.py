import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from ml.features.url_feature_extractor import extract_url_features
from ml.features.feature_schema import URL_FEATURES

def test_feature_extractor():
    test_cases = [
        "https://example.com",
        "https://www.google.com",
        "http://example.com/login",
        "http://192.168.1.1/secure-update-verify-account.php?id=9928374928374",
        "https://amazon-support-update.com/signin?session=abc&token=xyz",
        "http://a.very.long.url.with.many.subdomains.com/path/to/resource?q=1&b=2&c=3"
    ]
    
    for url in test_cases:
        print(f"Testing URL: {url}")
        features = extract_url_features(url)
        
        # Verify extraction succeeds and returns a dict
        assert isinstance(features, dict), "Extraction did not return a dictionary"
        
        # Verify all expected features exist
        assert set(features.keys()) == set(URL_FEATURES), "Missing or extra features in extraction"
        
        # Verify no NaN values
        for k, v in features.items():
            assert v is not None, f"Feature {k} is None"
            assert str(v) != "nan", f"Feature {k} is NaN"
            
        # Verify output ordering
        assert list(features.keys()) == URL_FEATURES, "Feature keys are not strictly ordered according to URL_FEATURES schema"
        
        # Verify feature vector length exactly matches training schema
        assert len(features) == len(URL_FEATURES), "Feature vector length mismatch"
        
        print(" -> Extraction passed.")
        
    print("\nAll feature extractor tests passed!")

if __name__ == "__main__":
    test_feature_extractor()
