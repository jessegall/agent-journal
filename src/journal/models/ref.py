from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class Ref:
    """One end of a link: a model's table and id, stored as two columns and written as task:12."""

    type: str
    id: int

    @classmethod
    def to(cls, model: Model) -> "Ref": ...

    @classmethod
    def parse(cls, text: str) -> "Ref": ...

    def __str__(self) -> str: ...
