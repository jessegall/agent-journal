from pathlib import Path


class RunnerNotInstalledError(OSError):
    @classmethod
    def missing(cls, path: Path) -> "RunnerNotInstalledError":
        return cls(f"the journal runner is not installed at {path}")
