import hashlib
from pathlib import Path


class SourceHash:
    """A hash of the supervisor's code on disk, taken at its start and again when asked, so it can say an update changed its code since."""

    @staticmethod
    def current() -> str:
        digest = hashlib.sha256()
        for path in sorted(Path(__file__).parent.glob("*.py")):
            digest.update(path.name.encode() + b"\0" + path.read_bytes() + b"\0")
        return digest.hexdigest()[:16]
