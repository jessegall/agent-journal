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
