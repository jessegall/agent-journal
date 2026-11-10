from pathlib import Path

from engine.errors.refusal import Refusal


class WrongSocketModeRefusal(Refusal):
    """The viewer's socket does not have mode 0660."""

    @classmethod
    def wrong_mode(cls, path: Path, mode: int) -> "WrongSocketModeRefusal":
        return cls(f"the viewer socket {path} has mode {mode:04o}, and it must be 0660", f"run chmod 0660 {path}")
