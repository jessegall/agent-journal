from dataclasses import dataclass

from core.base.driver.hook_fields import mapping, text, texts


@dataclass(frozen=True)
class Classification:
    """What a shell part is and does: its category, as the command table names it, and its effects."""

    category: str
    effects: tuple[str, ...]

    @classmethod
    def parsed(cls, data: object) -> "Classification":
        fields = mapping(data, "classification")
        return cls(text(fields, "kind"), texts(fields, "effects"))
