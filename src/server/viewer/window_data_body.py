from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class WindowDataBody:
    """What GET /api/window answers: each key's answer by its name, and what the window declares for each key."""

    keys: Mapping[str, object]
    declared: Mapping[str, object]
