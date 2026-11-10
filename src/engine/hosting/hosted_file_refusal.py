from pathlib import Path

from engine.errors.refusal import Refusal


class HostedFileRefusal(Refusal):
    """The hosted file cannot be read as the choices of a hosted journal."""

    @classmethod
    def malformed(cls, path: Path, error: Exception) -> "HostedFileRefusal":
        return cls(f"the hosted file {path} is not valid TOML: {error}", "fix the file, then start the journal again")

    @classmethod
    def missing_key(cls, path: Path, key: str) -> "HostedFileRefusal":
        return cls(f"the hosted file {path} has no key {key}", f"add {key} to the file; the journal invents no value for it")

    @classmethod
    def wrong_type(cls, path: Path, key: str, expected: type) -> "HostedFileRefusal":
        return cls(f"the key {key} of the hosted file {path} must be a {expected.__name__}", f"write {key} as a {expected.__name__}")
