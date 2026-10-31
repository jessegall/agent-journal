from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class LaunchCommand:
    """The program line a launch runs, its folder, its environment variables, and the session it runs, none when the
    program names its own and its first hook brings it."""

    arguments: Sequence[str]
    folder: Path
    variables: Mapping[str, str]
    session: str | None = None
