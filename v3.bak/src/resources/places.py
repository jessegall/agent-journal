"""Where the journal keeps what runs: the folders of its runtime, worked out from the folder of the journal and nothing else."""

from pathlib import Path

RUNTIME = "runtime"
LAUNCHED = "launched.json"
"""What the supervisor leaves in a session's folder about the agent it started; the supervisor keeps the same name beside its own code."""


def folder(root: Path) -> Path:
    return Path(root) / RUNTIME


def profiles(root: Path) -> Path:
    return folder(root) / "slow"


def sessions(root: Path) -> Path:
    return folder(root) / "sessions"


def session_file(root: Path, session: str, name: str) -> Path:
    return sessions(root) / session / name


UPGRADE_MARK = "upgrading"


def upgrade_mark(root: Path) -> Path:
    return folder(root) / UPGRADE_MARK
