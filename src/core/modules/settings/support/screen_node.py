from dataclasses import dataclass


@dataclass(frozen=True)
class ScreenNode:
    """One setting of a screen as a viewer draws it: what it is, which component draws it, where it sits, what
    it holds now and where that came from, and the keys that must be on for it to show."""

    key: str
    kind: str
    component: str
    section: str
    parent: str | None
    title: str
    description: str
    value: object
    default: object
    source: str
    choices: tuple[str, ...]
    rule: str
    requires: tuple[str, ...]
    read_only: bool
