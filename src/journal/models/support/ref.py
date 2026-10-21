from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class Ref:
    """One end of a link: a model's table and id, written as tasks:12."""

    type: str
    id: int

    @classmethod
    def build(cls, model: Model) -> "Ref":
        return cls(model.table(), model.id)

    @classmethod
    def parse(cls, text: str) -> "Ref":
        type_, _, id = text.partition(":")
        return cls(type_, int(id))

    def __str__(self) -> str:
        return f"{self.type}:{self.id}"
