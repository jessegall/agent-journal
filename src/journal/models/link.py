from dataclasses import dataclass

from journal.models.model import Model
from journal.models.support.ref import Ref


@dataclass(frozen=True, kw_only=True)
class Link(Model):
    """A relation between any two rows. Models declare no relations themselves; every one is a row here, with a kind that says what it means."""

    source: Ref
    target: Ref
    kind: str
