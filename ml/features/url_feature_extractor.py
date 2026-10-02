import re
from urllib.parse import urlparse
import sys
import os

# Ensure project root is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from ml.features.feature_schema import URL_FEATURES

# Sensitive words and brands based on common phishing indicators
SENSITIVE_WORDS = ['login', 'signin', 'verify', 'account', 'secure', 'update', 'banking', 'confirm', 'password', 'credential', 'support', 'service', 'admin', 'billing']
BRAND_NAMES = ['google', 'apple', 'microsoft', 'amazon', 'facebook', 'paypal', 'netflix', 'yahoo', 'whatsapp', 'instagram']

def extract_url_features(url: str) -> dict:
    """
    Extracts strictly URL-based lexical and structural features.
    Must return exactly the features in URL_FEATURES schema.
    """
    if not url.startswith('http'):
        url = 'http://' + url
        
    parsed = urlparse(url)
    hostname = parsed.netloc or ''
    path = parsed.path or ''
    query = parsed.query or ''
    
    # 1. NumDots
    num_dots = url.count('.')
    
    # 2. SubdomainLevel
    # Approximation: number of dots in hostname minus 1 (for .com, etc.)
    # E.g. www.google.com -> 2 dots -> level 1
    subdomain_level = max(0, hostname.count('.') - 1)
    
    # 3. PathLevel
    path_level = path.strip('/').count('/') if path else 0
    
    # 4. UrlLength
    url_length = len(url)
    
    # 5. NumDash
    num_dash = url.count('-')
    
    # 6. NumDashInHostname
    num_dash_in_hostname = hostname.count('-')
    
    # 7. AtSymbol
    at_symbol = 1 if '@' in url else 0
    
    # 8. TildeSymbol
    tilde_symbol = 1 if '~' in url else 0
    
    # 9. NumUnderscore
    num_underscore = url.count('_')
    
    # 10. NumPercent
    num_percent = url.count('%')
    
    # 11. NumQueryComponents
    num_query_components = len(query.split('&')) if query else 0
    
    # 12. NumAmpersand
    num_ampersand = url.count('&')
    
    # 13. NumHash
    num_hash = url.count('#')
    
    # 14. NumNumericChars
    num_numeric_chars = sum(c.isdigit() for c in url)
    
    # 15. NoHttps
    no_https = 1 if parsed.scheme != 'https' else 0
    
    # 16. RandomString
    # Simple heuristic: sequence of more than 15 alphanumeric characters without special chars
    random_string = 1 if re.search(r'[A-Za-z0-9]{16,}', path + query) else 0
    
    # 17. IpAddress
    # Check if hostname is an IPv4 address
    ip_address = 1 if re.match(r'^(\d{1,3}\.){3}\d{1,3}$', hostname) else 0
    
    # 18. DomainInSubdomains
    # Heuristic: looking for 'com', 'org', 'net' etc. in the hostname before the actual TLD
    parts = hostname.split('.')
    domain_in_subdomains = 1 if len(parts) > 2 and any(tld in parts[:-2] for tld in ['com', 'net', 'org', 'co', 'info']) else 0
    
    # 19. DomainInPaths
    domain_in_paths = 1 if any(tld in path for tld in ['.com', '.net', '.org', '.info', '.co']) else 0
    
    # 20. HttpsInHostname
    https_in_hostname = 1 if 'https' in hostname else 0
    
    # 21. HostnameLength
    hostname_length = len(hostname)
    
    # 22. PathLength
    path_length = len(path)
    
    # 23. QueryLength
    query_length = len(query)
    
    # 24. DoubleSlashInPath
    double_slash_in_path = 1 if '//' in path else 0
    
    # 25. NumSensitiveWords
    num_sensitive_words = sum(url.lower().count(word) for word in SENSITIVE_WORDS)
    
    # 26. EmbeddedBrandName
    embedded_brand_name = 1 if any(brand in path.lower() or brand in hostname.lower() for brand in BRAND_NAMES) else 0
    
    # Create the raw dictionary
    feature_dict = {
        "NumDots": num_dots,
        "SubdomainLevel": subdomain_level,
        "PathLevel": path_level,
        "UrlLength": url_length,
        "NumDash": num_dash,
        "NumDashInHostname": num_dash_in_hostname,
        "AtSymbol": at_symbol,
        "TildeSymbol": tilde_symbol,
        "NumUnderscore": num_underscore,
        "NumPercent": num_percent,
        "NumQueryComponents": num_query_components,
        "NumAmpersand": num_ampersand,
        "NumHash": num_hash,
        "NumNumericChars": num_numeric_chars,
        "NoHttps": no_https,
        "RandomString": random_string,
        "IpAddress": ip_address,
        "DomainInSubdomains": domain_in_subdomains,
        "DomainInPaths": domain_in_paths,
        "HttpsInHostname": https_in_hostname,
        "HostnameLength": hostname_length,
        "PathLength": path_length,
        "QueryLength": query_length,
        "DoubleSlashInPath": double_slash_in_path,
        "NumSensitiveWords": num_sensitive_words,
        "EmbeddedBrandName": embedded_brand_name
    }
    
    # Enforce order based on schema
    ordered_features = {k: feature_dict[k] for k in URL_FEATURES}
    
    return ordered_features

