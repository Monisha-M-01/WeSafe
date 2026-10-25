import hashlib
import io
from typing import List, Dict, Any
from PIL import Image, ExifTags

def compute_sha256(file_bytes: bytes) -> str:
    """Returns lowercase hex SHA-256 digest of input bytes."""
    return hashlib.sha256(file_bytes).hexdigest()

def compute_case_merkle_root(sha256_list: List[str]) -> str:
    """
    Sorts evidence SHA-256 hashes deterministically and computes a
    pairwise Merkle tree root hash. If empty, returns empty string.
    If 1 item, hashes it once to seal the root.
    """
    if not sha256_list:
        return ""
    
    # Deterministic sort
    current_level = sorted([h.lower() for h in sha256_list if h])
    if not current_level:
        return ""
    
    if len(current_level) == 1:
        return hashlib.sha256(current_level[0].encode('utf-8')).hexdigest()

    while len(current_level) > 1:
        next_level = []
        for i in range(0, len(current_level), 2):
            left = current_level[i]
            if i + 1 < len(current_level):
                right = current_level[i + 1]
            else:
                right = left  # duplicate odd leaf
            combined = hashlib.sha256((left + right).encode('utf-8')).hexdigest()
            next_level.append(combined)
        current_level = next_level

    return current_level[0]

def extract_safe_exif(file_bytes: bytes) -> Dict[str, Any]:
    """
    Extracts image metadata safely in memory without crashing on stripped
    social media screenshots.
    """
    metadata: Dict[str, Any] = {
        "dimensions": None,
        "format": None,
        "mode": None,
        "exif_tags": {}
    }
    try:
        with Image.open(io.BytesIO(file_bytes)) as img:
            metadata["dimensions"] = f"{img.width}x{img.height}"
            metadata["format"] = img.format
            metadata["mode"] = img.mode

            exif_raw = img.getexif()
            if exif_raw:
                for tag_id, value in exif_raw.items():
                    tag_name = ExifTags.TAGS.get(tag_id, str(tag_id))
                    # Only preserve string/numeric values that are json serializable
                    if isinstance(value, (str, int, float)):
                        metadata["exif_tags"][tag_name] = value
                    elif isinstance(value, bytes):
                        metadata["exif_tags"][tag_name] = value.hex()[:32]
    except Exception as e:
        metadata["error"] = str(e)

    return metadata
