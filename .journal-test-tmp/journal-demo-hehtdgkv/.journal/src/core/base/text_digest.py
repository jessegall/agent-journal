import hashlib


class TextDigest:
    """The one digest a phone code and a session token are kept by: the SHA-256 of the text, in hex."""

    def hex_digest(self, text: str) -> str:
        return hashlib.sha256(text.encode()).hexdigest()
