from pathlib import Path

from engine.errors.refusal import Refusal


class WritableHostedFileRefusal(Refusal):
    """The hosted file can be changed by someone other than root."""

    @classmethod
    def wrong_owner(cls, path: Path, owner_id: int) -> "WritableHostedFileRefusal":
        return cls(f"the hosted file {path} is owned by user id {owner_id}, and only root may own it", f"run chown root {path}")

    @classmethod
    def wrong_mode(cls, path: Path, mode: int) -> "WritableHostedFileRefusal":
        return cls(f"the hosted file {path} has mode {mode:04o}, and only root may write it", f"run chmod 0644 {path}")
