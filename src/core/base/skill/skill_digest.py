import hashlib

DIGEST_CHARACTERS = 12


class SkillDigest:
    """The short fingerprint of a skill's text, which changes whenever the text does."""

    @staticmethod
    def of(text: str) -> str:
        return hashlib.sha1(text.encode()).hexdigest()[:DIGEST_CHARACTERS]
