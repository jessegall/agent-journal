from collections.abc import Mapping
from dataclasses import dataclass
from pathlib import Path

from core.base.provider.session_start import SessionStart


@dataclass(frozen=True)
class Launch:
    """What the journal starts an agent program with: the journal's root, the folder the program runs in, its model,
    its launch name, the session it starts, and the variables the journal sets in its environment."""

    root: Path
    folder: Path
    model: str
    launch: str
    session: SessionStart
    variables: Mapping[str, str]
