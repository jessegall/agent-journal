from dataclasses import dataclass
from core.base.model.model import Model


@dataclass(frozen=True)
class CachedEventRow:
    row: Model | None
    generation: tuple[int, int]

    @property
    def version(self) -> int | None:
        return self.row.version if self.row is not None else None
