from dataclasses import dataclass

from journal.models.node_kind import NodeKind


@dataclass(frozen=True)
class Entry:
    """One thing a node may be: the kind, the key a node names it by, its title and what it means, and whether it takes a text."""

    kind: NodeKind
    key: str
    title: str
    about: str
    takes_text: bool = False
    group: str = ""
    """The row events of one table share their table's noun as a group; an agent event stands alone."""
    providers: tuple[str, ...] = ("claude", "codex")
    """The agents it works for: Codex delivers no MessageDisplay hook, so a turn written is Claude's alone."""
