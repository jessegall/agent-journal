from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class OutgoingItem:
    """A local row ready to be shared: the fields that are sent, their digest, and a warning for the user when the
    text names rows whose numbers mean something else in another journal."""

    fields: Mapping[str, object]
    digest: str
    warning: str
