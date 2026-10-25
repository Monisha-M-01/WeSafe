import io
from typing import List, Dict, Any
from PIL import Image
from .crypto_service import compute_sha256

# Try importing imagehash if available, else use built-in Pillow perceptual hashing
try:
    import imagehash
    HAS_IMAGEHASH = True
except ImportError:
    HAS_IMAGEHASH = False

def _pure_dhash(img: Image.Image, hash_size: int = 8) -> str:
    """Computes difference hash using pure Pillow."""
    resized = img.convert('L').resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = list(resized.getdata())
    diff = []
    for row in range(hash_size):
        for col in range(hash_size):
            left = pixels[row * (hash_size + 1) + col]
            right = pixels[row * (hash_size + 1) + col + 1]
            diff.append(left > right)
    
    decimal_val = 0
    hex_str = []
    for index, val in enumerate(diff):
        if val:
            decimal_val += 2 ** (index % 4)
        if index % 4 == 3:
            hex_str.append(hex(decimal_val)[2:])
            decimal_val = 0
    return "".join(hex_str)

def _pure_ahash(img: Image.Image, hash_size: int = 8) -> str:
    """Computes average hash using pure Pillow."""
    resized = img.convert('L').resize((hash_size, hash_size), Image.Resampling.LANCZOS)
    pixels = list(resized.getdata())
    avg = sum(pixels) / len(pixels)
    diff = [p >= avg for p in pixels]
    
    decimal_val = 0
    hex_str = []
    for index, val in enumerate(diff):
        if val:
            decimal_val += 2 ** (index % 4)
        if index % 4 == 3:
            hex_str.append(hex(decimal_val)[2:])
            decimal_val = 0
    return "".join(hex_str)

def _hamming_distance(h1: str, h2: str) -> int:
    """Calculates bitwise Hamming distance between two hex hash strings."""
    if HAS_IMAGEHASH:
        try:
            return imagehash.hex_to_hash(h1) - imagehash.hex_to_hash(h2)
        except Exception:
            pass
    try:
        val1 = int(h1, 16)
        val2 = int(h2, 16)
        return bin(val1 ^ val2).count('1')
    except Exception:
        return 64

def compute_perceptual_hashes(file_bytes: bytes) -> Dict[str, str]:
    """
    Processes image strictly in memory without writing to disk.
    Computes cryptographic sha256 and perceptual pHash, dHash, aHash.
    """
    sha256 = compute_sha256(file_bytes)
    
    with Image.open(io.BytesIO(file_bytes)) as img:
        rgb_img = img.convert('RGB')
        if HAS_IMAGEHASH:
            try:
                phash_val = str(imagehash.phash(rgb_img))
                dhash_val = str(imagehash.dhash(rgb_img))
                ahash_val = str(imagehash.average_hash(rgb_img))
            except Exception:
                dhash_val = _pure_dhash(img)
                ahash_val = _pure_ahash(img)
                phash_val = dhash_val
        else:
            dhash_val = _pure_dhash(img)
            ahash_val = _pure_ahash(img)
            phash_val = dhash_val
        
    return {
        "sha256": sha256,
        "phash": phash_val,
        "dhash": dhash_val,
        "ahash": ahash_val
    }

def compare_image_against_vault(file_bytes: bytes, vault_records: List[Any]) -> Dict[str, Any]:
    """
    Compares incoming image strictly in-memory against a list of
    ProtectedImageHash records using Hamming distance.
    """
    hashes = compute_perceptual_hashes(file_bytes)
    incoming_phash_hex = hashes["phash"]
    incoming_sha256 = hashes["sha256"]
    
    matches = []
    
    for record in vault_records:
        vault_id = getattr(record, "id", None)
        vault_label = getattr(record, "label", "Protected Item")
        vault_sha256 = getattr(record, "sha256_hash", "")
        vault_phash_hex = getattr(record, "phash", "")
        
        is_exact = (vault_sha256.lower() == incoming_sha256.lower())
        dist = _hamming_distance(incoming_phash_hex, vault_phash_hex)
        similarity_pct = round(max(0.0, (64.0 - dist) / 64.0 * 100.0), 1)
        
        if is_exact:
            match_status = "EXACT_CRYPTO_MATCH"
            dist = 0
            similarity_pct = 100.0
        elif dist <= 6:
            match_status = "HIGH_PERCEPTUAL_MATCH (Modified/Cropped/Filtered)"
        elif dist <= 12:
            match_status = "PARTIAL_VISUAL_SIMILARITY"
        else:
            match_status = "NO_MATCH"
            
        matches.append({
            "vault_id": vault_id,
            "vault_label": vault_label,
            "sha256_match": is_exact,
            "hamming_distance": dist,
            "similarity_percentage": similarity_pct,
            "match_status": match_status
        })
        
    # Sort matches by closest Hamming distance
    matches.sort(key=lambda x: x["hamming_distance"])
    
    return {
        "incoming_sha256": hashes["sha256"],
        "incoming_phash": hashes["phash"],
        "incoming_dhash": hashes["dhash"],
        "matches": matches
    }
