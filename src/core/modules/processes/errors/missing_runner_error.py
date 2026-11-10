from pathlib import Path


class MissingRunnerError(OSError):
    @classmethod
    def missing(cls, path: Path) -> "MissingRunnerError":
        return cls(f"the journal runner is not installed at {path}")
