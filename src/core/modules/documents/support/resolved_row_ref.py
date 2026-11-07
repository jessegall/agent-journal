from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True)
class ResolvedRowRef:
    """A row reference with its registered model resolved."""

    model: type[Model]
    row_id: int
