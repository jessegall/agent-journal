from dataclasses import dataclass

from core.base.driver.hook_fields import mapping, number, text


@dataclass(frozen=True)
class DiffCount:
    """The lines an edit or a write adds and removes in one file, and whether the file existed before."""

    path: str
    existed: bool
    lines_added: int
    lines_removed: int

    @classmethod
    def parsed(cls, data: object) -> "DiffCount":
        fields = mapping(data, "diff")
        return cls(text(fields, "path"), fields.get("existed") is True, number(fields, "lines_added"), number(fields, "lines_removed"))
