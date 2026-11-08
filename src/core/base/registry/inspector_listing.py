from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class InspectorListing:
    """A registered inspector as listed for the viewer: its noun, the module that supplies it and that module's
    fingerprint, the read that loads its row, its words, width and parts, the events that reload it, its links
    section (none for a row without one), whether its row can be shared, whether it lists the row's fields and whether a part of it draws the row's text."""

    noun: str
    module: str
    fingerprint: str
    reads: str
    label: str
    title: str
    description: str
    width: str
    components: Sequence[Mapping[str, str]]
    comments: bool
    events: Sequence[str]
    links: Mapping[str, object] | None
    shareable: bool
    lists_fields: bool = False
    draws_text: bool = False
