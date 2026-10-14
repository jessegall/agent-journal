"""What the file feed feature recognises: an edit of a file that is not a picture, whose change is to be ready to show."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class EditToDiff(Fact):
    """The files an edit stored before and after it, whose difference the feed shows."""

    before: str
    after: str
