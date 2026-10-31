from collections.abc import Mapping
from dataclasses import dataclass, field
from pathlib import Path

from core.base.provider.session_start import SessionStart


@dataclass(frozen=True)
class Launch:
    """What the journal starts an agent program with: the journal's root, the folder the program runs in,
    its model, its launch name, the session it starts, the variables the journal sets in its environment,
    and whether it skips the program's permission prompts."""

    root: Path
    folder: Path
    model: str
    launch: str
    session: SessionStart
    variables: Mapping[str, str]
    skip_prompts: bool = field(default=True, kw_only=True)
