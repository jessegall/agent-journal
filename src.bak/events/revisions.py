"""What revisions recognises: a document written that is a whole document, not a section of another."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class DocRevisable(Fact):
    """A document was written and its current text is to be kept as a revision if it changed."""

    n: int
