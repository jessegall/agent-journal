from dataclasses import dataclass


@dataclass(frozen=True)
class UpdateTarget:
    """What an update moves the journal to: the git ref the installer takes, a release's tag or a branch, and its label in the chat and the mark."""

    ref: str
    label: str
