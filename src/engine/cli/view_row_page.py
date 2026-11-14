from dataclasses import dataclass

from engine.model.view_model import ViewModel


@dataclass(frozen=True)
class ViewRowPage:
    """What a window draws from its view: the page of rows it asked for, holding only the fields of a row."""

    rows: tuple[ViewModel, ...]

    def json(self) -> dict[str, object]:
        return {"rows": [row.json() for row in self.rows]}
