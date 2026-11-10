from dataclasses import dataclass
from engine.model.model import Model
from engine.model.view_model import ViewModel


@dataclass(frozen=True)
class CachedEventRow:
    row: Model | ViewModel | None
    generation: tuple[int, int]

    @property
    def version(self) -> int | None:
        return self.row.version if isinstance(self.row, Model) else None
